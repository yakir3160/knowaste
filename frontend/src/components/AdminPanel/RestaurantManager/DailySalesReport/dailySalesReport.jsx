import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Plus, Save, Send, CircleX } from 'lucide-react';
import AdminPanelContainer from "../../AdminPanelContainer";
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from '../../../Common/Card/Card';
import Button from '../../../Common/Button/Button';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { v4 as generateUniqueID } from 'uuid';
import SalesList from "./SalesList";
import { tableStyles } from '../../../../css/tableStyles';
import TabNavigation from "../../../Common/TabNavigation/TabNavigation";

const TAX_PERCENTAGE = 0.17;

const validationSchema = Yup.object().shape({
    items: Yup.array().of(
        Yup.object().shape({
            category: Yup.string().required("Category is required"),
            subCategory: Yup.string().optional(),
            menuItem: Yup.string().required("Dish is required"),
            quantity: Yup.number()
                .required("Quantity is required")
                .positive("Must be positive")
                .integer("Must be an integer"),
        })
    ).min(1, 'At least one item is required')
});

const initialValues = {
    items: [
        {
            id: 0,
            category: "",
            subCategory: "",
            menuItem: "",
            quantity: 1,
            totalPrice: 0
        }
    ]
};

const DailySalesReport = () => {
    const { userItems, categories } = useItemsContext();
    const { user } = useAuthContext();
    const {
        filteredItems,
        subCategories,
        setSelectedCategory,
        setSelectedSubCategory,
    } = useFilteredItems(userItems, categories);

    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [sales, setSales] = useState([]);
    const [activeTab, setActiveTab] = useState('Items');
    const [saving, setSaving] = useState(false);

    const handleSubmitReport = async (values, { resetForm }) => {
        try {
            setSaving(true);
            const totalSales = values.items.reduce((acc, item) => acc + item.totalPrice, 0);

            const report = {
                userId: user.uid,
                reportId: generateUniqueID(),
                date: reportDate,
                timeStamp: new Date().toISOString(),
                items: values.items,
                totalItems: values.items.length,
                totalSales: totalSales,
                totalSalesPreTax: parseFloat((totalSales * (1 - TAX_PERCENTAGE)).toFixed(2)),
            };

            setSales([...sales, report]);
            resetForm({ values: initialValues });
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
            console.log(sales);
        }
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            const menuItem = filteredItems.find(i => i.name === item.menuItem);
            return total + (menuItem?.price || 0) * item.quantity;
        }, 0);
    };

    return (
        <AdminPanelContainer pageTitle={"Daily Sales Report"} layout="p-2 flex flex-col">
            <TabNavigation tabs={['Items', 'Sales']} onTabChange={(tab) => setActiveTab(tab)} />

            {activeTab === 'Items' && (
                <Card className="bg-white border-none h-full">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitReport}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>
                                <div className="w-full p-5">
                                    <div className="flex justify-between items-center">
                                        <GlobalField
                                            type="date"
                                            name="reportDate"
                                            label="Report Date"
                                            value={reportDate}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setReportDate(e.target.value)}
                                        />
                                        <div className="text-xl font-bold text-center">
                                            <span className="text-titles">
                                                    Total Cost:
                                            ₪{values.items.reduce((acc, item) => acc + (item.cost || 0), 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="bg-secondary">
                                                <th className={tableStyles.thClass}>Category</th>
                                                <th className={tableStyles.thClass}>Sub Category</th>
                                                <th className={tableStyles.thClass}>Dish</th>
                                                <th className={tableStyles.thClass}>Quantity</th>
                                                <th className={tableStyles.thClass}>Total Price</th>
                                                <th className={tableStyles.thClass}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {values.items.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.category`}
                                                            type="select"
                                                            options={[
                                                                {value: '', label: 'Select Category'},
                                                                ...categories.map(cat => ({
                                                                    value: cat.name,
                                                                    label: cat.name
                                                                }))
                                                            ]}
                                                            onChange={(e) => {
                                                                setFieldValue(`items.${index}.category`, e.target.value);
                                                                setSelectedCategory(e.target.value);
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.subCategory`}
                                                            type="select"
                                                            options={[
                                                                {value: '', label: 'Select Sub Category'},
                                                                ...subCategories.map(sub => ({
                                                                    value: sub.name,
                                                                    label: sub.name
                                                                }))
                                                            ]}
                                                            onChange={(e) => {
                                                                setFieldValue(`items.${index}.subCategory`, e.target.value);
                                                                setSelectedSubCategory(e.target.value);
                                                            }}
                                                            disabled={!item.category}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.menuItem`}
                                                            type="select"
                                                            options={[
                                                                {value: '', label: 'Select Dish'},
                                                                ...filteredItems.map(dish => ({
                                                                    value: dish.name,
                                                                    label: dish.name
                                                                }))
                                                            ]}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.quantity`}
                                                            type="number"
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        {(filteredItems.find(i => i.name === item.menuItem)?.price || 0) * item.quantity} ₪
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newItems = values.items.filter((_, i) => i !== index);
                                                                setFieldValue('items', newItems);
                                                            }}
                                                            className="text-errorRed"
                                                            disabled={values.items.length === 1}
                                                        >
                                                            <CircleX size={20}/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 p-5 rounded-b-sm border-2 border-secondary border-t-2 border-t-transparent">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const newId = values.items[values.items.length - 1].id + 1;
                                                setFieldValue('items', [
                                                    ...values.items,
                                                    {...initialValues.items[0], id: newId}
                                                ]);
                                            }}
                                            className="flex items-center border-2 border-lime w-fit"
                                            disabled={saving}
                                        >
                                            Add Item
                                            <Plus size={20} className="ml-2"/>
                                        </Button>
                                        <div
                                            className="flex flex-row  w-fit  justify-center rounded-sm md:justify-start space-x-2 bg-white  border  border-secondary">
                                            <span className="text-lg  text-titles font-semibold self-center pl-5">Export to:</span>
                                            <Button type="button" className={`shadow-none`}
                                                    disabled={saving}>CSV</Button>
                                            <Button type="button" className={`shadow-none`}
                                                    disabled={saving}>Excel</Button>
                                            <Button type="button" className={`shadow-none`}
                                                    disabled={saving}>PDF</Button>
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
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            )}

            {activeTab === 'Sales' && <SalesList sales={sales}/>}
        </AdminPanelContainer>
    );
};

export default DailySalesReport;
