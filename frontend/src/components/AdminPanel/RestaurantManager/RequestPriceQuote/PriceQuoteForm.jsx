import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Plus, Save, Send, CircleX } from 'lucide-react';
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { createQuote } from "../../../../clientFunctions/priceQuoteFunctions";
import { useAuthContext } from "../../../../contexts/AuthContext";
import { calculateTotal, getUnitOptions } from './PriceQuoteHelpers';

// Add validation schema
const QuoteSchema = Yup.object().shape({
    ingredients: Yup.array().of(
        Yup.object().shape({
            id: Yup.number().required(),
            itemId: Yup.string()
                .required('Please select an ingredient'),
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

const PriceQuoteForm = ({
                            inventoryItems,
                            onQuoteAdded,
                            userData,
                            isAuthenticated
                        }) => {
    const [saving, setSaving] = useState(false);
    const categories = [...new Set(inventoryItems.map(item => item.category))];

    const initialValues = {
        ingredients: [
            { id: 1, itemId: '', quantity: 0.5, unit: 'kg', notes: '' }
        ]
    };

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

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('Form submitted', values);
        try {
            await handleSaveOrSubmit(values, resetForm, 'Pending');
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveOrSubmit = async (values, resetForm, status = 'Draft') => {
        console.log(`Handling ${status} submission`, values);
        console.log('User data:', userData);

        if (!isAuthenticated || !userData?.uid) {
            console.error('Cannot save - not authenticated or missing user data');
            alert('You must be logged in as a restaurant manager to save quotes');
            return;
        }

        try {
            setSaving(true);

            const validIngredients = values.ingredients.filter(ing => ing.itemId && ing.quantity > 0);
            if (validIngredients.length === 0) {
                alert('Please add at least one ingredient');
                return;
            }

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
                businessId: userData.uid, // Use uid as businessId if no specific businessId
                businessName: userData.businessName,
                status: status,
                ingredients: enrichedIngredients,
                items: enrichedIngredients.length,
                total: calculateTotal(enrichedIngredients, inventoryItems),
                createdBy: userData.email,
                createdAt: new Date(),
            };


            console.log('Attempting to save quote:', quoteData);
            const docId = await createQuote(quoteData);
            console.log('Quote saved with ID:', docId);

            resetForm({ values: initialValues });
            onQuoteAdded();
            alert(`Quote ${status === 'Draft' ? 'saved as draft' : 'sent'} successfully`);
        } catch (err) {
            console.error('Failed to save quote:', err);
            alert('Failed to save quote. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className={`bg-gray p-5 h-full`}>
            <h1 className={`text-2xl text-center mb-6`}>
                Request Price Quote
                {userData?.businessName && (
                    <div className="text-sm text-gray-600 mt-1">
                        {userData.businessName}
                    </div>
                )}
            </h1>

            {!isAuthenticated && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">Authentication Required</p>
                    <p>Please log in as a restaurant manager to submit quotes.</p>
                </div>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={QuoteSchema}
                onSubmit={handleFormSubmit}
            >
                {({ values, setFieldValue, resetForm, errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="flex justify-end mb-6">
                            <Button
                                type="button"
                                onClick={() => {
                                    console.log('Adding new row');
                                    const newId = values.ingredients[values.ingredients.length - 1].id + 1;
                                    const newIngredients = [
                                        ...values.ingredients,
                                        { id: newId, itemId: '', quantity: 0.5, unit: 'kg', notes: '' }
                                    ];
                                    setFieldValue('ingredients', newIngredients);
                                }}
                                className="flex items-center border-2 border-lime"
                                disabled={saving || isSubmitting}
                            >
                                Add Item
                                <Plus size={20} className="ml-2" />
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                <tr className="bg-secondary">
                                    <th className="border p-2 text-left">Ingredient</th>
                                    <th className="border p-2 text-left">Quantity</th>
                                    <th className="border p-2 text-left">Unit</th>
                                    <th className="border p-2 text-left">Notes</th>
                                    <th className="border p-2 text-left">Last Price</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {values.ingredients.map((ing, index) => (
                                    <tr key={ing.id}>
                                        <td className="border p-2">
                                            <div className="flex flex-col">
                                                <select
                                                    value={ing.itemId}
                                                    onChange={(e) => handleIngredientSelect(e.target.value, index, setFieldValue, values)}
                                                    className={`w-full p-1 border rounded bg-base ${
                                                        touched.ingredients?.[index]?.itemId &&
                                                        errors.ingredients?.[index]?.itemId ? 'border-red-500' : ''
                                                    }`}
                                                    disabled={saving}
                                                    onBlur={() => {
                                                        // Mark field as touched
                                                        const newTouched = { ...touched };
                                                        if (!newTouched.ingredients) newTouched.ingredients = [];
                                                        if (!newTouched.ingredients[index]) newTouched.ingredients[index] = {};
                                                        newTouched.ingredients[index].itemId = true;
                                                    }}
                                                >
                                                    <option value="">Select Ingredient</option>
                                                    {categories.map(category => (
                                                        <optgroup key={category} label={category}>
                                                            {inventoryItems
                                                                .filter(item => item.category === category)
                                                                .map(item => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                {touched.ingredients?.[index]?.itemId &&
                                                    errors.ingredients?.[index]?.itemId && (
                                                        <span className="text-xs text-red-500 mt-1">
                                                            {errors.ingredients[index].itemId}
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="border p-2">
                                            <div className="flex flex-col">
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    min="0"
                                                    value={ing.quantity}
                                                    onChange={(e) => {
                                                        const value = Math.max(0, parseFloat(e.target.value));
                                                        setFieldValue(`ingredients.${index}.quantity`, value);
                                                    }}
                                                    className={`w-full p-1 border rounded ${
                                                        touched.ingredients?.[index]?.quantity &&
                                                        errors.ingredients?.[index]?.quantity ? 'border-red-500' : ''
                                                    }`}
                                                    disabled={saving}
                                                />
                                                {touched.ingredients?.[index]?.quantity &&
                                                    errors.ingredients?.[index]?.quantity && (
                                                        <span className="text-xs text-red-500 mt-1">
                                                            {errors.ingredients[index].quantity}
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="border p-2">
                                            <select
                                                value={ing.unit}
                                                onChange={(e) => setFieldValue(`ingredients.${index}.unit`, e.target.value)}
                                                className="w-full p-1 border rounded bg-base"
                                                disabled={saving}
                                            >
                                                {getUnitOptions(ing.itemId, inventoryItems).map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                value={ing.notes}
                                                onChange={(e) => setFieldValue(`ingredients.${index}.notes`, e.target.value)}
                                                className="w-full p-1 border rounded"
                                                placeholder="Additional notes"
                                                disabled={saving}
                                            />
                                        </td>
                                        <td className="border p-2 text-gray-600">
                                            {ing.itemId &&
                                                `₪${inventoryItems.find(item => item.id.toString() === ing.itemId)?.lastPrice}`
                                            }
                                        </td>
                                        <td className="border p-2">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (values.ingredients.length > 1) {
                                                        const newIngredients = values.ingredients.filter((_, i) => i !== index);
                                                        setFieldValue('ingredients', newIngredients);
                                                    }
                                                }}
                                                className="text-errorRed hover:text-errorLightRed"
                                                disabled={values.ingredients.length === 1 || saving}
                                            >
                                                <CircleX size={20} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between mt-6">
                            <div className="space-x-2">
                                <Button
                                    type="button"
                                    className="flex items-center border-2 border-lime"
                                    onClick={() => handleSaveOrSubmit(values, resetForm, 'Draft')}
                                    disabled={saving || isSubmitting}
                                >
                                    {(saving || isSubmitting) ? 'Saving...' : 'Save Draft'}
                                    <Save size={20} className="ml-2" />
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex items-center border-2 border-lime"
                                    disabled={saving || isSubmitting}
                                >
                                    {(saving || isSubmitting) ? 'Sending...' : 'Send Request'}
                                    <Send size={20} className="ml-2" />
                                </Button>
                            </div>
                            <div className="space-x-2">
                                <Button type="button" className="border-2" disabled={saving}>CSV</Button>
                                <Button type="button" className="border-2" disabled={saving}>Excel</Button>
                                <Button type="button" className="border-2" disabled={saving}>PDF</Button>
                            </div>
                        </div>

                        <div className="mt-4 text-right">
                            <span className="text-lg font-semibold">
                                Total: ₪{calculateTotal(values.ingredients, inventoryItems).toFixed(2)}
                            </span>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default PriceQuoteForm;