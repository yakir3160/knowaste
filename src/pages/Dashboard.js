import React from 'react';
import Card from '../components/Card';

// Placeholder for a chart
const PlaceholderChart = () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500   rounded-md shadow-sm sm:rounded-lg">
        <p className="text-sm">Chart Placeholder</p>
    </div>
);

const PlaceholderList = () => (
    <div className="p-4 rounded-lg ">
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
    return (
        <div className="flex flex-col gap-5 w-full p-6 rounded-lg border-2 border-secondary sm:rounded-lg">
            <div className="flex flex-col md:flex-row gap-5" >
                <aside className="w-full h-screen md:w-64 p-4 ">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Links</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                        <li>Four</li>
                        <li>Five</li>
                    </ul>
                </aside>

                <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 rounded-md border-2 border-secondary bg-baseLight p-6 bg-base ">
                    <Card className="w-full h-[20rem] bg-base p-4  ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList />
                    </Card>
                    <Card className="w-full h-[20rem] p-4  ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4   ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4  ">
                        <PlaceholderChart />
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList />
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;