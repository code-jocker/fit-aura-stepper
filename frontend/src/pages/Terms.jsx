import React from 'react';

export default function Terms() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-slate-300">Please read these terms carefully before using our services</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a href="#acceptance" className="text-amber-600 hover:underline">Acceptance of Terms</a>
            <a href="#license" className="text-amber-600 hover:underline">Use License</a>
            <a href="#disclaimer" className="text-amber-600 hover:underline">Disclaimer</a>
            <a href="#limitations" className="text-amber-600 hover:underline">Limitations</a>
            <a href="#accuracy" className="text-amber-600 hover:underline">Accuracy</a>
            <a href="#links" className="text-amber-600 hover:underline">External Links</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <section id="acceptance">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Fit Aura & Steppers website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* 2. Use License */}
          <section id="license">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Fit Aura & Steppers website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <ul className="space-y-2">
                <li className="flex items-start"><span className="text-slate-600 mr-2">•</span> <span className="text-gray-700">Modifying or copying the materials</span></li>
                <li className="flex items-start"><span className="text-slate-600 mr-2">•</span> <span className="text-gray-700">Using the materials for any commercial purpose or for any public display</span></li>
                <li className="flex items-start"><span className="text-slate-600 mr-2">•</span> <span className="text-gray-700">Attempting to decompile or reverse engineer any software contained on the website</span></li>
                <li className="flex items-start"><span className="text-slate-600 mr-2">•</span> <span className="text-gray-700">Removing any copyright or other proprietary notations from the materials</span></li>
                <li className="flex items-start"><span className="text-slate-600 mr-2">•</span> <span className="text-gray-700">Transferring the materials to another person or "mirroring" the materials on any other server</span></li>
              </ul>
            </div>
          </section>

          {/* 3. Disclaimer */}
          <section id="disclaimer">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">3. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The materials on Fit Aura & Steppers website are provided "as is". Fit Aura & Steppers makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* 4. Limitations */}
          <section id="limitations">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">4. Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Fit Aura & Steppers or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Fit Aura & Steppers website, even if Fit Aura & Steppers or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* 5. Accuracy of Materials */}
          <section id="accuracy">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Accuracy of Materials</h2>
            <p className="text-gray-700 mb-4">
              The materials appearing on Fit Aura & Steppers website could include technical, typographical, or photographic errors. Fit Aura & Steppers does not warrant that any of the materials on our website are accurate, complete, or current. Fit Aura & Steppers may make changes to the materials contained on our website at any time without notice.
            </p>
          </section>

          {/* 6. Links */}
          <section id="links">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">6. Links to External Websites</h2>
            <p className="text-gray-700 mb-4">
              Fit Aura & Steppers has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Fit Aura & Steppers of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          {/* 7. Modifications */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Modifications</h2>
            <p className="text-gray-700 mb-4">
              Fit Aura & Steppers may revise these Terms and Conditions for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms and Conditions.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions are governed by and construed in accordance with the laws of Rwanda, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* 9. Payment Terms */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">9. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              All prices are subject to change without notice. We accept various payment methods including credit cards, mobile money, and bank transfers. Payment must be received before order fulfillment.
            </p>
          </section>

          {/* 10. Return Policy */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">10. Return & Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              Returns are accepted within 30 days of purchase in original condition with all tags attached. Please refer to our Returns page for detailed return procedures and conditions.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-50 p-8 rounded-lg mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                <a href="mailto:support@fitaurasteppers.com" className="text-amber-600 hover:underline">
                  support@fitaurasteppers.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                <a href="tel:+250788123456" className="text-amber-600 hover:underline">
                  +250 788 123 456
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-700">
                  Kigali, Rwanda<br />
                  East Africa
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
