import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import images for feature cards
import sosScreenImg from '../../screenshots/admin/sos screen.png';
import consultationsImg from '../../screenshots/doctor/consultations.png';
import deliveryImg from '../../screenshots/admin/delivery.png';

const LandingPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply CSS to hide scrollbars
  useEffect(() => {
    // Store original overflow style
    const originalStyle = document.body.style.overflow;
    
    // Add custom style to hide scrollbar but keep functionality
    document.body.style.overflow = 'auto';
    document.body.style.scrollbarWidth = 'none'; // Firefox
    document.documentElement.style.scrollbarWidth = 'none'; // Firefox
    
    // For WebKit browsers (Chrome, Safari)
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
        display: none;
      }
      
      /* Add premium decoration */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          radial-gradient(circle at 15% 85%, rgba(42, 51, 107, 0.03) 0%, transparent 25%),
          radial-gradient(circle at 85% 15%, rgba(0, 128, 128, 0.03) 0%, transparent 25%);
        pointer-events: none;
        z-index: -1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Restore original style
      document.body.style.overflow = originalStyle;
      document.body.style.scrollbarWidth = '';
      document.documentElement.style.scrollbarWidth = '';
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const features = [
    {
      title: "Smart SOS Alerts",
      description: "Real-time emergency response system for seniors living independently, with instant notifications to caregivers and family",
      icon: "🚨",
      image: sosScreenImg,
      color: "from-red-500/20 to-orange-500/20",
      bgColor: "bg-beige/20"
    },
    {
      title: "Video Consultations",
      description: "User-friendly virtual healthcare meetings for elderly patients who struggle with mobility or transportation",
      icon: "🎥",
      image: consultationsImg,
      color: "from-blue-500/20 to-purple-500/20",
      bgColor: "bg-primary-light/20"
    },
    {
      title: "Medication Delivery",
      description: "Simplified medication management with scheduled deliveries to ensure seniors never miss important prescriptions",
      icon: "💊",
      image: deliveryImg,
      color: "from-green-500/20 to-teal-500/20",
      bgColor: "bg-pastel-green/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-pastel-green/5"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-beige/10 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-primary-light/10 mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Fixed Floating Navbar with Glassmorphism */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4">
        <motion.nav 
          className={`mx-auto py-3 px-8 rounded-full backdrop-blur-xl border border-white/20 ${scrolled ? 'bg-white/70 shadow-xl' : 'bg-white/40'} transition-all duration-300 max-w-6xl`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-2xl font-bold text-primary">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                Wise
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="inline-block text-teal-600"
              >
                Care
              </motion.span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-deep-blue hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-deep-blue hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-deep-blue hover:text-primary transition-colors">Contact</a>
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                Access Dashboard
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-deep-blue"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white/20"
              >
                <div className="py-4 px-4 space-y-4">
                  <a href="#features" className="block text-deep-blue hover:text-primary transition-colors">Features</a>
                  <a href="#about" className="block text-deep-blue hover:text-primary transition-colors">About</a>
                  <a href="#contact" className="block text-deep-blue hover:text-primary transition-colors">Contact</a>
                  <Link
                    to="/login"
                    className="block bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full text-center text-sm font-semibold transition-all duration-300"
                  >
                    Access Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Hero Section with Enhanced Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-beige/5 to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTI1MjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply opacity-60"
              style={{
                background: `radial-gradient(circle, ${
                  i % 3 === 0 ? '#2D336B' : 
                  i % 3 === 1 ? '#008080' : 
                  '#A7D7C5'
                }15, transparent 60%)`,
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-10 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
                Eldercare Reimagined <br />
                <span className="text-teal-600">for the Digital Age</span>
              </h1>
            </motion.div>
            <motion.p 
              className="text-xl md:text-2xl text-deep-blue mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Empowering senior citizens with smart technology and compassionate care for a safer, more connected life
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-primary to-teal-600 hover:from-primary-hover hover:to-teal-600/90 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scrolling indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 12, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg className="w-6 h-10 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section - Enhanced Interactive Showcase */}
      <section id="features" className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyRDMzNkIiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Comprehensive Eldercare Solutions
            </h2>
            <p className="text-xl text-deep-blue max-w-3xl mx-auto">
              Bridging the gap between seniors and modern healthcare with intuitive technology designed for older adults
            </p>
          </motion.div>

          {/* Interactive Feature Cards */}
          <div className="space-y-24 relative">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`absolute inset-0 ${feature.bgColor} backdrop-blur-sm rounded-3xl transform -skew-y-3 shadow-xl`} />
                <div className="relative grid md:grid-cols-2 gap-8 items-center p-8">
                  <div className={`text-center md:text-left ${index % 2 ? "md:order-2" : ""}`}>
                    <motion.div 
                      className="text-6xl mb-6 hidden"
                      whileInView={{ 
                        scale: [0.8, 1.2, 1],
                        rotate: [0, -10, 0],
                        opacity: [0, 1]
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                        times: [0, 0.5, 1]
                      }}
                      viewport={{ once: true }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                    <p className="text-deep-blue text-lg">{feature.description}</p>
                  </div>
                  <div className={`${index % 2 ? "md:order-1" : ""}`}>
                    <motion.div 
                      className="aspect-video bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/60"
                      whileInView={{ 
                        opacity: [0, 1],
                        y: [50, 0]
                      }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-pastel-green/10 to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDgwODAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/60">
                  <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
                  <p className="text-deep-blue mb-6">
                    WiseCare is dedicated to addressing the unique challenges faced by elderly individuals and 
                    their families through innovative technology solutions that combat social isolation, improve 
                    healthcare access, and enhance safety.
                  </p>
                  <p className="text-deep-blue">
                    Our platform bridges the distance between seniors and their families, providing peace of mind 
                    to loved ones while ensuring the elderly maintain their independence, dignity, and quality of life.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-teal-600/20 rounded-3xl transform rotate-3 opacity-70 blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/60">
                  <h2 className="text-3xl font-bold text-teal-600 mb-6">Why Choose WiseCare?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 mr-3">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <p className="text-deep-blue">Emergency SOS system with instant family notification</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 mr-3">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <p className="text-deep-blue">Simple, age-friendly interface designed for seniors</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 mr-3">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <p className="text-deep-blue">Medication delivery and management for those with limited mobility</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 mr-3">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <p className="text-deep-blue">Family monitoring dashboard to stay connected with elderly loved ones</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-deep-blue/90 z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 z-0"></div>
        
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute h-56 w-56 rounded-full bg-white/10 blur-3xl top-1/4 left-1/4 mix-blend-overlay"></div>
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl bottom-1/3 right-1/3 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 rounded-3xl p-10 shadow-2xl border border-white/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Support Your Elderly Loved Ones?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Join WiseCare today and provide the caring connection that helps seniors live independently with dignity
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className="inline-block bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href="#features"
                    className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10"
                  >
                    Learn More
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-blue text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-light/20 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-600/20 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">Wise</span>
                <span className="text-teal-600">Care</span>
              </h3>
              <p className="text-primary-light">Improving elderly lives through technology</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-primary-light transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-primary-light transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-primary-light transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary-light transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-primary-light">© 2024 WiseCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 