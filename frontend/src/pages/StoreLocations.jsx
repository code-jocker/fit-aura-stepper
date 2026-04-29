import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function StoreLocations() {
  const stores = [
    {
      name: 'Kigali Downtown Store',
      address: '123 Avenue de la Paix, Kigali, Rwanda',
      phone: '+250 (0) 788 123 456',
      hours: 'Mon-Sat: 9 AM - 8 PM | Sun: 10 AM - 6 PM',
      image: '🏪'
    },
    {
      name: 'Kigali Heights Mall',
      address: 'Level 2, Kigali Heights Shopping Center',
      phone: '+250 (0) 789 234 567',
      hours: 'Mon-Sat: 9 AM - 9 PM | Sun: 10 AM - 8 PM',
      image: '🛍️'
    },
    {
      name: 'Muhanga Branch',
      address: 'Muhanga City Center, Muhanga',
      phone: '+250 (0) 787 345 678',
      hours: 'Tue-Sat: 10 AM - 7 PM | Sun: 11 AM - 6 PM',
      image: '🏬'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Store Locations | MBABAZI CLOSET</title>
        <meta name="description" content="Find a MBABAZI CLOSET store near you in Rwanda. Visit our locations in Kigali and Muhanga for premium fashion." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Store Locations</h1>
        <p className="text-gray-600 mb-12">Visit us at one of our physical stores across Rwanda</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {stores.map((store, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition">
              <div className="text-5xl mb-4">{store.image}</div>
              <h2 className="text-2xl font-bold mb-4">{store.name}</h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-3">
                  <span>📍</span>
                  <span>{store.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span>📞</span>
                  <a href={`tel:${store.phone}`} className="text-indigo-600 hover:underline">{store.phone}</a>
                </p>
                <p className="flex items-start gap-3">
                  <span>🕐</span>
                  <span>{store.hours}</span>
                </p>
              </div>
              <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">
                Get Directions
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-xl">👕</span>
              <span>Full range of products available in-store</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">👔</span>
              <span>Expert fitting assistance from trained staff</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <span>Exclusive in-store promotions and discounts</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">💳</span>
              <span>Multiple payment options accepted</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
