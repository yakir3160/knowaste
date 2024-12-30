import {Form, Formik} from "formik";
import GlobalField from "../../Common/inputs/GlobalField";
import React from "react";
import Button from "../../Common/Button/Button";
import {CircleX} from "lucide-react";
import Card from "../../Common/Card/Card";
import {useItemsContext} from "../../../contexts/ItemsContext";

const InventoryOrderForm = ({ingredient,onCancel}) => {
 const {addIngredientOrder} = useItemsContext();
    const initialValues = {
        receivedQuantity: ingredient.quantity,
        expirationDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
    }
    const handleSubmit = async (values, { resetForm }) => {

        console.log(ingredient.ingredientId,values);
            const res = await addIngredientOrder(ingredient.ingredientId, values);
            console.log(res);
            if (res.success) {
                resetForm();
                onCancel();
            }
    }
    return (
        <Card>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ values,}) => (
                    <Form className={`border-2 border-lime rounded-sm p-3 w-full`}>
                        <button onClick={onCancel} className="">
                            <CircleX size={24}/>
                        </button>
                        <>
                            <h3 className="text-center text-lg text-titles font-medium   ">Add Order
                                of {ingredient.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 ">

                                <GlobalField label="Received Quantity" type="number" name="receivedQuantity"/>
                                <GlobalField
                                    label="Expiration Date"
                                    type="date"
                                    name="expirationDate"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <GlobalField
                                    label="Received Date"
                                    type="date"
                                    name="receivedDate"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </>
                        <div className="flex justify-end items-end">
                            <Button
                                type="submit"
                                className="w-full md:w-fit m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                            >
                                Submit

                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}
export default InventoryOrderForm;
