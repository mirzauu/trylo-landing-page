import React, { useState } from 'react';
import { CheckCircle, ImageIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate PhonePe checkout call
  const openPhonePeCheckout = async (planId: number, amount: number) => {
    setIsLoading(true);
    // Add your PhonePe checkout integration here
    window.open('https://app.trylo.space/', '_blank');
    setTimeout(() => setIsLoading(false), 1200); // Simulate delay
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose your perfect plan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {/* Basic */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="bg-gray-100 text-gray-900 p-6">
              <h3 className="text-xl font-bold">Basic</h3>
              <p className="text-xs opacity-90 mt-1">Full access monthly. No commitment.</p>
              <div className="flex items-end gap-1 mt-6">
                <span className="text-4xl font-extrabold">₹999</span>
                <span className="text-sm ml-1">/ month</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <ul className="space-y-3 mb-6 text-gray-700 flex-grow">
                <li className="flex items-start gap-3"><ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />Create up to 70 high-quality images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Unused tokens will carry over to future cycles</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />No watermark on generated images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Supports PNG and JPG export formats</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />Generate up to 5 images simultaneously</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Billed Monthly</li>
              </ul>
              <button
                className="w-full inline-flex justify-center items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => openPhonePeCheckout(1, 99900)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Basic'}
              </button>
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm flex flex-col relative">
            <div className="bg-[#D9ECF7] text-gray-900 p-6 relative">
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <span className="text-yellow-400">✦</span> Popular
              </div>
              <h3 className="text-xl font-bold">Pro</h3>
              <p className="text-xs opacity-80 mt-1">Unlimited access monthly. Simple and flexible.</p>
              <div className="flex items-end gap-1 mt-6">
                <span className="text-4xl font-extrabold">₹1,999</span>
                <span className="text-sm ml-1">/ month</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <ul className="space-y-3 mb-6 text-gray-700 flex-grow">
                <li className="flex items-start gap-3"><ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />Create up to 150 high-quality images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Unused tokens will carry over to future cycles</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />No watermark on generated images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Supports PNG and JPG export formats</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />Generate up to 9 images simultaneously</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5" />Priority processing for faster results</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Billed Monthly</li>
              </ul>
              <button
                className="w-full inline-flex justify-center items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => openPhonePeCheckout(2, 199900)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Pro'}
              </button>
            </div>
          </div>

          {/* Elite */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm flex flex-col relative">
            <div className="bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white p-6">
              <h3 className="text-xl font-bold">Elite</h3>
              <p className="text-xs opacity-90 mt-1">Maximum access and priority everything.</p>
              <div className="flex items-end gap-1 mt-6">
                <span className="text-4xl font-extrabold">₹3,499</span>
                <span className="text-sm ml-1">/ month</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <ul className="space-y-3 mb-6 text-gray-700 flex-grow">
                <li className="flex items-start gap-3"><ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />Create up to 400 high-quality images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Unlimited Tokens Validity</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />No watermark on generated images</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Supports PNG and JPG export formats</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />Generate up to 12 images simultaneously</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5" />Priority processing for faster results</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5" />Premium customer support included</li>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />Billed Monthly</li>
              </ul>
              <button
                className="w-full inline-flex justify-center items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => openPhonePeCheckout(3, 349900)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Get Elite'}
              </button>
            </div>
          </div>

          {/* Customization */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="bg-gray-50 text-gray-900 p-4">
              <h3 className="text-lg font-bold">Customization</h3>
              <p className="text-xs opacity-80 mt-1">Need higher limits? We can help.</p>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <ul className="space-y-2 mb-4 text-gray-700 flex-grow">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />Custom image quotas</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />Dedicated support</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />Team onboarding</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />Api Access</li>
              </ul>
              <button
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 group"
                onClick={() => window.open('https://app.trylo.space/', '_blank')}
              >
                <span>Contact Us</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
