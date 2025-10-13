import React, { useState } from 'react';

const tabs = [
  {
    id: "tab1",
    title: "Bulk Create",
    headline: "",
    description:
      "Generate multiple try-on images at once for faster workflows.",
    img: {
      src: "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Screenshot_212_zntart.png",
      alt: "Ready to use agents image",
      srcSet:
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a66af5ae9bc73c864c_Group%2013213146056-p-500.png 500w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a66af5ae9bc73c864c_Group%2013213146056-p-800.png 800w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a66af5ae9bc73c864c_Group%2013213146056-p-1080.png 1080w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a66af5ae9bc73c864c_Group%2013213146056-p-1600.png 1600w, " +
        "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Screenshot_212_zntart.png 2000w",
    },
    icon: (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.5013 1.15149L2.16797 5.31816V8.33318H3.83464V13.3333H3.23459L1.8457 17.5H19.1581L17.7692 13.3333H17.168V8.33318H18.8346V5.31816L10.5013 1.15149ZM15.5013 8.33318H13.8346V13.3333H15.5013V8.33318ZM12.168 13.3333V8.33318H8.83464V13.3333H12.168ZM7.16797 13.3333V8.33318H5.5013V13.3333H7.16797Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "tab2",
    title: "Easy Download",
    headline: "",
    description:
      " Instantly save your generated outfit images in high quality.",
    img: {
      src: "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Capturess_hkr1xl.png",
      alt: "Custom agents image",
      srcSet:
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a6b5af7518e42ea191_Group%201321314606-p-500.png 500w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a6b5af7518e42ea191_Group%201321314606-p-800.png 800w, " +
        // "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Capturess_hkr1xl.png 1080w, " +
        // "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Capturess_hkr1xl.png 1600w, " +
        "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118821/Capturess_hkr1xl.png 2000w",
    },
    icon: (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
      >
        <path d="M8.55859 2.5V17.5008H12.4502V2.5H8.55859Z" fill="currentColor" />
        <path d="M3 10.8334V17.5009H6.89167V10.8334H3Z" fill="currentColor" />
        <path d="M14.1152 17.5008V6.66663H18.0069V17.5008H14.1152Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "tab3",
    title: "Custom Model",
    headline: "",
    description:
      "Personalize results by choose models for your own brand.",
    img: {
      src: "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118825/ff_zsolys.png",
      alt: "Agentic Workflows image",
      srcSet:
        // "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118825/ff_zsolys.png 500w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a6d590767623243a70_Group%2013213144606-p-800.png 800w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a6d590767623243a70_Group%2013213144606-p-1080.png 1080w, " +
        // "https://cdn.prod.website-files.com/66f16517ab00018286b71576/67fce2a6d590767623243a70_Group%2013213144606-p-1600.png 1600w, " +
        "https://res.cloudinary.com/dbx01oh15/image/upload/v1758118825/ff_zsolys.png 2000w",
    },
    icon: (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2"
      >
        <path
          d="M18 10C18 14.1422 14.6422 17.5 10.5 17.5M18 10C18 5.85787 14.6422 2.5 10.5 2.5M18 10H3M10.5 17.5C6.35787 17.5 3 14.1422 3 10M10.5 17.5C8.65905 17.5 7.16667 14.1422 7.16667 10C7.16667 5.85787 8.65905 2.5 10.5 2.5M10.5 17.5C12.3409 17.5 13.8333 14.1422 13.8333 10C13.8333 5.85787 12.3409 2.5 10.5 2.5M10.5 2.5C6.35787 2.5 3 5.85787 3 10"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="square"
        />
      </svg>
    ),
  },
];

const DemoTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tab2"); // Default active tab

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Header */}
        <div className="flex space-x-6 mb-12 border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              className={`flex items-center space-x-2 pb-3 border-b-4 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent hover:text-yellow-400"
              } focus:outline-none`}
            >
              {tab.icon}
              <span className="font-semibold text-lg">{tab.title}</span>
              <div
                className="h-1 bg-yellow-400 rounded-full tab-progress-bar"
                style={{
                  width: activeTab === tab.id ? "95%" : "0",
                  transition: "width 0.5s ease",
                }}
              />
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        {/* Tabs Content */}
{tabs.map((tab) =>
  activeTab === tab.id ? (
    <div
      key={tab.id}
      id={`${tab.id}-panel`}
      role="tabpanel"
      aria-labelledby={`${tab.id}-tab`}
      className="flex flex-col items-center gap-6 max-w-7xl mx-auto text-center"
      style={{ opacity: 1, transition: "opacity 0.3s ease" }}
    >
      <div>
        <h3 className="text-3xl font-bold mb-4">{tab.headline}</h3>
        <p className="text-gray-300 text-lg">{tab.description}</p>
      </div>
      <img
        src={tab.img.src}
        alt={tab.img.alt}
        srcSet={tab.img.srcSet}
        sizes="(max-width: 1024px) 100vw, 100vw"
        loading="lazy"
        className="rounded-lg shadow-lg w-full max-w-9xl object-contain mx-auto"
      />
    </div>
  ) : null
)}

      </div>
    </section>
  );
};

export default DemoTabs;
