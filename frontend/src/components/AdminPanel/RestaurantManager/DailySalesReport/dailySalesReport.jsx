import React, { useState } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from '../../../Common/Card/Card';
import Button from '../../../Common/Button/Button';
import { useItemsContext } from "../../../../contexts/ItemsContext";

const DailySalesReport = () => {
    const { userItems, categories } = useItemsContext();
    const [selectedCategories, setSelectedCategories] = useState({});
    const categoriesNames = categories?.map(category => category.name);

    const getDishesForCategory = (categoryName) => {
        return categoryName
            ? userItems
                .filter(item => item.name === categoryName)
                .flatMap(item => item.dishes)
                .map(dish => dish.name)
            : [];
    };

    const validationSchema = Yup.object({
        date: Yup.date().required("Required").max(new Date(), "Cannot select future date"),
        dishes: Yup.array().of(
            Yup.object({
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
            <Card className="bg-white border-none p-5 h-full">
                <h1 className="text-2xl text-center">Add Daily Sales</h1>
                <div className="grid grid-cols-1">
                    <Card className="flex justify-center">
                        <h1 >New report</h1>
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
                                    <FieldArray name="dishes">
                                        {({push, remove}) => (
                                            <div className="space-y-4 col-span-full">
                                                {values.dishes.map((dish, index) => (
                                                    <Card key={index} className="grid  grid-cols-1 md:grid-cols-3 space-x-4 p-4 ">
                                                        <GlobalField
                                                            type="select"
                                                            name={`dishes.${index}.category`}
                                                            label="Category"
                                                            options={categoriesNames}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setSelectedCategories(prev => ({
                                                                    ...prev,
                                                                    [index]: value
                                                                }));
                                                                setFieldValue(`dishes.${index}.category`, value);
                                                                setFieldValue(`dishes.${index}.menuItem`, "");
                                                            }}
                                                        />
                                                        <GlobalField
                                                            type="select"
                                                            name={`dishes.${index}.menuItem`}
                                                            label="Dish"
                                                            options={getDishesForCategory(selectedCategories[index])}
                                                            disabled={!selectedCategories[index]}
                                                        />
                                                        <GlobalField
                                                            type="number"
                                                            name={`dishes.${index}.quantity`}
                                                            label="Quantity"
                                                            min="1"

                                                        />
                                                        <div className="flex items-end">
                                                            {values.dishes.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="mb-1"
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))}
                                                <Button
                                                    type="button"
                                                    onClick={() => push({
                                                        category: "",
                                                        menuItem: "",
                                                        quantity: ""
                                                    })}
                                                >
                                                    Add Dish
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>

                                    <div className="flex  justify-end col-span-full">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-fit border-2 border-lime mt-4"
                                        >
                                            Submit Report
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                    <Card>
                        <h1>Daily sales</h1>
                    </Card>
                </div>
            </Card>
        </AdminPanelContainer>
    );
};

export default DailySalesReport;