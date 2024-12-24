
const AdminPanelContainer = ({pageTitle,children,layout}) => {

    return (
        <>
            <div className={`w-full  max-w-screen-xl mx-auto`}>
                <div className="mb-5 p-5 bg-secondary rounded-b-sm ">
                    <h1 className="text-titles text-4xl text-center">{pageTitle}</h1>
                </div>
                <div className=" w-full rounded-lg">
                    <section className={`${layout} border border-secondary  rounded-md  bg-white`}>
                        {children}
                    </section>
                </div>
            </div>
        </>
    );
};

export default AdminPanelContainer;
