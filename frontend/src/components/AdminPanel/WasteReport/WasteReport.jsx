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
import {measurementUnits} from "../../../constants/Constants";
import { wasteReportSchema } from '../../../schemas/firestoreSchemas/wasteReportSchema';
import WasteReportsHistory from "./WasteReportsHistory";

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
            ingredientId: '',
            ingredientName: '',
            quantity: 0,
            unit: '',
            reason: '',
            cost: 0
        }
    ]
};

const WasteReport = () => {
    const { inventoryItems ,wasteReports} = useItemsContext();
    const [activeTab, setActiveTab] = useState('Items');
    const [saving, setSaving] = useState(false);
    const { addReport } = useItemsContext();



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
                    <Formik
                        initialValues={initialValues}
                        validationSchema={wasteReportSchema}
                        onSubmit={handleSubmitReport}
                    >
                        {({ values, setFieldValue }) => (
                            <Form>
                                <div className="w-full p-5">
                                    <div className="flex justify-between items-center">
                                        <GlobalField
                                            type="date"
                                            name="date"
                                            label="Report Date"
                                            value={values.date}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setFieldValue('date', e.target.value)}
                                        />
                                        <div className="text-xl font-bold text-center">
                                            <span className="text-titles">
                                                Total Cost: ₪ {values.items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="bg-secondary">
                                                <th className={tableStyles.thClass}>Ingredient</th>
                                                <th className={tableStyles.thClass}>Quantity</th>
                                                <th className={tableStyles.thClass}>Unit</th>
                                                <th className={tableStyles.thClass}>Reason</th>
                                                <th className={tableStyles.thClass}>Cost</th>
                                                <th className={tableStyles.thClass}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {values.items.map((item, index) => (
                                                <tr key={item.ingredientId || index}>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.ingredientName`}
                                                            type="select"
                                                            options={[
                                                                {value: '', label: 'Select Ingredient'},
                                                                ...inventoryItems?.map(ing => ({
                                                                    value: ing.name,
                                                                    label: ing.name
                                                                }))
                                                            ]}
                                                            onChange={(e) => {
                                                                const selectedIngredient = inventoryItems.find(ing => ing.name === e.target.value);
                                                                setFieldValue(`items.${index}.ingredientName`, e.target.value);
                                                                setFieldValue(`items.${index}.ingredientId`, selectedIngredient?.ingredientId || '');
                                                                setFieldValue(`items.${index}.unit`, selectedIngredient?.unit || '');
                                                            }}
                                                        />
                                                    </td>

                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.quantity`}
                                                            type="number"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            type="select"
                                                            name={`items.${index}.unit`}
                                                            options={[
                                                                {value: '', label: 'Select unit'},
                                                                ...measurementUnits.map(unit => ({
                                                                    value: unit,
                                                                    label: unit
                                                                }))
                                                            ]}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.reason`}
                                                            type="select"
                                                            options={[
                                                                {value: '', label: 'Select Reason'},
                                                                ...WASTE_REASONS
                                                            ]}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.cost`}
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                        />
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

                                    <div
                                        className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 p-5 rounded-b-sm border-2 border-secondary border-t-2 border-t-transparent">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const newItem = {
                                                    ingredientId: '',
                                                    ingredientName: '',
                                                    quantity: 0,
                                                    unit: '',
                                                    reason: '',
                                                    cost: 0
                                                };
                                                const newItems = [...values.items, newItem];
                                                setFieldValue('items', newItems);
                                            }}
                                            className="flex items-center w-fit"
                                            disabled={saving}
                                        >
                                            Add Item
                                            <Plus size={20} className="ml-2" />
                                        </Button>

                                        <div className="w-fit rounded-sm grid grid-cols-2 md:grid-cols-4 space-x-2 bg-white border border-secondary">
                                            <span className="text-lg text-titles font-semibold self-center pl-5">Export to:</span>
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
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            )}
            {activeTab === 'History' && (
                <WasteReportsHistory
                    wasteReports={wasteReports}
                />
            )}
        </AdminPanelContainer>
    );
};

export default WasteReport;