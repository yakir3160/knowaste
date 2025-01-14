import {useItemsContext} from "../../context/ItemsContext";
import Loading from "../Common/Loading/Loading";
import LoadingOverlay from "../Common/Overlays/LoadingOverlay";
import SavingOverlay from "../Common/Overlays/SavingOverlay";
const AdminPanelContainer = ({pageTitle,children,layout}) => {
    const { menuLoading, inventoryLoading, reportsLoading,success,saving, itemsError} = useItemsContext();
    return (
        <>

            {(menuLoading || inventoryLoading || reportsLoading) && <Loading />}
            {saving && <LoadingOverlay text={'Saving...'} />}
            {success && <SavingOverlay text={'Saved!'} />}
            <div className={`w-full  max-w-screen-xl mx-auto text-titles`}>
                <div className="mb-5 p-5 bg-secondary rounded-b-sm ">
                    <h1 className="text-titles text-4xl text-center">{pageTitle}</h1>
                </div>
                <div className=" w-full rounded-lg">
                    <section className={`${layout} border border-secondary  rounded-md  bg-white`}>
                        {itemsError && <div className="text-center text-errorRed">{itemsError}</div> }
                        {children}
                    </section>
                </div>

            </div>
        </>
    );
};

export default AdminPanelContainer;
