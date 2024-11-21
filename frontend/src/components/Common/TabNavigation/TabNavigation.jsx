import React, {useState} from 'react';
  const TabNavigation =({tabs,onTabChange})=>{
        const [activeTab,setActiveTab]=useState(tabs[0]);
        const handleTabChange=(tabName) =>
        {
            setActiveTab(tabName);
            onTabChange(tabName);
        };

      return(
         <div className={`w-fit bg-base border border-secondary  self-center rounded-sm shadow-inset-custom `}>
             {tabs.map((tabName) => (
                 <button key={tabName} className={`px-4 py-4 rounded-sm font-semibold
                        ${activeTab === tabName ? 'bg-secondary  text-buttons shadow-outer-custom' : ''}
                        transition-colors duration-150 `}
                        onClick={() => handleTabChange(tabName)}
                 >
                        {tabName}
                 </button>
             )
             )}
         </div>
      );
  }
  export default TabNavigation;