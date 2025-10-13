import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import LightRays from './LightRays';
import ImageCarousel from './ImageCarousel';
import VerticalCarousel from './VerticalCarousel';

const HeroSection: React.FC = () => {
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState(0);

  const handleGetStartedClick = () => {
    window.open('https://app.trylo.space/', '_blank');
  };

  const handleWatchDemoClick = () => {
    window.open('https://app.trylo.space/', '_blank');
  };

  // Original images data
  const originalImages = [
    {
      src: "/fake-real-black-mj.webp",
      alt: "Original model 1",
      title: "Original"
    },
    {
      src: "/tshirt_hs_men_pat_d48_o.jpg",
      alt: "Original model 2", 
      title: "Original"
    },
    // {
    //   src: "/WhatsApp Image 2025-07-25 at 19.37.04_c228ed86.jpg",
    //   alt: "Original model 3",
    //   title: "Elegant Style"
    // }
  ];

  // AI generated images for each original image
  const aiGeneratedImagesMap = {
    0: [
      {
        src: "/image (8).webp",
        alt: "AI generated model 1",
        title: "AI generated"
      },
      {
        src: "/image (7).jpg", 
        alt: "AI generated model 2",
        title: "AI generated"
      },
      {
        src: "/image (6).jpg", 
        alt: "AI generated model 2",
        title: "AI generated"
      },
   
    ],
    1: [
      {
        src: "/image (4).webp", 
        alt: "AI generated model 2",
        title: "AI generated"
      },
      {
        src: "/image (5).webp", 
        alt: "AI generated model 2",
        title: "AI generated"
      },
      {
        src: "/image (3).webp", 
        alt: "AI generated model 2",
        title: "AI generated"
      },
    ],
    2: [
      {
        src: "/image (14).webp",
        alt: "AI generated model 1",
        title: "AI generated"
      },
      // {
      //   src: "/fake-real-black-mj.webp",
      //   alt: "AI generated model 2",
      //   title: "Casual Look"
      // },
      // {
      //   src: "/image (8).webp",
      //   alt: "AI generated model 3",
      //   title: "Professional Fashion"
      // }
    ]
  };

  const handleOriginalImageChange = (index: number) => {
    setSelectedOriginalIndex(index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Light Rays Background Effect */}
      <LightRays 
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={0.8}
        lightSpread={2}
        rayLength={3}
        pulsating={true}
        fadeDistance={0.8}
        saturation={1.2}
        followMouse={true}
        mouseInfluence={0.5}
        noiseAmount={0.1}
        distortion={0.1}
        className="opacity-1"
      />
      
      {/* Logo Shadow Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/ChatGPT Image Aug 26, 2025, 08_24_33 PM.png" 
          alt="" 
          className="w-96 h-96 opacity-5 object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Create Realistic Images of Your Clothes
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Worn by Anyone
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI-powered garment visualization. Generate stunning model photos instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={handleGetStartedClick}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <button 
              onClick={handleWatchDemoClick}
              className="border border-gray-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button> */}
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required</p>
        </div>
        
        {/* Hero Visual */}
        
      </div>
    </section>
  );
};

export default HeroSection;

// <div className="relative z-10">
//           <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
//             {/* Original Images Vertical Carousel */}
//             <div className="flex-shrink-0">
//               <VerticalCarousel 
//                 images={originalImages}
//                 onImageChange={handleOriginalImageChange}
//                 autoplay={true}
//                 autoplayDelay={80000}
//                 showIndicators={true}
//                 showArrows={false}
//               />
//             </div>
            
//             {/* AI Generated Images Carousel */}
//             <div className="flex-shrink-0">
//               <ImageCarousel 
//                 images={aiGeneratedImagesMap[selectedOriginalIndex as keyof typeof aiGeneratedImagesMap]}
//                 autoplay={true}
//                 autoplayDelay={4000}
//                 showIndicators={true}
//                 showArrows={true}
//               />
//             </div>
//           </div>
//         </div>