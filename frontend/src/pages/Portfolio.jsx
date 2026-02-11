import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const services = [
    {
      title: 'E-commerce Mastery',
      description: 'Specializing in high-performance retail platforms like MBABAZI CLOSET, optimized for speed and conversion.',
      icon: '🚀'
    },
    {
      title: 'Full-Stack Engineering',
      description: 'Architecting scalable backend systems with Node.js and MongoDB, paired with pixel-perfect React frontends.',
      icon: '⚙️'
    },
    {
      title: 'UI/UX Innovation',
      description: 'Creating immersive digital environments that tell a brand story and drive user engagement.',
      icon: '✨'
    },
    {
      title: 'Cloud & DevOps',
      description: 'Seamless deployment strategies on Render, AWS, and Vercel for 99.9% uptime and global reach.',
      icon: '☁️'
    }
  ];

  const projects = [
    {
      title: 'MBABAZI CLOSET',
      category: 'Flagship E-commerce',
      description: 'Rwanda\'s premium sneakers destination with real-time stock tracking and secure payments.',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
      link: '/'
    },
    {
      title: 'Kigali Marketplace',
      category: 'Multi-vendor Platform',
      description: 'A community-driven platform connecting local artisans with global fashion enthusiasts.',
      image: 'https://images.unsplash.com/photo-1534452286302-2f5004574b5b?w=800&q=80',
      link: '#'
    },
    {
      title: 'Aura Fitness',
      category: 'Health & Wellness',
      description: 'Comprehensive fitness tracking and gear shop for the modern athlete.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      link: '#'
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: '25+' },
    { label: 'Happy Clients', value: '15+' },
    { label: 'Lines of Code', value: '100K+' },
    { label: 'Coffee Consumed', value: '∞' },
  ];

  return (
    <div className="bg-white text-black font-sans">
      <Helmet>
        <title>Clever Digital Solutions | Professional Portfolio</title>
        <meta name="description" content="Portfolio of Clever Digital Solutions - Building Rwanda's digital future with premium web and e-commerce solutions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-amber-500 text-black text-xs font-black uppercase tracking-[0.2em] rounded-full mb-8 animate-fade-in">
            Digital Excellence from Rwanda 🇷🇼
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter">
            WE BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">DIGITAL LEGACIES</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
            Building premium digital experiences that scale. We turn complex problems into elegant, high-performance solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#contact" className="px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all transform hover:scale-105">
              Start a Project
            </a>
            <a href="#work" className="px-10 py-4 border border-white/20 text-white rounded-full font-black uppercase tracking-wider hover:bg-white/10 transition-all">
              View Work
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-tight">Our Services</h2>
            <div className="h-2 w-24 bg-amber-500 mb-6"></div>
            <p className="text-xl text-gray-600">
              We provide end-to-end digital services to help your business thrive in the modern economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-black text-amber-500 mb-2">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <h2 className="text-center text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-12">Our Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-40">
            {['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'Firebase'].map((tech, index) => (
              <span key={index} className="text-2xl md:text-4xl font-black text-gray-900 hover:text-amber-500 transition-colors cursor-default uppercase tracking-tighter">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-24 bg-black text-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 tracking-tight">Featured Work</h2>
              <p className="text-xl text-gray-400">
                A selection of digital products we've crafted with precision and passion.
              </p>
            </div>
            <Link to="/" className="text-amber-500 font-black uppercase tracking-widest hover:text-white transition-colors">
              View All Projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      View Project
                    </span>
                  </div>
                </div>
                <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">{project.category}</span>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto bg-black rounded-[2rem] p-12 md:p-20 text-white relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">READY TO BUILD <br /> SOMETHING GREAT?</h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Let's discuss your project and see how we can help your business reach its full digital potential.
              </p>
              <a 
                href="mailto:princeshyakaclever@gmail.com" 
                className="inline-block px-12 py-5 bg-amber-500 text-black rounded-full font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105"
              >
                Send an Email
              </a>
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8 text-sm font-black uppercase tracking-widest text-gray-500">
                <span>Kigali, Rwanda 🇷🇼</span>
                <span className="hidden md:inline">•</span>
                <span>+250 780 000 000</span>
                <span className="hidden md:inline">•</span>
                <span>princeshyakaclever@gmail.com</span>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black tracking-tighter">C</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Clever Digital Solutions</span>
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            © 2026 Clever Digital Solutions. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
