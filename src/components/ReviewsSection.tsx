import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Priya Sharma",
    company: "StyleForward",
    role: "Creative Director",
    rating: 5,
    review: "Trylo transformed our product photography. Diverse models in minutes.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
  },
  {
    name: "Arjun Patel",
    company: "Urban Threads",
    role: "Marketing Manager",
    rating: 5,
    review: "Incredible AI-generated images. 40% conversion increase.",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
  },
  {
    name: "Anjali Reddy",
    company: "Eco Fashion Co.",
    role: "Founder",
    rating: 5,
    review: "Reduces waste while creating inclusive content. Game-changer!",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
  }
];

const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Join thousands of brands using Trylo
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-2xl relative hover:bg-gray-750 transition-all duration-300">
              <div className="absolute top-6 right-6 text-yellow-400">
                <Quote className="w-6 h-6" />
              </div>
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">"{review.review}"</p>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-gray-400 text-sm">{review.role}</p>
                  <p className="text-yellow-400 text-sm">{review.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;