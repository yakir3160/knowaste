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
import SalesList from "./SalesList";
import TabNavigation from "../../Common/TabNavigation/TabNavigation";
import { tableStyles } from '../../../css/tableStyles';

const DailySalesReport = () => {
    const { userItems, menuCategories, salesReports, addReport } = useItemsContext();
    const [reportItems, setReportItems] = useState([]);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalReportPrice, setTotalReportPrice] = useState(0);
    const [activeTab, setActiveTab] = useState('Items');
    const [saving, setSaving] = useState(false);

    const {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
    } = useFilteredItems(userItems, menuCategories);

    const validationSchema = Yup.object({
        category: Yup.string().required("Category is required"),
        subCategory: Yup.string().optional(),
        menuItem: Yup.string().required("Dish is required"),
        quantity: Yup.number()
            .required("Quantity is required")
            .positive("Must be positive")
            .integer("Must be an integer"),
    });

    const initialValues = {
        category: "",
        subCategory: "",
        menuItem: "",
        quantity: "",
        totalPrice: 0,
    };

    const handleAddDish = (values, { resetForm }) => {
        const selectedDish = filteredItems.find(item => item.name === values.menuItem);
        if (selectedDish) {
            const newItem = {
                ...values,
                id: selectedDish.id,
                totalPrice: values.quantity * selectedDish.price
            };
            setReportItems(prev => [...prev, newItem]);
            setTotalReportPrice(prev => prev + newItem.totalPrice);
            resetForm();
        }
    };

    const handleSubmitReport = async () => {
        try {
            setSaving(true);
            const reportData = {
                id: generateUniqueID(),
                date: reportDate,
                totalSales: totalReportPrice,
                items: reportItems.map(item => ({
                    id: item.id,
                    category: item.category,
                    subCategory: item.subCategory,
                    menuItem: item.menuItem,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice
                })),
                summary: {
                    totalItems: reportItems.length,
                    totalSales: totalReportPrice,
                    totalSalesPreTax: totalReportPrice,
                    tax: 17
                }
            };

            await addReport(reportData, 'sales');
            setReportItems([]);
            setTotalReportPrice(0);
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
        }
    };

    const renderSalesForm = (values, setFieldValue, resetForm) => (
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
                <h3 className="font-semibold text-xl">Total Sales: {totalReportPrice} ₪</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-2 border-secondary p-4 rounded-sm">
                <GlobalField
                    type="select"
                    name="category"
                    label="Category"
                    options={[
                        { value: '', label: 'Select a category' },
                        ...menuCategories.map(category => ({
                            value: category.name,
                            label: category.name
                        }))
                    ]}
                    onChange={(e) => {
                        setFieldValue("category", e.target.value);
                        setSelectedCategory(e.target.value);
                    }}
                />
                <GlobalField
                    type="select"
                    name="menuItem"
                    label="Dish"
                    options={[
                        { value: '', label: 'Select a dish' },
                        ...filteredItems.map(dish => ({
                            value: dish.name,
                            label: dish.name
                        }))
                    ]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 space-y-4">
                    <GlobalField
                        type="number"
                        name="quantity"
                        label="Quantity"
                        min="1"
                    />
                    <div className="flex flex-col justify-center items-center font-semibold">
                        <span className="text-titles text-md text-center">
                            Total Item Sales (₪)
                        </span>
                        <span className="text-md text-center">
                            {values.quantity * (filteredItems.find(item => item.name === values.menuItem)?.price || 0)} ₪
                        </span>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full h-fit self-center"
                    disabled={saving}
                >
                    Add Dish
                </Button>
            </div>
        </Form>
    );

    return (
        <AdminPanelContainer pageTitle="Daily Sales Report" layout="p-2 flex flex-col">
            <TabNavigation
                tabs={['Items', 'Sales']}
                onTabChange={setActiveTab}
            />
            {activeTab === 'Items' ? (
                <Card className="bg-white border-none p-5 h-full flex">
                    <h1 className="text-2xl text-center mb-5">Add Daily Sales</h1>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleAddDish}
                    >
                        {({ values, setFieldValue, resetForm }) => renderSalesForm(values, setFieldValue, resetForm)}
                    </Formik>
                    {/* Report Items Table */}
                    <div className="m-8 w-full overflow-x-auto flex flex-col items-center">
                        <h2 className="text-xl mb-4">Dishes in Report</h2>
                        {reportItems.length > 0 ? (
                            <table className="min-w-full border-collapse">
                                <thead className="bg-secondary">
                                <tr>
                                    {['Category', 'SubCategory', 'Dish', 'Quantity', 'Total Item Sales (₪)'].map(header => (
                                        <th key={header} className={tableStyles.thClass}>{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {reportItems.map((item, index) => (
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
                            <p>No dishes added yet.</p>
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
                <SalesList salesReports={salesReports} />
            )}
        </AdminPanelContainer>
    );
};

export default DailySalesReport;
