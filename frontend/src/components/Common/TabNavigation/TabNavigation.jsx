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
        <div className={`w-3/4 bg-secondary self-center  rounded-t-sm  grid grid-cols-${tabs.length}`}>
            {tabs?.map((tabName) => (
                <button
                    key={tabName}
                    className={`w-full min-w-min px-4 py-4 rounded-t-sm font-semibold text-lg
                     ${activeTab === tabName ? 'bg-cards text-buttons' : ''}
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
