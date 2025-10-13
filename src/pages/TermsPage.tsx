import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          <p className="text-gray-400 mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing and using Trylo's AI-powered garment visualization service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Trylo provides AI-powered technology that generates realistic images of garments worn by virtual models. Our service is designed for commercial and personal use in fashion, e-commerce, and marketing applications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Usage Rights and Restrictions</h2>
            <div className="text-gray-300 leading-relaxed mb-4">
              <p className="mb-4">You may use our service for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Commercial product photography and marketing</li>
                <li>E-commerce product listings</li>
                <li>Fashion design and visualization</li>
                <li>Personal creative projects</li>
              </ul>
              <p className="mb-4">You may not use our service for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating inappropriate, offensive, or illegal content</li>
                <li>Violating intellectual property rights</li>
                <li>Impersonating real individuals without consent</li>
                <li>Reverse engineering or attempting to replicate our technology</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Images generated through our service are provided with commercial usage rights to the subscriber. However, the underlying AI technology, software, and platform remain the intellectual property of Trylo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment and Billing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Subscription fees are billed in advance on a monthly basis. All fees are non-refundable except as expressly stated in our Refund Policy. We reserve the right to change our pricing with 30 days' notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              While we strive to maintain 99.9% uptime, we do not guarantee uninterrupted service availability. Scheduled maintenance and updates may temporarily affect service access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Trylo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Either party may terminate this agreement at any time. Upon termination, your access to the service will cease, and any outstanding fees will remain due.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms & Conditions, please contact us at:
              <br />
              Email: legal@trylo.ai
              <br />
              Phone: +91 8592033444
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsPage;