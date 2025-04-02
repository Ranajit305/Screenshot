import React, { useState } from 'react'
import axios from "axios";
import { Camera, Loader } from 'lucide-react'

const App = () => {

  const [loading, setLoading] = useState(false);

  const points = [
    {
      id: 1,
      title: "Enhancing Visual Appeal",
      description: "Infographics leverage visually appealing designs, which can capture users' attention quickly on Pinterest's image-centric platform. This visual aspect can lead to increased engagement and higher pin rates."
    },
    {
      id: 2,
      title: "Simplifying Complex Information",
      description: "Infographics simplify complex data and concepts into digestible visual formats. This is particularly useful for e-commerce brands or service providers looking to explain products or services quickly."
    },
    {
      id: 3,
      title: "Boosting Brand Awareness",
      description: "Consistent use of infographics helps in building brand identity. By using specific colors, fonts, and styles, brands can create a distinct visual language that resonates with users and enhances recall."
    },
    {
      id: 4,
      title: "Encouraging Shares and Saves",
      description: "Infographics are highly shareable content; they encourage users to save, pin, or share them due to their informative nature. This can lead to organic reach and visibility on Pinterest."
    },
    {
      id: 5,
      title: "Driving Traffic to Websites",
      description: "Infographics can include call-to-actions (CTAs) linking back to your website or landing page, facilitating the conversion of Pinterest users into website visitors, thus driving traffic effectively."
    },
    {
      id: 6,
      title: "Leveraging SEO Benefits",
      description: "When properly tagged with keywords and descriptions, infographics can enhance SEO on Pinterest. This can improve discoverability, making it easier for users interested in specific topics to find your pins."
    },
    {
      id: 7,
      title: "Creating Educational Content",
      description: "Infographics can serve as educational tools or tutorials, providing value to your audience. This type of informative content can establish authority in your niche and attract a loyal following."
    }
  ];

  const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api';

  const handleCaptureScreenshot = async () => {
    console.log(BASE_URL);
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/screenshot`, {
        params: { url: window.location.href },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "screenshot.png";
      link.click();
    } catch (error) {
      console.error("Error downloading screenshot:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-blue-100 rounded-xl shadow-lg overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-12">
          Harnessing Infographics for Effective Pinterest Marketing
        </h1>

        {loading && (
          <div className="fixed bottom-16 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin" /> Capturing Screenshot...
          </div>
        )}

        <div className="relative">
          {/* Vertical divider line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform -translate-x-1/2"></div>

          <div className="space-y-0">
            {points.map((point) => (
              <div key={point.id} className={`flex ${point.id % 2 === 1 ? 'flex-row' : 'flex-row-reverse'} items-center py-8`}>
                <div className={`w-1/2 relative`}>
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center justify-center w-full ${point.id % 2 === 1 ? 'pl-20' : 'pr-20'}`}>
                      {point.id % 2 === 1 ? (
                        <>
                          <div className="w-full h-15 bg-blue-200 font-bold flex text-9xl text-blue-500 items-center justify-center mx-auto">
                            {point.id}
                          </div>
                          <div className="w-full h-1 bg-blue-300"></div>
                          <div className='bg-gray-300 w-8 h-8 border-blue-500 border-r-0 border-4'></div>
                        </>
                      ) : (
                        <>
                          <div className='bg-gray-300 w-8 h-8 border-blue-500 border-l-0 border-4'></div>
                          <div className="w-full h-1 bg-blue-300"></div>
                          <div className="w-full h-15 bg-blue-200 text-blue-500 font-bold text-9xl flex items-center justify-center mx-auto">
                            {point.id}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content container */}
                <div className={`w-1/2 ${point.id % 2 === 1 ? ' text-left' : 'text-right'} flex items-center justify-center`}>
                  <div className={`${point.id % 2 === 1 ? 'flex flex-row-reverse items-center' : 'hidden'}`}>
                    <div className='pr-5'></div>
                    <div className='w-5 h-8 bg-gray-300 border-blue-500 border-4 border-l-0 z-10'></div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{point.title}</h2>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                  <div className={`${point.id % 2 === 0 ? 'flex items-center' : 'hidden'}`}>
                    <div className='pr-5'></div>
                    <div className='w-5 h-8 bg-gray-300 border-blue-500 border-4 border-r-0 z-10'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={handleCaptureScreenshot}
        disabled={loading}
        className={`fixed bottom-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
      >
        <Camera className="w-5 h-5" /> {loading ? "Processing..." : "Take Screenshot"}
      </button>
    </div>
  );
};

export default App