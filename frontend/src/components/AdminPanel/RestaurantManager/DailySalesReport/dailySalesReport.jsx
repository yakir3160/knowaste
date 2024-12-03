import React, { useState } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from '../../../Common/Card/Card';
import Button from '../../../Common/Button/Button';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import {useAuthContext} from "../../../../contexts/AuthContext";
import { v4 as generateUniqueID } from 'uuid';
import SalesList from "./SalesList";

const TAX_PERCENTAGE = 0.17;

const DailySalesReport = () => {
    const { userItems, categories, loadingItems } = useItemsContext();
    const {user} =  useAuthContext()
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
    const [sales,setSales] = useState([])

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
                id: selectedDish.id,  // הוספת id של המנה
                totalPrice: values.quantity * selectedDish.price
            };

            setReportItems([...reportItems, newItem]);
            resetForm();
            }
        };


        const handleSubmitReport = async () => {
            const totalSales = reportItems.reduce((acc, item) => acc + item.totalPrice, 0);
            const report = {
                userId:user.uid,
                reportId: generateUniqueID(),
                date:reportDate,
                timeStamp: new Date().toISOString(),
                items: reportItems,
                totalItems: reportItems.length,
                totalSales: totalSales,
                totalSalesPreTax: parseFloat((totalSales * (1 - TAX_PERCENTAGE)).toFixed(2)),
            }
            setReportItems([])
            setSales([...sales,report])
            console.log("Sales Report:", report);
        };

        return (
            <AdminPanelContainer pageTitle="Daily Sales Report" layout="p-10">
                <Card className="bg-white border-none p-5 h-full flex">
                    <h1 className="text-2xl text-center mb-5">Add Daily Sales</h1>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleAddDish}
                    >
                        {({ values, setFieldValue }) => (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2  border border-secondary  p-4 rounded-sm">
                                    <GlobalField
                                        type="select"
                                        name="category"
                                        label="Category"
                                        options={[{ value: '', label: 'Select a category' }, ...categories.map(category => ({
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
                                            options={[{ value: '', label: 'Select a sub category' }, ...subCategories.map(subCategory => ({
                                                value: subCategory.name,
                                                label: subCategory.name
                                            }))]}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setFieldValue("subCategory", value);
                                                setSelectedSubCategory(value);
                                            }}
                                        />
                                    )}
                                    <GlobalField
                                        type="select"
                                        name="menuItem"
                                        label="Dish"
                                        options={[{ value: '', label: 'Select a dish' }, ...filteredItems.map(dish => ({
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
                                            value={values.quantity * filteredItems.find(item => item.name === values.menuItem)?.price }
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

                    <div className="mt-8 ">
                        <h2 className="text-xl mb-4">Dishes in Report</h2>
                        {reportItems.length > 0 ? (
                            <ul>
                                {reportItems.map((item, index) => (
                                    <li key={index} className="border-2 border-secondary px-5 py-3 mb-2 text-titles rounded-md">
                                        <strong>Category:</strong> {item.category} ,
                                        {item.subCategory && (
                                            <>
                                                <strong>SubCategory:</strong> {item.subCategory} ,
                                            </>
                                        )}
                                        <strong>Dish:</strong> {item.menuItem} ,
                                        <strong>Quantity:</strong> {item.quantity} ,
                                        <strong>Total Item Sales:</strong> {item.totalPrice} ₪,
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No dishes added yet.</p>
                        )}
                    </div>

                    <div className="self-end w-full md:w-fit p-2">
                        <Button
                            onClick={handleSubmitReport}
                            className="w-full md:w-1/4 border border-lime"
                        >
                            Submit Report
                        </Button>
                    </div>
                </Card>
                <SalesList sales={sales} />

            </AdminPanelContainer>
        );
};

export default DailySalesReport;
