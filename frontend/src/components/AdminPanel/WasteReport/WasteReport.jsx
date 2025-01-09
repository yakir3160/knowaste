import React, { useState } from 'react';
import AdminPanelContainer from "../AdminPanelContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GlobalField from "../../Common/inputs/GlobalField";
import Card from '../../Common/Card/Card';
import Button from '../../Common/Button/Button';
import { useItemsContext } from "../../../contexts/ItemsContext";
import useFilteredItems from "../../../Hooks/Items/useFilteredItems";
import { v4 as generateUniqueID } from 'uuid';
import WasteReportsHistory from "./WasteReportsHistory";
import TabNavigation from "../../Common/TabNavigation/TabNavigation";
import { tableStyles } from '../../../css/tableStyles';
import { CircleX } from "lucide-react";
import { measurementUnits, WASTE_REASONS } from "../../../constants/Constants";

// Constants
const UNIT_MULTIPLIERS = {
    'kg': { 'g': 1000 },
    'g': { 'kg': 0.001 },
    'l': { 'ml': 1000 },
    'ml': { 'l': 0.001 }
};

const INITIAL_VALUES = {
    CategoryName: "",
    ingredientId: "",
    ingredientName: "",
    quantity: "",
    unit: "",
    reason: "",
};

const VALIDATION_SCHEMA = Yup.object({
    CategoryName: Yup.string().required("Category is required"),
    ingredientName: Yup.string().required("Ingredient is required"),
    quantity: Yup.number().required("Quantity is required").positive("Must be positive"),
    unit: Yup.string().required("Unit is required"),
    reason: Yup.string().required("Reason is required"),
});

const WasteReport = () => {
    // Context and Custom Hooks
    const { inventoryItems, inventoryCategories, wasteReports, addReport } = useItemsContext();
    const { filteredItems, setSelectedCategory } = useFilteredItems(inventoryItems);

    // State
    const [reportItems, setReportItems] = useState([]);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalCost, setTotalCost] = useState(0);
    const [activeTab, setActiveTab] = useState('Items');
    const [itemCost, setItemCost] = useState(0);
    const [ingredientId, setIngredientId] = useState('');
    const [saving, setSaving] = useState(false);

    // Utility Functions
    const ingredientPriceProfile = (ingredientId) => {
        const ingredient = inventoryItems.find(item => item.ingredientId === ingredientId);
        return {
            price: ingredient?.pricePerUnit ?? 0,
            unit: ingredient?.unit ?? '',
        };
    };

    const calculateCost = (ingredientId, quantity, unit) => {
        if (!ingredientId || !quantity) return 0;
        const profile = ingredientPriceProfile(ingredientId);
        const multiplier = UNIT_MULTIPLIERS[unit]?.[profile.unit] ?? 1;
        return Number((profile.price * quantity * multiplier).toFixed(2));
    };

    // Event Handlers
    const handleDeleteItem = (indexToDelete) => {
        setReportItems(prev => {
            const updatedItems = prev.filter((_, index) => index !== indexToDelete);
            const newTotalCost = updatedItems.reduce((sum, item) => sum + item.cost, 0);
            setTotalCost(newTotalCost);
            return updatedItems;
        });
    };

    const handleAddItem = (values, { resetForm }) => {
        const selectedIngredient = filteredItems.find(item => item.name === values.ingredientName);
        if (selectedIngredient) {
            setReportItems(prev => [...prev, {
                ...values,
                quantity: Number(values.quantity),
                ingredientId: selectedIngredient.ingredientId,
                cost: itemCost,
            }]);
            setTotalCost(prev => prev + itemCost);
            resetForm();
            setItemCost(0);
        }
    };

    const handleSubmitReport = async () => {
        try {
            setSaving(true);
            await addReport({
                reportType: 'waste',
                reportId: generateUniqueID(),
                date: new Date(reportDate),
                items: reportItems,
                summary: {
                    totalItems: reportItems.length,
                    totalCost: totalCost
                }
            }, 'waste');
            setReportItems([]);
            setTotalCost(0);
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
        }
    };

    // Field Change Handlers
    const handleQuantityChange = (e, values, setFieldValue) => {
        const quantity = e.target.value;
        setFieldValue("quantity", quantity);

        if (ingredientId && values.unit) {
            setItemCost(calculateCost(ingredientId, quantity, values.unit));
        }
    };

    const handleUnitChange = (e, values, setFieldValue) => {
        const newUnit = e.target.value;
        setFieldValue("unit", newUnit);

        if (ingredientId && values.quantity) {
            setItemCost(calculateCost(ingredientId, values.quantity, newUnit));
        }
    };

    const handleIngredientChange = (e, setFieldValue) => {
        const selectedItem = filteredItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setIngredientId(selectedItem.ingredientId);
            setFieldValue('ingredientName', e.target.value);
            setFieldValue('unit', selectedItem.unit);
        }
    };

    // Render Functions
    const renderWasteForm = (values, setFieldValue) => (
        <Form className="gap-5 w-full" noValidate>
            <div className="flex flex-col justify-between items-center md:flex-row py-4 gap-2">
                <GlobalField
                    type="date"
                    name="reportDate"
                    label="Report Date"
                    value={reportDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setReportDate(e.target.value)}
                />
                <h3 className="font-semibold text-xl">Total Cost: {totalCost.toFixed(2)} ₪</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-2 border-secondary p-4 rounded-sm">
                <GlobalField
                    type="select"
                    name="CategoryName"
                    label="Category"
                    options={[
                        { value: '', label: 'Select Category' },
                        ...inventoryCategories.map(category => ({
                            value: category,
                            label: category
                        }))
                    ]}
                    onChange={(e) => {
                        setFieldValue("CategoryName", e.target.value);
                        setSelectedCategory(e.target.value);
                    }}
                />
                <GlobalField
                    type="select"
                    name="ingredientName"
                    label="Ingredient"
                    options={[
                        { value: '', label: 'Select Ingredient' },
                        ...filteredItems.map(item => ({
                            value: item.name,
                            label: item.name
                        }))
                    ]}
                    onChange={(e) => handleIngredientChange(e, setFieldValue)}
                />
                <GlobalField
                    type="number"
                    name="quantity"
                    label="Quantity"
                    min="0"
                    step="0.1"
                    value={values.quantity}
                    onChange={(e) => handleQuantityChange(e, values, setFieldValue)}
                />
                <GlobalField
                    type="select"
                    name="unit"
                    label="Unit"
                    value={values.unit}
                    options={[
                        { value: '', label: 'Select Unit' },
                        ...measurementUnits.map(unit => ({label: unit, value: unit}))
                    ]}
                    onChange={(e) => handleUnitChange(e, values, setFieldValue)}
                />
                <GlobalField
                    type="select"
                    name="reason"
                    label="Reason"
                    options={[
                        { value: '', label: 'Select Reason' },
                        ...WASTE_REASONS
                    ]}
                />
                <Button
                    type="submit"
                    className="w-full h-fit self-end"
                    disabled={saving}
                >
                    Add Item
                </Button>
                <div className="flex flex-col justify-center items-center font-semibold">
                    <span className="text-titles font-semibold text-md text-center">
                        Current Item Cost (₪)
                    </span>
                    <span className="text-md text-center">
                        {itemCost} ₪
                    </span>
                </div>
            </div>
        </Form>
    );

    return (
        <AdminPanelContainer pageTitle="Waste Report" layout="p-2 flex flex-col">
            <TabNavigation
                tabs={['Items', 'History']}
                onTabChange={setActiveTab}
            />
            {activeTab === 'Items' ? (
                <Card className="bg-white border-none p-5 h-full flex">
                    <h1 className="text-2xl text-center mb-5">Add Waste Items</h1>
                    <Formik
                        initialValues={INITIAL_VALUES}
                        validationSchema={VALIDATION_SCHEMA}
                        onSubmit={handleAddItem}
                    >
                        {({ values, setFieldValue }) => renderWasteForm(values, setFieldValue)}
                    </Formik>
                    <div className="m-8 w-full overflow-x-auto flex flex-col items-center">
                        <h2 className="text-xl mb-4">Items in Report</h2>
                        {reportItems.length > 0 ? (
                            <table className="min-w-full border-collapse">
                                <thead className="bg-secondary">
                                <tr>
                                    {['Category', 'Name', 'Quantity', 'Unit', 'Reason', 'Cost (₪)', 'Actions'].map(header => (
                                        <th key={header} className={tableStyles.thClass}>{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {reportItems.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className={tableStyles.tableCellClass}>{item.CategoryName}</td>
                                        <td className={tableStyles.tableCellClass}>{item.ingredientName}</td>
                                        <td className={tableStyles.tableCellClass}>{item.quantity}</td>
                                        <td className={tableStyles.tableCellClass}>{item.unit}</td>
                                        <td className={tableStyles.tableCellClass}>{item.reason}</td>
                                        <td className={tableStyles.tableCellClass}>{item.cost.toFixed(2)}</td>
                                        <td className={tableStyles.tableCellClass}>
                                            <CircleX
                                                className="text-errorRed cursor-pointer"
                                                onClick={() => handleDeleteItem(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No items added yet.</p>
                        )}
                    </div>
                    <div className="self-end w-full md:w-fit p-2">
                        <Button
                            onClick={handleSubmitReport}
                            className="w-full md:w-1/4 border-2 border-lime"
                            disabled={saving || reportItems.length === 0}
                        >
                            {saving ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </Card>
            ) : (
                <WasteReportsHistory wasteReports={wasteReports} />
            )}
        </AdminPanelContainer>
    );
};

export default WasteReport;