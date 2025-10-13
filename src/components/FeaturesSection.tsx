import React from 'react';
import { Zap, Users, Palette, Clock, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "AI creates realistic garment visualizations"
  },
  {
    icon: Users,
    title: "Diverse Models",
    description: "Wide range of models and body types"
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Generate professional images in seconds"
  },
  {
    icon: Palette,
    title: "Custom Styling",
    description: "Adjust poses to match your brand"
  },
  {
    icon: Shield,
    title: "Commercial License",
    description: "Full commercial usage rights"
  },
  {
    icon: Globe,
    title: "API Integration",
    description: "Integrate with your platforms"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create stunning product visuals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-2xl hover:bg-gray-750 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;