
import { Formik, Form } from "formik";
import Card from '../Common/Card/Card.jsx';
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import { useUserContext } from "../../contexts/UserContext";

const AdminPanelContainer = ({pageTitle,children,layout}) => {

    return (
        <>
            <Card className="mb-5">
                <h1 className="text-titles text-4xl text-center">{pageTitle}</h1>
            </Card>
            <div className=" w-full rounded-lg">
                <section className={`${layout} border-2 border-secondary  rounded-md  bg-white`}>
                    {children}
                </section>
            </div>
        </>
    );
};

export default AdminPanelContainer;
