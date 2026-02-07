import React, { useState } from 'react';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Store Manager',
      location: 'Kigali Downtown',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Lead our downtown store operations, manage staff, and deliver excellent customer service.'
    },
    {
      id: 2,
      title: 'Sales Associate',
      location: 'Kigali Heights Mall',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Assist customers in finding the perfect products, provide product knowledge, and process sales.'
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      location: 'Head Office, Kigali',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Develop marketing strategies, manage social media, and create promotional campaigns.'
    },
    {
      id: 4,
      title: 'Logistics Coordinator',
      location: 'Kigali Warehouse',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Manage inventory, coordinate shipments, and optimize warehouse operations.'
    },
    {
      id: 5,
      title: 'Customer Service Representative',
      location: 'Remote',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Handle customer inquiries, process returns, and provide exceptional support.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-gray-600 mb-12">We're always looking for passionate individuals to join MBABAZI CLOSET</p>

        {/* Company Culture */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="font-bold mb-2">Purpose-Driven</h3>
                <p className="text-gray-600">Be part of a brand that celebrates African fashion and culture</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="font-bold mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">Develop your skills and advance your career with us</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="font-bold mb-2">Great Team</h3>
                <p className="text-gray-600">Work with passionate and talented people who care</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">💼</span>
              <div>
                <h3 className="font-bold mb-2">Benefits</h3>
                <p className="text-gray-600">Competitive salaries, health insurance, and staff discounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.location} • {job.type}</p>
                </div>
                <span className="text-2xl">{selectedJob?.id === job.id ? '▼' : '▶'}</span>
              </div>

              {selectedJob?.id === job.id && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  <div className="bg-indigo-50 p-4 rounded mb-6">
                    <p className="text-sm text-gray-600 mb-2"><strong>Salary:</strong> {job.salary}</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700">
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact HR */}
        <div className="bg-indigo-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-gray-700 mb-4">
            We're always interested in hearing from talented individuals. Send us your resume and tell us what you'd like to do!
          </p>
          <a href="mailto:careers@mbabazicloset.rw" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700">
            Send Your Resume
          </a>
        </div>
      </div>
    </div>
  );
}
