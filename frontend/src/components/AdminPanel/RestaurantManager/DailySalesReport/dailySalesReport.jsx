import React, { useState } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from '../../../Common/Card/Card';
import Button from '../../../Common/Button/Button';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import SalesList from "./SalesList";
import Loading from "../../../Common/Loading/Loading";

const DailySalesReport = () => {
    const { userItems, categories ,loadingItems} = useItemsContext();
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [reportItems, setReportItems] = useState([]);
    const categoriesNames = categories?.map(category => category.name);

    const filterDishes = (category) => {
        console.log('filtering dishes by category:', category);
        setFilteredDishes(userItems
            .flatMap(item => item.category === category ? item.dishes : [])
        )
        console.log('filtered dishes:', filteredDishes);
    }

    const validationSchema = Yup.object({
        date: Yup.date().required("Required").max(new Date(), "Cannot select future date"),
        dishes: Yup.array().of(
            Yup.object( {
                category: Yup.string().required("Category is required"),
                menuItem: Yup.string().required("Dish is required"),
                quantity: Yup.number().required("Quantity is required").positive("Must be positive")
            })
        ).min(1, "At least one dish is required")
    });
    const initialValues = {
        date: new Date().toISOString().split('T')[0],
        dishes: [
            {
                category: "",
                menuItem: "",
                quantity: ""
            }
        ]
    };


    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const salesReport = {
            date: new Date(values.date),
            dishes: values.dishes.map(dish => ({
                dish: userItems
                    .flatMap(item => item.dishes)
                    .find(d => d.name === dish.menuItem),
                quantity: dish.quantity
            }))
        };

        console.log('Sales Report:', salesReport);

        setSubmitting(false);
        resetForm();
    };

    return (

        <AdminPanelContainer pageTitle="Daily Sales Report" layout="p-10">
            {loadingItems ?
                (
                    <Loading/>

                ):
                (
                    <Card className="bg-white border-none p-5 h-full">
                        <h1 className="text-2xl text-center">Add Daily Sales</h1>
                        <div className="grid grid-cols-1">
                            <Card className="flex justify-center">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, isSubmitting, setFieldValue }) => (
                                        <Form className="space-y-4 grid grid-cols-4 w-full" noValidate>
                                            <div className={``}>
                                                <GlobalField
                                                    type="date"
                                                    name="date"
                                                    label="Date"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="space-y-4 col-span-full">
                                                {values.dishes.map((dish, index) => (
                                                    <Card key={index} className="grid  grid-cols-1 md:grid-cols-4 md:space-x-4 ">
                                                        <GlobalField
                                                            type="select"
                                                            name={`category`}
                                                            label="Category"
                                                            options={[{value :'', label:'Select a category'},...categoriesNames.map(category => ({ value: category, label: category }))]}
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.value)
                                                                filterDishes(e.target.value)
                                                            }}
                                                        />
                                                        <GlobalField
                                                            type="select"
                                                            name={`dishes.${index}.menuItem`}
                                                            label="Dish"
                                                            disabled={filteredDishes.length === 0}
                                                            options={[{ value: '', label: 'Select a dish' }, ...filteredDishes?.map(dish => ({ value: dish.name, label: dish.name }))]}

                                                        />
                                                        <GlobalField
                                                            type="number"
                                                            name={`dishes.${index}.quantity`}
                                                            label="Quantity"
                                                            min="1"

                                                        />
                                                        <div className={`flex justify-center`}>
                                                            <Button
                                                                type="submit"
                                                                className={`w-full`}
                                                            >
                                                                Add Dish
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                ))}

                                            </div>

                                            <div className="flex  justify-center col-span-full md:justify-end ">
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full border-2 border-lime mt-4 md:w-1/4  "
                                                >
                                                    Submit Report
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                                <div>
                                    <h2>Report Items </h2>
                                    <ul>
                                        {reportItems.map((item,index) => (
                                            <li key={index}>
                                                <p>Category: {item.category}</p>
                                                <p>Dish: {item.menuItem}</p>
                                                <p>Quantity: {item.quantity}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        </div>
                    </Card>

                )
            }
            <SalesList/>
        </AdminPanelContainer>
    );
};

export default DailySalesReport;