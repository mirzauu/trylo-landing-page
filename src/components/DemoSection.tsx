import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import { ArrowRight, Upload, Wand2, Download } from 'lucide-react';
import "./CardSwap.css";

interface CardProps {
  customClass?: string;
  className?: string;
  [key: string]: any;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

interface CardSwapProps {
  width?: number;
  height?: number;
  currentStep?: number;
  children: React.ReactNode;
}

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  currentStep = 0,
  children,
}) => {
  const childArr = useMemo(
    () => Children.toArray(children),
    [children]
  );
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    
    // Position all cards in a stack with the current step on top
    refs.forEach((r, i) => {
      if (r.current) {
        const isActive = i === currentStep;
        const zIndex = isActive ? total : total - Math.abs(i - currentStep) - 1;
        const scale = isActive ? 1 : 0.9;
        const y = isActive ? 0 : (i - currentStep) * 20;
        const x = isActive ? 0 : (i - currentStep) * 10;
        const opacity = isActive ? 1 : 0.7;
        const rotation = isActive ? 0 : (i - currentStep) * 2;
        
        gsap.to(r.current, {
          x: x,
          y: y,
          scale: scale,
          zIndex: zIndex,
          opacity: opacity,
          rotation: rotation,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "center center",
          duration: 0.6,
          ease: "power2.out",
          force3D: true,
        });
      }
    });
  }, [currentStep, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(child.props.style ?? {}) },
      } as any) : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

const DemoSection: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const handleTryDemoClick = () => {
    window.open('https://app.trylo.space/', '_blank');
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const steps = [
    {
      step: 1,
      title: "Upload Garment",
      description: "Upload your clothing item photo",
      icon: Upload,
      image: "/WhatsApp Image 2025-07-25 at 19.37.04_c228ed86.jpg"
    },
    {
      step: 2,
      title: "Choose Model",
      description: "Select from our AI model library",
      icon: Wand2,
      image: "/71C-DMK6PmL._SY741_.jpg"
    },
    {
      step: 3,
      title: "Download Results",
      description: "Get professional photos instantly",
      icon: Download,
      image: "/image (14).webp"
    }
  ];

  return (
    <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create visuals in three steps
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left side - Text content with progress bar */}
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Current Step</h3>
                <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 relative">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index <= currentStep ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}
                    onClick={() => handleStepClick(index)}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Step Details */}
            {steps.map((step, index) => (
              <button
                key={step.step}
                onClick={() => handleStepClick(index)}
                className={`w-full text-left flex items-start space-x-4 transition-all duration-300 hover:scale-105 ${
                  index === currentStep ? 'opacity-100 scale-105' : 'opacity-60 scale-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0 transition-all duration-300 ${
                  index === currentStep ? 'bg-yellow-500 scale-110' : 'bg-gray-600 hover:bg-gray-500'
                }`}>
                  {step.step}
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                      index === currentStep ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}>
                      <step.icon className={`w-4 h-4 transition-all duration-300 ${
                        index === currentStep ? 'text-black' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className={`text-xl font-semibold transition-all duration-300 ${
                      index === currentStep ? 'text-white' : 'text-gray-400'
                    }`}>{step.title}</h3>
                  </div>
                  <p className={`leading-relaxed transition-all duration-300 ${
                    index === currentStep ? 'text-gray-300' : 'text-gray-500'
                  }`}>{step.description}</p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Right side - CardSwap */}
          <div className="flex justify-center lg:justify-end">
            <CardSwap
              width={400}
              height={500}
              currentStep={currentStep}
            >
              {steps.map((step, index) => (
                <Card key={index} customClass="demo-card">
                  <img src={step.image} alt={step.title} />
                  <div className="card-content">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <step.icon className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-sm font-medium">Step {step.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={handleTryDemoClick}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Try Demo Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;