import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Plus, Send, CircleX } from 'lucide-react';
import AdminPanelContainer from "../AdminPanelContainer";
import GlobalField from "../../Common/inputs/GlobalField";
import Card from '../../Common/Card/Card';
import Button from '../../Common/Button/Button';
import { useAuthContext } from "../../../contexts/AuthContext";
import { v4 as generateUniqueID } from 'uuid';
import { tableStyles } from '../../../css/tableStyles';
import TabNavigation from "../../Common/TabNavigation/TabNavigation";
import { useItemsContext } from "../../../contexts/ItemsContext";
import { measurementUnits } from "../../../constants/Constants";
import { wasteReportSchema } from '../../../schemas/firestoreSchemas/wasteReportSchema';
import WasteReportsHistory from "./WasteReportsHistory";
import useFilteredItems from "../../../Hooks/Items/useFilteredItems";

const WASTE_REASONS = [
    { value: 'expired', label: 'Expired' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'quality', label: 'Quality Issues' },
    { value: 'overproduction', label: 'Overproduction' },
    { value: 'storage', label: 'Storage Error' },
    { value: 'other', label: 'Other' }
];

const initialValues = {
    date: new Date().toISOString().split('T')[0],
    items: [
        {
            CategoryName: '',
            ingredientId: '',
            ingredientName: '',
            quantity: '',
            unit: '',
            reason: '',
            cost: 0
        }
    ]
};

const WasteReport = () => {
    const { inventoryItems,inventoryCategories, wasteReports } = useItemsContext();
    const [activeTab, setActiveTab] = useState('Items');
    const [wasteItems, setWasteItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const { addReport } = useItemsContext();
    const { setSelectedCategory, filteredItems } = useFilteredItems(inventoryItems);

    const UNIT_MULTIPLIERS = {
        'kg': { 'g': 1000 },
        'g': { 'kg': 0.001 },
        'l': { 'ml': 1000 },
        'ml': { 'l': 0.001 }
    };

    const updateTotalCost = (items) => {
        const total = items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
        setTotalCost(total);
    };

    const ingredientPriceProfile = (ingredientId) => {
        const ingredient = inventoryItems.find(item => item.ingredientId === ingredientId);
        return {
            price: ingredient?.pricePerUnit ?? 0,
            unit: ingredient?.unit ?? '',
        };
    };

    const calculateCost = (ingredientId, quantity, unit) => {
        const profile = ingredientPriceProfile(ingredientId);
        const multiplier = UNIT_MULTIPLIERS[unit]?.[profile.unit] ?? 1;
        return profile.price * quantity * multiplier;
    };

    const handleAddItem = (values, setFieldValue) => {
        const newItem = {
            ingredientId: '',
            ingredientName: '',
            quantity: 0,
            unit: '',
            reason: '',
            cost: 0
        };
        setFieldValue('items', [...values.items, newItem]);
    };

    const handleSubmitReport = async (values, { resetForm }) => {
        try {
            setSaving(true);
            const reportData = {
                reportType: 'waste',
                reportId: generateUniqueID(),
                date: values.date,
                items: values.items,
                summary: {
                    totalItems: values.items.length,
                    totalCost: values.items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0)
                },
            };
            console.log('Submitting report:', reportData);
            await addReport(reportData, 'waste');
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
            resetForm();
        }
    };

    return (
        <AdminPanelContainer pageTitle="Waste Report" layout="p-2 flex flex-col">
            <TabNavigation tabs={['Items', 'History']} onTabChange={(tab) => setActiveTab(tab)} />
            {activeTab === 'Items' && (
                <Card className="bg-white border-none h-full">
                    <h1 className="text-2xl text-center mb-5">Add Waste Items</h1>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={wasteReportSchema}
                        onSubmit={handleSubmitReport}
                    >
                        {({values, setFieldValue}) => (
                            <Form>
                                <div className="w-full p-5 space-y-4">
                                    <div className="flex justify-between items-center ">
                                        <GlobalField
                                            type="date"
                                            name="date"
                                            label="Report Date"
                                            value={values.date}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setFieldValue('date', e.target.value)}
                                        />
                                        <div className="text-xl font-bold text-center">
                                            Total Cost: {totalCost} ₪
                                        </div>
                                    </div>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-2  border-2 border-secondary p-4 rounded-sm ">
                                        <GlobalField
                                            type="select"
                                            name="items[0].CategoryName"
                                            label="Category"
                                            options={[
                                                { value: '', label: 'Select Category' },
                                                ...inventoryCategories.map(category => ({ value: category, label: category }))
                                            ]}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                setFieldValue('items[0].CategoryName', e.target.value);
                                            }}
                                        />
                                        <GlobalField
                                            type="select"
                                            name="items[0].ingredientName"
                                            label="Name"
                                            options={filteredItems.map(item => ({ value: item.name, label: item.name }))}
                                        />
                                        <GlobalField
                                            type="number"
                                            name="items[0].quantity"
                                            label="Quantity"
                                            min={0}
                                            step={0.1}
                                        />
                                        <GlobalField
                                            type="select"
                                            name="items[0].unit"
                                            label="Unit"
                                            options={ measurementUnits.map(unit => ({ value: unit, label: unit }))}
                                        />
                                        <GlobalField
                                            type="select"
                                            name="items[0].reason"
                                            label="Reason"
                                            options={WASTE_REASONS}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full h-fit border-2 border-transparent self-end"
                                            disabled={saving}
                                        >
                                            Add Item
                                        </Button>
                                        <div className={`flex flex-col col-span-full`}>
                                            <span className="text-titles font-semibold text-md text-center">
                                                Total Item Waste Cost (₪)
                                            </span>
                                            <span className="text-md text-center">
                                                {values.quantity * (filteredItems.find(item => item.name === values.name)?.price || 0)} ₪
                                            </span>

                                        </div>
                                    </div>

                                    <div className="m-8 w-full overflow-x-auto flex flex-col items-center">
                                        <h2 className="text-xl mb-4">Items in Report</h2>
                                        {wasteItems.length > 0 ? (
                                            <table className="min-w-full border-collapse">
                                                <thead className="bg-secondary">
                                                <tr>
                                                    {['Category', 'SubCategory', 'Dish', 'Quantity', 'Total Item Sales (₪)'].map(header => (
                                                        <th key={header} className={tableStyles.thClass}>{header}</th>
                                                    ))}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {wasteItems.map((item, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className={tableStyles.tableCellClass}>{item.category}</td>
                                                        <td className={tableStyles.tableCellClass}>{item.subCategory || 'N/A'}</td>
                                                        <td className={tableStyles.tableCellClass}>{item.menuItem}</td>
                                                        <td className={tableStyles.tableCellClass}>{item.quantity}</td>
                                                        <td className={tableStyles.tableCellClass}>{item.totalPrice} ₪</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No Items Added yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2  p-4 rounded-sm">
                                    <div
                                        className="w-fit rounded-sm grid grid-cols-2 md:grid-cols-4 space-x-2 bg-white border border-secondary">
                                        <span
                                            className="text-lg text-titles font-semibold self-center pl-5">Export to:</span>
                                        <Button type="button" className="shadow-none" disabled={saving}>CSV</Button>
                                        <Button type="button" className="shadow-none" disabled={saving}>Excel</Button>
                                        <Button type="button" className="shadow-none" disabled={saving}>PDF</Button>
                                    </div>
                                    <div className="flex gap-4 justify-center md:justify-end">
                                        <Button
                                            type="submit"
                                            className="flex items-center border-2 border-lime"
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Submit Report'}
                                            <Send size={20} className="ml-2"/>
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            )}
            {activeTab === 'History' && (
                <WasteReportsHistory wasteReports={wasteReports}/>
            )}
        </AdminPanelContainer>
    );
};

export default WasteReport;
