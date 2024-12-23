import React, { useState } from 'react';
import {Formik, Form, FieldArray, Field} from 'formik';
import * as Yup from 'yup';
import { Plus, Save, Send, CircleX } from 'lucide-react';
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { createQuote } from "../../../../clientFunctions/priceQuoteFunctions";
import { calculateTotal, getUnitOptions} from './PriceQuoteHelpers';
import { tableStyles } from '../../../../css/tableStyles';
import GlobalField from "../../../Common/inputs/GlobalField";

// Add validation schema
const QuoteSchema = Yup.object().shape({
    ingredients: Yup.array().of(
        Yup.object().shape({
            id: Yup.number().required(),
            itemId: Yup.string()
                .required('Please select an ingredient'),
            category: Yup.string().required('Please select a category'),
            quantity: Yup.number()
                .required('Quantity is required')
                .min(0.5, 'Minimum quantity is 0.5')
                .test(
                    'is-half-step',
                    'Quantity must be in steps of 0.5',
                    value => value % 0.5 === 0
                ),
            unit: Yup.string()
                .required('Unit is required'),
            notes: Yup.string()
        })
    ).min(1, 'At least one ingredient is required')
});
const initialValues = {
    ingredients: [
        { id: 0, itemId: '', category: '', quantity: 0.5, unit: 'kg', notes: '' },
    ]
};


const PriceQuoteForm = ({inventoryItems, userData,onQuoteAdded}) => {
    const [saving, setSaving] = useState(false);
    const categories = [...new Set(inventoryItems.map(item => item.category))];


    const handleIngredientSelect = (itemId, index, setFieldValue, values) => {
        console.log('Selecting ingredient:', itemId, 'for index:', index);

        const selectedItem = inventoryItems.find(item => item.id.toString() === itemId);
        if (selectedItem) {
            const updatedIngredients = values.ingredients.map((ing, i) => {
                if (i === index) {
                    return {
                        ...ing,
                        itemId: selectedItem.id.toString(),
                        unit: selectedItem.defaultUnit,
                    };
                }
                return ing;
            });
            setFieldValue('ingredients', updatedIngredients);
        }
    };

    const handleFormSubmit = async (values, { setSubmitting, resetForm },onQuoteAdded) => {
        console.log('Form submitted', values);
        try {
            setSubmitting(true);
            await handleSaveOrSubmit(values, resetForm, 'Pending');
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            onQuoteAdded?.();
            setSubmitting(false);
            resetForm({ values: initialValues });
            console.log("initial  ",initialValues)

        }
    };

    const handleSaveOrSubmit = async (values, resetForm, status = 'Draft') => {
        console.log(`Handling ${status} submission`, values);
        console.log('User data:', userData);
        try {
            setSaving(true);
            const validIngredients = values.ingredients.filter(ing => ing.itemId && ing.quantity > 0);
            const enrichedIngredients = validIngredients.map(ing => {
                const item = inventoryItems.find(item => item.id.toString() === ing.itemId);
                return {
                    ...ing,
                    itemName: item?.name || '',
                    lastPrice: item?.lastPrice || 0,
                };
            });


            const quoteData = {
                userId: userData.uid,
                businessId: userData.uid,
                businessName: userData.businessName,
                status: status,
                ingredients: enrichedIngredients,
                items: enrichedIngredients.length,
                total: calculateTotal(enrichedIngredients, inventoryItems),
                createdBy: userData.email,
                createdAt:new Date(),
            };


            console.log('Attempting to save quote:', quoteData);
            const docId = await createQuote(quoteData);
            console.log('Quote saved with ID:', docId);
            onQuoteAdded?.();
        } catch (err) {
            console.error('Failed to save quote:', err);
            alert('Failed to save quote. Please try again.');
        } finally {
            setSaving(false);
            resetForm({ values: initialValues });
        }
    };

    return (
        <Card className={` h-full`}>
            <Formik
                initialValues={initialValues}
                validationSchema={QuoteSchema}
                onSubmit={handleFormSubmit}
            >
                {({ values, setFieldValue, resetForm, errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="w-full p-5">
                            <div className="flex justify-between items-center">
                                <GlobalField
                                    type="date"
                                    name="quoteDate"
                                    label="Quote Date"
                                    value={new Date().toISOString().split('T')[0]}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setFieldValue('quoteDate', e.target.value)}
                                />
                                <div className="text-xl font-bold text-titles">
                                    Total Quote: ₪{calculateTotal(values.ingredients, inventoryItems).toFixed(2)}
                                </div>
                            </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={tableStyles.thClass}>
                                        <tr className="bg-secondary">
                                            <th className="p-2 text-left">Category</th>
                                            <th className="p-2 text-left">Ingredient</th>
                                            <th className="p-2 text-left">Quantity</th>
                                            <th className=" p-2 text-left">Unit</th>
                                            <th className="p-2 text-left">Notes</th>
                                            <th className="p-2 text-left">Price per Unit</th>
                                            <th className="p-2 text-left">Total Price</th>
                                            <th className="p-2 text-left">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {values.ingredients.map((ing, index) => (
                                            <tr key={ing.id}>
                                                <td className={tableStyles.tableCellClass}>
                                                    <GlobalField
                                                        name={`ingredients.${index}.category`}
                                                        type="select"
                                                        options={[
                                                            {value: '', label: 'Select Category'},
                                                            ...categories.map(category => ({
                                                                value: category,
                                                                label: category
                                                            }))
                                                        ]}
                                                        onChange={(e) => {
                                                            setFieldValue(`ingredients.${index}.category`, e.target.value);
                                                            setFieldValue(`ingredients.${index}.itemId`, '');
                                                        }}
                                                        disabled={saving}
                                                    />
                                                </td>
                                                <td className={tableStyles.tableCellClass}>
                                                    <GlobalField
                                                        name={`ingredients.${index}.itemId`}
                                                        type="select"
                                                        options={[
                                                            {value: '', label: 'Select Product'},
                                                            ...inventoryItems
                                                                .filter(item => item.category === values.ingredients[index].category)
                                                                .map(item => ({
                                                                    value: item.id.toString(),
                                                                    label: item.name
                                                                }))
                                                        ]}
                                                        onChange={(e) => handleIngredientSelect(e.target.value, index, setFieldValue, values)}
                                                        disabled={saving || !values.ingredients[index].category}
                                                    />

                                                </td>

                                                <td className={tableStyles.tableCellClass}>
                                                    <GlobalField
                                                        name={`ingredients.${index}.quantity`}
                                                        type="number"
                                                        step="0.5"
                                                        min="0"
                                                        max="1000"
                                                        disabled={saving}
                                                    />
                                                </td>
                                                <td className={tableStyles.tableCellClass}>
                                                    <GlobalField
                                                        name={`ingredients.${index}.unit`}
                                                        type="select"
                                                        options={getUnitOptions(ing.itemId, inventoryItems)}
                                                        disabled={saving}
                                                    />
                                                </td>
                                                <td className={tableStyles.tableCellClass}>
                                                    <GlobalField
                                                        name={`ingredients.${index}.notes`}
                                                        type="text"
                                                        placeholder="Additional notes"
                                                        disabled={saving}
                                                    />
                                                </td>

                                                <td className={`${tableStyles.tableCellClass} min-w-[80px]`}>
                                                 <span className="inline-block w-full">
                                                        {ing.itemId ? `₪${(inventoryItems.find(item => item.id.toString() === ing.itemId)?.lastPrice || 0).toFixed(2)}` : '₪0.00'}
                                                 </span>
                                                </td>
                                                <td className={`${tableStyles.tableCellClass} min-w-[80px]`}>
                                                    <span className="inline-block w-full">
                                                         {ing.itemId ? `₪${((inventoryItems.find(item => item.id.toString() === ing.itemId)?.lastPrice || 0) * ing.quantity).toFixed(2)}` : '₪0.00'}
                                                     </span>
                                                </td>

                                                <td className={tableStyles.tableCellClass}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (values.ingredients.length > 1) {
                                                                const newIngredients = values.ingredients.filter((_, i) => i !== index);
                                                                setFieldValue('ingredients', newIngredients);
                                                            }
                                                        }}
                                                        className="text-errorRed"
                                                        disabled={values.ingredients.length === 1 || saving}
                                                    >
                                                        <CircleX size={20}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div
                                    className={`grid grid-cols-1  md:grid-cols-2 lg:grid-cols-7 py-5 px-3 gap-5 rounded-b-sm border-2 border-secondary border-t-2 border-t-transparent`}>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            console.log('Adding new row');
                                            const newId = values.ingredients[values.ingredients.length - 1].id + 1;
                                            const newIngredients = [
                                                ...values.ingredients,
                                                {id: newId, itemId: '', quantity: 0.5, unit: 'kg', notes: ''}
                                            ];
                                            setFieldValue('ingredients', newIngredients);
                                        }}
                                        className="flex items-center  w-fit h-fit col-end-1"
                                        disabled={saving || isSubmitting}
                                    >
                                        Add Item
                                        <Plus size={20} className="ml-2"/>
                                    </Button>
                                    {/* כפתורים לייצוא */}
                                    <div
                                        className="flex flex-row  w-fit  h-fit justify-center col-span-3 rounded-sm md:justify-start space-x-2 bg-white  border  border-secondary">
                                    <span
                                        className="text-lg  text-titles font-semibold self-center pl-5">Export to:</span>
                                        <Button type="button" className={`shadow-none`} disabled={saving}>CSV</Button>
                                        <Button type="button" className={`shadow-none`} disabled={saving}>Excel</Button>
                                        <Button type="button" className={`shadow-none`} disabled={saving}>PDF</Button>
                                    </div>
                                    {/* אזור הכפתורים */}
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 w-full h-fit gap-5 col-span-4  bg-secondary rounded-sm">
                                        <Button
                                            type="submit"
                                            className="flex items-center justify-center border-2 border-lime text-nowrap"
                                            onClick={() => handleSaveOrSubmit(values, resetForm, 'Draft')}
                                            disabled={saving || isSubmitting}
                                        >
                                            {(saving || isSubmitting) ? 'Saving...' : 'Save Draft'}
                                            <Save size={20} className="ml-2"/>
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex items-center justify-center border-2 border-lime text-nowrap "
                                            disabled={saving || isSubmitting}
                                        >
                                            {(saving || isSubmitting) ? 'Sending...' : 'Send Request'}
                                            <Send size={20} className="ml-2"/>
                                        </Button>
                                    </div>


                                </div>
                        </div>
                    </Form>
                    )}
            </Formik>
        </Card>
    );
};

export default PriceQuoteForm;