import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
      description: "Real-time emergency notifications with instant response system",
      icon: "🚨",
      color: "from-red-500/20 to-orange-500/20"
    },
    {
      title: "Video Consultations",
      description: "Seamless virtual healthcare consultations with advanced video analysis",
      icon: "🎥",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Medication Delivery",
      description: "Efficient medication management and delivery tracking system",
      icon: "💊",
      color: "from-green-500/20 to-teal-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Fixed Floating Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4">
        <motion.nav 
          className={`mx-auto py-3 px-8 rounded-full ${scrolled ? 'bg-white shadow-xl' : 'bg-white shadow-lg'} transition-all duration-300 max-w-6xl`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-2xl font-bold text-primary">WiseCare</Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-deep-blue hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-deep-blue hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-deep-blue hover:text-primary transition-colors">Contact</a>
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-md"
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
                className="md:hidden mt-4 rounded-2xl bg-white shadow-lg"
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal-600/5" />
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply opacity-70"
              style={{
                background: `radial-gradient(circle, ${i % 2 ? '#2D336B' : '#008080'}15, transparent 60%)`,
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
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
              Healthcare Reimagined <br />
              <span className="text-teal-600">for the Digital Age</span>
            </h1>
            <motion.p 
              className="text-xl md:text-2xl text-deep-blue mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Revolutionizing healthcare delivery with smart technology and compassionate care
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-primary to-teal-600 hover:from-primary-hover hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Interactive Showcase */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-deep-blue max-w-3xl mx-auto">
              Empowering healthcare providers with cutting-edge tools and seamless patient care
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
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl transform -skew-y-3`} />
                <div className="relative grid md:grid-cols-2 gap-8 items-center p-8">
                  <div className={`text-center md:text-left ${index % 2 ? "md:order-2" : ""}`}>
                    <div className="text-6xl mb-6">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                    <p className="text-deep-blue text-lg">{feature.description}</p>
                  </div>
                  <div className={`${index % 2 ? "md:order-1" : ""}`}>
                    {/* Replace with actual feature image/illustration */}
                    <div className="aspect-video bg-white rounded-xl shadow-xl overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-teal-600/10 flex items-center justify-center">
                        <span className="text-8xl">{feature.icon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned CTA Section - Clean Design */}
      <section id="contact" className="py-20 relative overflow-hidden bg-primary-light/10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-6 text-primary">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-xl mb-8 text-deep-blue max-w-2xl mx-auto">
                Join WiseCare today and experience the future of healthcare management
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Link
                  to="/login"
                  className="inline-block bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-block bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-primary/5"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">WiseCare</h3>
              <p className="text-primary-light">Transforming healthcare through innovation</p>
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