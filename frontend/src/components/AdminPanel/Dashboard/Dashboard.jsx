import React from 'react';
import Card from '../../Common/Card/Card';
import AdminPanelContainer from "../AdminPanelContainer";

const PlaceholderChart = () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500 rounded-md shadow-sm sm:rounded-lg">
        <p className="text-sm">Chart Placeholder</p>
    </div>
);

const PlaceholderList = () => (
    <div className="p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-2">List Placeholder</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <li>Item 5</li>
        </ul>
    </div>
);

const Dashboard = () => {
    const layout = 'flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 rounded-md border-2 p-6 ';
    return (
        <AdminPanelContainer pageTitle={"Dashboard"} layout={layout}>

                <Card className="w-full h-[20rem] bg-base p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderList />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderList />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderList />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderChart />
                </Card>
                <Card className="w-full h-[20rem] p-4">
                    <PlaceholderList />
                </Card>
        </AdminPanelContainer>
    );
};

export default Dashboard;
