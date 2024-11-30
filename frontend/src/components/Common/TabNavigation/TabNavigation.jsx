import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TabNavigation = ({ tabs = ['tab1', 'tab2'] ,onTabChange}) => {
    TabNavigation.propTypes = {
        tabs: PropTypes.arrayOf(PropTypes.string)
    };
    const [activeTab, setActiveTab] = useState(tabs[0] || '');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        onTabChange(tabName);
    };

    return (
        <div className={`w-fit bg-base border border-secondary  rounded-sm shadow-inset-custom grid grid-cols-${tabs.length}`}>
            {tabs?.map((tabName) => (
                <button
                    key={tabName}
                    className={`w-full px-4 py-4 rounded-sm font-semibold text-lg
                     ${activeTab === tabName ? 'bg-secondary text-buttons shadow-outer-custom' : ''}
                     transition-colors duration-150`}
                    onClick={() => handleTabChange(tabName)}
                >
                    {tabName}
                </button>
            ))}
        </div>
    );
};


export default TabNavigation;
