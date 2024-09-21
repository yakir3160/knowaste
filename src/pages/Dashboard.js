import React from 'react';
import Card from '../components/Card';
import Button from "../components/Button";

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
const sidebarButtonClass = 'w-full text-left font-semibold hover:bg-secondary transition-all p-3 rounded-[15px] shadow-outer-custom'
const Dashboard = () => {
    return (
        <div className="flex flex-col gap-5 w-full p-6 rounded-lg border-2 border-secondary sm:rounded-lg  ">
            <div className="flex flex-col md:flex-row gap-5">
                <aside className="w-full md:w-64 rounded-lg h-screen"> {/* Adjusted for full height */}
                    <h2 className="text-2xl font-semibold text-titles p-3">Hello user</h2>
                    <ul className="list-inside text-titles py-5 px-1 flex flex-col gap-5">
                        <li>
                            <button className={sidebarButtonClass}>Dashboard</button>
                        </li>
                        <li>
                            <button className={sidebarButtonClass}>Orders Report</button>
                        </li>
                        <li>
                            <button className={sidebarButtonClass}>Waste Report</button>
                        </li>
                        <li>
                            <button className={sidebarButtonClass}>Request a Quote</button>
                        </li>
                        <li>
                            <button
                                className={`${sidebarButtonClass} text-errorRed hover:bg-[#FF7A7A] hover:text-[#ffffff] transition-all`}>
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </aside>

                <section
                    className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 rounded-md border-2 border-secondary bg-baseLight p-6 bg-base">
                    <Card className="w-full h-[20rem] bg-base p-4  ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4  ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4   ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4  ">
                        <PlaceholderChart/>
                    </Card>
                    <Card className="w-full h-[20rem] p-4 ">
                        <PlaceholderList/>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;