import React from 'react';

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-amber-100">Your privacy is important to us</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a href="#information" className="text-amber-600 hover:underline">Information Collection</a>
            <a href="#usage" className="text-amber-600 hover:underline">Usage of Information</a>
            <a href="#security" className="text-amber-600 hover:underline">Data Security</a>
            <a href="#rights" className="text-amber-600 hover:underline">Your Rights</a>
            <a href="#cookies" className="text-amber-600 hover:underline">Cookies</a>
            <a href="#contact" className="text-amber-600 hover:underline">Contact Us</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* 1. Introduction */}
          <section id="introduction">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              At Fit Aura & Steppers, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-700">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our website.
            </p>
          </section>

          {/* 2. Information Collection */}
          <section id="information">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-3 text-gray-800">Personal Information</h3>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <ul className="space-y-2">
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Name and contact information (email, phone, address)</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Billing and shipping addresses</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Payment information (processed securely)</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Account credentials and preferences</span></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-4 mb-3 text-gray-800">Usage Information</h3>
            <div className="bg-gray-50 p-4 rounded">
              <ul className="space-y-2">
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">IP address and device information</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Browser type and operating system</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Pages visited and time spent on site</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Referral source and search queries</span></li>
              </ul>
            </div>
          </section>

          {/* 3. Usage of Information */}
          <section id="usage">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">3. How We Use Your Information</h2>
            <div className="bg-gray-50 p-4 rounded">
              <ul className="space-y-2">
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Process and fulfill your orders</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Send order confirmations and updates</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Respond to your inquiries and requests</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Improve our website and services</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Send marketing communications (with your consent)</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Comply with legal obligations</span></li>
              </ul>
            </div>
          </section>

          {/* 4. Data Security */}
          <section id="security">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>
            <p className="text-gray-700">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* 5. Your Rights */}
          <section id="rights">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <ul className="space-y-2">
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Right to access your personal information</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Right to correct inaccurate data</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Right to request deletion of your data</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Right to opt out of marketing communications</span></li>
                <li className="flex items-start"><span className="text-amber-500 mr-2">•</span> <span className="text-gray-700">Right to data portability</span></li>
              </ul>
            </div>
          </section>

          {/* 6. Cookies */}
          <section id="cookies">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences and understand how you use our site.
            </p>
            <p className="text-gray-700">
              You can control cookie settings through your browser preferences. Please note that disabling cookies may affect website functionality.
            </p>
          </section>

          {/* 7. Third-Party Sharing */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Third-Party Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information to third parties. We may share information with trusted service providers who assist in operating our website and conducting our business, subject to confidentiality agreements.
            </p>
            <p className="text-gray-700">
              We may also disclose information when required by law or to protect our rights and safety.
            </p>
          </section>

          {/* 8. Policy Changes */}
          <section>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on our website with an updated effective date.
            </p>
          </section>

          {/* Contact Section */}
          <section id="contact" className="bg-gray-50 p-8 rounded-lg mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                <a href="mailto:privacy@fitaurasteppers.com" className="text-amber-600 hover:underline">
                  privacy@fitaurasteppers.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                <a href="tel:+250788123456" className="text-amber-600 hover:underline">
                  +250 788 123 456
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Mailing Address</h3>
                <p className="text-gray-700">
                  Fit Aura & Steppers<br />
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
