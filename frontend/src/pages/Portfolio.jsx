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
    { label: 'Projects Completed', value: '150+' },
    { label: 'Happy Clients', value: '100+' },
    { label: 'Lines of Code', value: '1M+' },
    { label: 'Cloud Uptime', value: '100%' },
  ];

  const communicationPoints = [
    {
      title: '24/7 VIP SUPPORT',
      description: 'Instant access to our lead engineers via dedicated WhatsApp and Slack channels. We are never out of reach.',
      icon: '📱'
    },
    {
      title: 'REAL-TIME UPDATES',
      description: 'Daily sprint reports and live staging environments. Watch your vision come to life in real-time.',
      icon: '🔄'
    },
    {
      title: 'STRATEGIC PARTNERSHIP',
      description: 'We don\'t just take orders; we provide expert advisory to ensure your technology drives massive ROI.',
      icon: '🤝'
    }
  ];

  const coreValues = [
    {
      title: 'Strategic Communication',
      description: 'We bridge the gap between business goals and technical execution through transparent, real-time communication.',
      icon: '💬'
    },
    {
      title: 'Radical Transparency',
      description: 'Direct access to development progress, sprint reports, and clear performance metrics at every stage.',
      icon: '👁️'
    },
    {
      title: 'Global Standards',
      description: 'Rwanda-based talent delivering world-class code that adheres to international security and scalability benchmarks.',
      icon: '🌍'
    }
  ];

  return (
    <div className="bg-white text-black font-sans scroll-smooth">
      <Helmet>
        <title>Clever Digital Solutions | Rwanda's Premier Tech Partner</title>
        <meta name="description" content="Portfolio of Clever Digital Solutions - Rwanda's leading partner for high-performance e-commerce and full-stack engineering." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white py-20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="container relative z-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block px-6 py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-10 animate-fade-in">
              Strategic Digital Transformation
            </span>
            <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter">
              WE ENGINEER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-amber-600">GROWTH SYSTEMS</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-400 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
              Clever Digital Solutions is Rwanda's elite engineering partner. We don't just build websites; we architect the digital engines that drive revenue.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="#contact" className="px-12 py-5 bg-amber-500 text-black rounded-full font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl shadow-amber-500/20">
                Partner With Us
              </a>
              <a href="#work" className="px-12 py-5 border border-white/20 text-white rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
                The Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Floating communication badge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </section>

      {/* Communication & Values Section */}
      <section className="py-32 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center mb-32">
            <span className="text-amber-600 font-black uppercase tracking-[0.5em] text-xs mb-6">Unrivaled Communication</span>
            <h2 className="text-6xl md:text-9xl font-black uppercase mb-10 leading-[0.85] tracking-tighter">
              BIG DIALOGUE <br />
              <span className="text-amber-500">BIGGER RESULTS.</span>
            </h2>
            <div className="w-24 h-2 bg-black mt-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-32">
            {communicationPoints.map((point, index) => (
              <div key={index} className="bg-black text-white p-12 rounded-[3rem] relative overflow-hidden group hover:-translate-y-4 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
                <div className="text-5xl mb-8">{point.icon}</div>
                <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">{point.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg font-light">{point.description}</p>
                <div className="mt-10 flex items-center gap-3 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  <span>Learn More</span>
                  <div className="w-8 h-px bg-amber-500 group-hover:w-12 transition-all"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase mb-10 leading-none tracking-tighter">
                COMMUNICATION <br />
                <span className="text-amber-500">IS OUR CORE.</span>
              </h2>
              <p className="text-2xl text-gray-600 font-light leading-relaxed mb-8">
                Great software fails without great communication. At Clever Digital Solutions, we prioritize constant connectivity, ensuring you are part of every decision and milestone.
              </p>
              <div className="space-y-6">
                {['Dedicated WhatsApp Support Channels', 'Weekly Video Syncs & Demo Sessions', 'Real-time Project Management Access', 'Post-Launch Strategic Advisory'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs">✓</div>
                    <span className="font-bold uppercase tracking-widest text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:border-amber-500/30 transition-all group">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{value.icon}</div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-light">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-4xl mb-24">
            <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs mb-4 block">Our Capabilities</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter leading-none">HIGH-IMPACT <br /> SOLUTIONS</h2>
            <p className="text-2xl text-gray-600 font-light max-w-2xl">
              We leverage cutting-edge technology to build products that are fast, secure, and ready for global scale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight leading-tight">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-32 bg-black text-white">
        <div className="container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl md:text-8xl font-black text-amber-500 mb-4 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="py-32 bg-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs mb-4 block">The Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter leading-none">CRAFTED WITH <br /> PRECISION</h2>
              <p className="text-xl text-gray-500 font-light">
                A selection of digital powerhouses we've deployed for our partners across East Africa.
              </p>
            </div>
            <Link to="/" className="group flex items-center gap-4 text-black font-black uppercase tracking-widest hover:text-amber-600 transition-colors">
              <span>Back to Store</span>
              <div className="w-12 h-px bg-black group-hover:bg-amber-600 group-hover:w-16 transition-all"></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-8 bg-gray-100 shadow-xl">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="inline-block px-4 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                      {project.category}
                    </span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm font-medium line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contact" className="py-32 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto bg-black rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden text-center border-4 border-amber-500/20 shadow-2xl">
            <div className="relative z-10">
              <span className="text-amber-500 font-black uppercase tracking-[0.5em] text-xs mb-10 block">Global Reach • Local Talent</span>
              <h2 className="text-5xl md:text-8xl font-black mb-12 leading-[0.9] tracking-tighter">LET'S BUILD THE <br /> FUTURE TOGETHER</h2>
              <p className="text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
                Partner with Rwanda's most innovative engineering team. From Kigali to the world, we deliver excellence.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                <a 
                  href="mailto:princeshyakaclever@gmail.com" 
                  className="w-full md:w-auto px-16 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all transform hover:scale-105"
                >
                  Start Consultation
                </a>
                <div className="flex flex-col items-start text-left">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Direct Line</span>
                  <span className="text-2xl font-black tracking-tight">+250 780 000 000</span>
                </div>
              </div>
            </div>
            
            {/* Animated background element */}
            <div className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-gray-100">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-2xl rounded-xl">C</div>
                <span className="text-xl font-black tracking-tighter uppercase">Clever Digital Solutions</span>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Engineering Rwanda's Digital Future</p>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-amber-600 transition-colors">Store</Link>
              <a href="#work" className="hover:text-amber-600 transition-colors">Portfolio</a>
              <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
            </div>
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2026 CLEVER DIGITAL SOLUTIONS. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
