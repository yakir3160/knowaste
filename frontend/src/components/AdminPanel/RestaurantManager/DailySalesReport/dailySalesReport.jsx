import React, { useState } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from '../../../Common/Card/Card';
import Button from '../../../Common/Button/Button';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { v4 as generateUniqueID } from 'uuid';
import SalesList from "./SalesList";
import TabNavigation from "../../../Common/TabNavigation/TabNavigation";
import { tableStyles } from '../../../../css/tableStyles';


const DailySalesReport = () => {
    const { userItems, categories, loadingItems } = useItemsContext();
    const { user } = useAuthContext();
    const {
        filteredItems,
        subCategories,
        selectedCategory,
        selectedSubCategory,
        setSelectedCategory,
        setSelectedSubCategory,
    } = useFilteredItems(userItems, categories);

    const [reportItems, setReportItems] = useState([]);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [sales, setSales] = useState([]);
    const [activeTab, setActiveTab] = useState('Items');
    const [saving, setSaving] = useState(false);
    const {addReport} = useItemsContext();

    const validationSchema = Yup.object({
        category: Yup.string().required("Category is required"),
        subCategory: Yup.string().optional(),
        menuItem: Yup.string().required("Dish is required"),
        quantity: Yup.number().required("Quantity is required").positive("Must be positive")
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

            setReportItems([...reportItems, newItem]);
            resetForm();
        }
    };

    const handleSubmitReport = async (values, { resetForm }) => {
        try {
            setSaving(true);
            // שולחים רק את המידע הבסיסי הנדרש
            const reportData = {
                id: generateUniqueID(),
                date: reportDate,
                items: values.items.map(item => ({
                    category: item.category,
                    subCategory: item.subCategory,
                    menuItem: item.menuItem,
                    quantity: item.quantity
                }))
            };

            // הבקאנד מחזיר את הדוח המעובד
            const processedReport = await addReport(reportData, 'sales');

            // עדכון ה-UI עם התוצאה מהבקאנד
            setSales(prev => [...prev, processedReport]);
            resetForm({ values: initialValues });

        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminPanelContainer pageTitle="Daily Sales Report" layout="p-2 flex flex-col ">
            <TabNavigation
                tabs={['Items', 'Sales']}
                onTabChange={(tab) => setActiveTab(tab)}
            />
                {activeTab === 'Items' && (
                    <Card className="bg-white border-none p-5 h-full flex">
                        <h1 className="text-2xl text-center mb-5">Add Daily Sales</h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleAddDish}
                        >
                            {({values, setFieldValue}) => (
                                <Form className="gap-5 w-full" noValidate>
                                    <div className="flex justify-between items-center">
                                        <GlobalField
                                            type="date"
                                            name="reportDate"
                                            label="Report Date"
                                            value={reportDate}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setReportDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-2 border-secondary p-4 rounded-sm">
                                        <GlobalField
                                            type="select"
                                            name="category"
                                            label="Category"
                                            options={[{
                                                value: '',
                                                label: 'Select a category'
                                            }, ...categories.map(category => ({
                                                value: category.name,
                                                label: category.name
                                            }))]}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue("category", value);
                                                setSelectedCategory(value);
                                            }}
                                        />
                                        {subCategories.length > 0 && (
                                            <GlobalField
                                                type="select"
                                                name="subCategory"
                                                label="Sub Category"
                                                options={[{
                                                    value: '',
                                                    label: 'Select a sub category'
                                                }, ...subCategories.map(subCategory => ({
                                                    value: subCategory.name,
                                                    label: subCategory.name
                                                }))]}
                                                onChange={(e) => {
                                                    const {value} = e.target;
                                                    setFieldValue("subCategory", value);
                                                    setSelectedSubCategory(value);
                                                }}
                                            />
                                        )}
                                        <GlobalField
                                            type="select"
                                            name="menuItem"
                                            label="Dish"
                                            options={[{value: '', label: 'Select a dish'}, ...filteredItems.map(dish => ({
                                                value: dish.name,
                                                label: dish.name
                                            }))]}
                                        />
                                        <div className="grid grid-cols-2">
                                            <GlobalField
                                                type="number"
                                                name="quantity"
                                                label="Quantity"
                                                min="1"
                                            />
                                            <GlobalField
                                                type="number"
                                                name="totalItemSales"
                                                label="Total Item Sales (₪)"
                                                value={values.quantity * filteredItems.find(item => item.name === values.menuItem)?.price}
                                                setFieldValue={values.totalPrice}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-fit self-center"
                                        >
                                            Add Dish
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="m-8 w-full overflow-x-auto">
                            <h2 className="text-xl mb-4">Dishes in Report</h2>
                            {reportItems.length > 0 ? (
                                <table className="min-w-full border-collapse">
                                    <thead className={`bg-secondary`}>
                                    <tr>
                                        <th className={tableStyles.thClass}>Category</th>
                                        <th className={tableStyles.thClass}>SubCategory</th>
                                        <th className={tableStyles.thClass}>Dish</th>
                                        <th className={tableStyles.thClass}>Quantity</th>
                                        <th className={tableStyles.thClass}>Total Item Sales (₪)</th>
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
                            >
                                Submit Report
                            </Button>
                        </div>
                    </Card>
                )}

            {activeTab === 'Sales' && (
                    <SalesList sales={sales}/>
            )}
        </AdminPanelContainer>
    );
};

export default DailySalesReport;