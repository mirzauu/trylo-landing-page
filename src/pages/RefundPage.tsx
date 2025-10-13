import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RefundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We want you to be completely satisfied with Trylo. If you're not happy with our service, you may be eligible for a refund under the following conditions:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Refund requests must be made within 7 days of your initial subscription</li>
              <li>Technical issues that prevent you from using the service</li>
              <li>Service does not perform as advertised</li>
              <li>Billing errors or unauthorized charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Non-Refundable Situations</h2>
            <div className="text-gray-300 leading-relaxed mb-4">
              <p className="mb-4">Refunds will not be provided in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind after using the service extensively</li>
                <li>Failure to cancel subscription before renewal</li>
                <li>Violation of our Terms of Service</li>
                <li>Requests made after the 7-day eligibility period</li>
                <li>Custom packages after work has commenced</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Monthly Subscription Refunds</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              For our ₹999/month subscription plan:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Full refund available within 7 days of first subscription</li>
              <li>Pro-rated refunds may be considered for technical issues</li>
              <li>No refunds for subsequent monthly renewals after the initial period</li>
              <li>Unused credits do not carry over and are non-refundable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Custom Package Refunds</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              For custom enterprise packages:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Refund terms are specified in individual contracts</li>
              <li>Partial refunds may be available for undelivered services</li>
              <li>Custom development work is generally non-refundable once started</li>
              <li>Setup fees are non-refundable after onboarding begins</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
            <div className="text-gray-300 leading-relaxed mb-4">
              <p className="mb-4">To request a refund, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team at support@trylo.ai</li>
                <li>Include your account email and subscription details</li>
                <li>Provide a clear reason for the refund request</li>
                <li>Include any relevant screenshots or documentation</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Refund Processing Time</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Once your refund request is approved:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Credit card refunds: 5-10 business days</li>
              <li>Bank transfers: 3-7 business days</li>
              <li>Digital wallet refunds: 1-3 business days</li>
              <li>You will receive email confirmation once processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cancellation vs. Refund</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Please note the difference between cancellation and refund:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Cancellation:</strong> Stops future billing but no money back</li>
              <li><strong>Refund:</strong> Returns money for current billing period</li>
              <li>You can cancel anytime to prevent future charges</li>
              <li>Cancellation takes effect at the end of current billing cycle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you disagree with our refund decision:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>You may escalate to our management team</li>
              <li>We'll review your case within 5 business days</li>
              <li>Final decisions will be communicated in writing</li>
              <li>You may pursue other legal remedies if unsatisfied</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Service Credits</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              In some cases, we may offer service credits instead of refunds:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Credits can be used for future service usage</li>
              <li>Credits expire 12 months from issue date</li>
              <li>Credits are non-transferable and non-refundable</li>
              <li>Credits may be offered for minor service disruptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting. Continued use of our service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For refund requests or questions about this policy:
              <br />
              Email: support@trylo.ai
              <br />
              Phone: +91 8592033444
              <br />
              Business Hours: Monday-Friday, 9 AM - 6 PM IST
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RefundPage;