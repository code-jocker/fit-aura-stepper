import React, { useState } from 'react';

export default function Returns() {
  const [activeTab, setActiveTab] = useState('policy');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
        
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('policy')}
            className={`py-2 px-4 font-bold border-b-2 ${
              activeTab === 'policy' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'
            }`}
          >
            Return Policy
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`py-2 px-4 font-bold border-b-2 ${
              activeTab === 'process' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'
            }`}
          >
            How to Return
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2 px-4 font-bold border-b-2 ${
              activeTab === 'faq' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Return Policy */}
        {activeTab === 'policy' && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your items, we offer easy returns and exchanges.
              </p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4 py-4 bg-blue-50">
              <h3 className="font-bold mb-2">30-Day Return Window</h3>
              <p className="text-gray-700">Most items can be returned within 30 days of purchase for a full refund.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Return Conditions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Items must be unworn and in original condition</li>
                <li>✓ Keep all original tags and packaging</li>
                <li>✓ Items must not show signs of use</li>
                <li>✓ Receipt or proof of purchase required</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Non-Returnable Items</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✗ Sale or clearance items (final sale)</li>
                <li>✗ Items purchased more than 30 days ago</li>
                <li>✗ Custom or personalized items</li>
                <li>✗ Items without original tags</li>
              </ul>
            </div>
          </div>
        )}

        {/* How to Return */}
        {activeTab === 'process' && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-2xl font-bold">How to Return Your Items</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg">Start a Return</h3>
                  <p className="text-gray-600">Go to your account and select "Start Return" next to the item</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg">Choose Return Reason</h3>
                  <p className="text-gray-600">Select why you're returning the item from the provided options</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg">Print Return Label</h3>
                  <p className="text-gray-600">Print the prepaid return shipping label we'll provide</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-lg">Ship Back to Us</h3>
                  <p className="text-gray-600">Pack your item and ship it back using the provided label</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-bold text-lg">Get Your Refund</h3>
                  <p className="text-gray-600">Once received and inspected, we'll process your refund</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <details className="border-b pb-4">
              <summary className="font-bold text-lg cursor-pointer">How long do refunds take?</summary>
              <p className="text-gray-600 mt-3">Once we receive and inspect your return, we process refunds within 5-7 business days. You'll see the credit back on your payment method shortly after.</p>
            </details>

            <details className="border-b pb-4">
              <summary className="font-bold text-lg cursor-pointer">Can I exchange for a different size?</summary>
              <p className="text-gray-600 mt-3">Yes! We offer free exchanges for different sizes if the item is available. Just submit a return request and we'll help you with the exchange.</p>
            </details>

            <details className="border-b pb-4">
              <summary className="font-bold text-lg cursor-pointer">Do you cover return shipping?</summary>
              <p className="text-gray-600 mt-3">Yes, we provide a prepaid return label for most items, so return shipping is free.</p>
            </details>

            <details className="border-b pb-4">
              <summary className="font-bold text-lg cursor-pointer">What about damaged items?</summary>
              <p className="text-gray-600 mt-3">If your item arrived damaged, contact us immediately with photos. We'll arrange a replacement or full refund at no cost to you.</p>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
