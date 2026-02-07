import React, { useState } from 'react';

export default function SizeGuide() {
  const [selectedCategory, setSelectedCategory] = useState('shoes');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
        <p className="text-gray-600 mb-12">Find your perfect fit with our comprehensive size guide</p>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setSelectedCategory('shoes')}
            className={`py-2 px-6 font-bold border-b-2 transition ${
              selectedCategory === 'shoes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            👟 Shoes
          </button>
          <button
            onClick={() => setSelectedCategory('clothing')}
            className={`py-2 px-6 font-bold border-b-2 transition ${
              selectedCategory === 'clothing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            👕 Clothing
          </button>
        </div>

        {/* Shoes Size Guide */}
        {selectedCategory === 'shoes' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Shoe Size Chart</h2>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">US Size</th>
                      <th className="px-4 py-3 text-left font-bold">EU Size</th>
                      <th className="px-4 py-3 text-left font-bold">UK Size</th>
                      <th className="px-4 py-3 text-left font-bold">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { us: '5', eu: '35', uk: '3.5', cm: '21.6' },
                      { us: '6', eu: '36', uk: '4.5', cm: '22.5' },
                      { us: '6.5', eu: '36.5', uk: '5', cm: '23.2' },
                      { us: '7', eu: '37', uk: '5.5', cm: '23.8' },
                      { us: '8', eu: '38', uk: '6.5', cm: '24.5' },
                      { us: '9', eu: '39', uk: '7.5', cm: '25.4' },
                      { us: '10', eu: '40', uk: '8.5', cm: '26.0' },
                      { us: '11', eu: '41', uk: '9.5', cm: '27.0' },
                      { us: '12', eu: '42', uk: '10.5', cm: '27.9' }
                    ].map((size, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{size.us}</td>
                        <td className="px-4 py-3">{size.eu}</td>
                        <td className="px-4 py-3">{size.uk}</td>
                        <td className="px-4 py-3">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-6">
                <h3 className="font-bold mb-3">💡 Tips for Getting the Right Fit</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Measure your feet in the afternoon (they swell slightly)</li>
                  <li>✓ Wear socks similar to what you'll wear with the shoes</li>
                  <li>✓ Leave about a thumb's width of space at the toe</li>
                  <li>✓ If between sizes, we recommend going up</li>
                  <li>✓ Different brands may fit slightly differently</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">How to Measure Your Feet</h2>
              <ol className="space-y-4 text-gray-700">
                <li>
                  <span className="font-bold">1. Place a ruler on the floor</span>
                  <p className="text-sm text-gray-600 mt-1">Stand barefoot on a flat surface with the ruler against a wall</p>
                </li>
                <li>
                  <span className="font-bold">2. Mark the longest part</span>
                  <p className="text-sm text-gray-600 mt-1">Have someone mark where your longest toe extends to</p>
                </li>
                <li>
                  <span className="font-bold">3. Measure the distance</span>
                  <p className="text-sm text-gray-600 mt-1">Measure from the wall to the mark in centimeters</p>
                </li>
                <li>
                  <span className="font-bold">4. Match to our chart</span>
                  <p className="text-sm text-gray-600 mt-1">Find your measurement in the "Length (cm)" column above</p>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Clothing Size Guide */}
        {selectedCategory === 'clothing' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Clothing Size Chart</h2>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Size</th>
                      <th className="px-4 py-3 text-left font-bold">Chest (in)</th>
                      <th className="px-4 py-3 text-left font-bold">Waist (in)</th>
                      <th className="px-4 py-3 text-left font-bold">Length (in)</th>
                      <th className="px-4 py-3 text-left font-bold">Fit Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'XS', chest: '32-34', waist: '24-26', length: '25-26', fit: 'Slim' },
                      { size: 'S', chest: '34-36', waist: '26-28', length: '26-27', fit: 'Regular' },
                      { size: 'M', chest: '38-40', waist: '30-32', length: '27-28', fit: 'Regular' },
                      { size: 'L', chest: '42-44', waist: '34-36', length: '28-29', fit: 'Relaxed' },
                      { size: 'XL', chest: '46-48', waist: '38-40', length: '29-30', fit: 'Relaxed' },
                      { size: 'XXL', chest: '50-52', waist: '42-44', length: '30-31', fit: 'Relaxed' }
                    ].map((size, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold">{size.size}</td>
                        <td className="px-4 py-3">{size.chest}</td>
                        <td className="px-4 py-3">{size.waist}</td>
                        <td className="px-4 py-3">{size.length}</td>
                        <td className="px-4 py-3">{size.fit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-6">
                <h3 className="font-bold mb-3">💡 Clothing Fit Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Measure while wearing similar clothing</li>
                  <li>✓ Measure in the widest part of your chest</li>
                  <li>✓ Don't pull the tape measure too tight</li>
                  <li>✓ Check multiple measurements for best fit</li>
                  <li>✓ Review individual product descriptions (some items may fit differently)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">How to Measure Clothing</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Chest/Bust</h3>
                  <p className="text-gray-700">Measure around the fullest part of your chest while wearing a similar fit shirt. Keep the tape measure parallel to the ground and don't pull too tight.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Waist</h3>
                  <p className="text-gray-700">Measure around your natural waist, which is typically where your pants sit. Keep the tape measure loose and comfortable.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Length</h3>
                  <p className="text-gray-700">For shirts, measure from the top of your shoulder down to where you want the shirt to end. For pants, measure from the top of the waistband to the ankle.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
