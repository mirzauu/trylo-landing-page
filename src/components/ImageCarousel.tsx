import React, { useState, useEffect, useRef } from 'react';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    title: string;
  }>;
  autoplay?: boolean;
  autoplayDelay?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoplay = true,
  autoplayDelay = 3000,
  showIndicators = true,
  showArrows = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(nextSlide, autoplayDelay);
      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
  }, [autoplay, autoplayDelay, currentIndex, isTransitioning]);

  const handleMouseEnter = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (autoplay) {
      autoplayRef.current = setInterval(nextSlide, autoplayDelay);
    }
  };

  return (
    <div 
      className="image-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.3s ease-in-out' : 'none'
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <div className="image-container">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="carousel-image"
                />
                <div className="image-overlay">
                  <div className="image-title">{image.title}</div>
                  <div className="image-subtitle">AI Generated {index + 1}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showArrows && (
          <>
            <button 
              className="carousel-arrow carousel-arrow-left"
              onClick={prevSlide}
              disabled={isTransitioning}
            >
              ‹
            </button>
            <button 
              className="carousel-arrow carousel-arrow-right"
              onClick={nextSlide}
              disabled={isTransitioning}
            >
              ›
            </button>
          </>
        )}
      </div>

      {showIndicators && (
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
