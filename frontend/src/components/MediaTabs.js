import React, { useState } from 'react';

const MediaTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {child.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {React.Children.map(children, (child, index) =>
          activeTab === index ? child : null
        )}
      </div>
    </div>
  );
};

export default MediaTabs;
