import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Plus, Send, CircleX } from 'lucide-react';
import AdminPanelContainer from "../AdminPanelContainer";
import GlobalField from "../../Common/inputs/GlobalField";
import Card from '../../Common/Card/Card';
import Button from '../../Common/Button/Button';
import { useAuthContext } from "../../../contexts/AuthContext";
import { v4 as generateUniqueID } from 'uuid';


import { tableStyles } from '../../../css/tableStyles';
import TabNavigation from "../../Common/TabNavigation/TabNavigation";
import {useItemsContext} from "../../../contexts/ItemsContext";


const validationSchema = Yup.object().shape({
    items: Yup.array().of(
        Yup.object().shape({
            ingredientName: Yup.string().required("Ingredient is required"),
            quantity: Yup.number()
                .required("Quantity is required")
                .positive("Must be positive"),
            reason: Yup.string().required("Reason is required"),
            cost: Yup.number().required("Cost is required").min(0, "Cost must be positive"),
        })
    ).min(1, 'At least one item is required')
});

const initialValues = {
    items: [
        {
            id: 0,
            ingredientName: "",
            quantity: 1,
            unit: "",
            reason: "",
            cost: 0
        }
    ]
};

const WasteReport = () => {
    const { ingredients } = useItemsContext();
    const { user } = useAuthContext();
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [leftovers, setLeftovers] = useState([]);
    const [activeTab, setActiveTab] = useState('Items');
    const [saving, setSaving] = useState(false);
    const {addReport} = useItemsContext();

    const reasons = [
        "Expired",
        "Damaged",
        "Quality Issues",
        "Overproduction",
        "Storage Error",
        "Other"
    ];

    const handleSubmitReport = async (values, { resetForm }) => {
        try {
            setSaving(true);
            // שליחת המערך הגולמי לבקאנד
            const reportData = {
                date: reportDate,
                items: values.items,
                userId: user.id
            };
            await addReport(reportData, 'waste');
            resetForm({ values: initialValues });
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminPanelContainer pageTitle={"Waste Report"} layout="p-2 flex flex-col">
            <TabNavigation tabs={['Items', 'History']} onTabChange={(tab) => setActiveTab(tab)} />

            {activeTab === 'Items' && (
                <Card className="bg-white border-none h-full ">
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
                                                <tr key={item.id}>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.ingredientName`}
                                                            type="select"
                                                            options={[
                                                                { value: '', label: 'Select Ingredient' },
                                                                ...ingredients.map(ing => ({
                                                                    value: ing.name,
                                                                    label: ing.name
                                                                }))
                                                            ]}
                                                            onChange={(e) => {
                                                                const selectedIngredient = ingredients.find(ing => ing.name === e.target.value);
                                                                setFieldValue(`items.${index}.ingredientName`, e.target.value);
                                                                setFieldValue(`items.${index}.unit`, selectedIngredient?.unit || '');
                                                            }}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.quantity`}
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        {'kg'}
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        <GlobalField
                                                            name={`items.${index}.reason`}
                                                            type="select"
                                                            options={[
                                                                { value: '', label: 'Select Reason' },
                                                                ...reasons.map(reason => ({
                                                                    value: reason,
                                                                    label: reason
                                                                }))
                                                            ]}
                                                        />
                                                    </td>
                                                    <td className={tableStyles.tableCellClass}>
                                                        {'₪'}
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
                                            className="flex items-center  w-fit"
                                            disabled={saving}
                                        >
                                            Add Item
                                            <Plus size={20} className="ml-2"/>
                                        </Button>
                                        <div
                                            className="flex flex-row w-fit justify-center rounded-sm md:justify-start space-x-2 bg-white border border-secondary">
                                            <span className="text-lg text-titles font-semibold self-center pl-5">Export to:</span>
                                            <Button type="button" className="shadow-none" disabled={saving}>CSV</Button>
                                            <Button type="button" className="shadow-none"
                                                    disabled={saving}>Excel</Button>
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

            {/*{activeTab === 'History' && <LeftoversList leftovers={leftovers}/>}*/}
        </AdminPanelContainer>
    );
};

export default WasteReport;
