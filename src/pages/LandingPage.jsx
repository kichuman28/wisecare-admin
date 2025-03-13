import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  const stats = [
    { number: "98%", label: "Patient Satisfaction" },
    { number: "24/7", label: "Emergency Support" },
    { number: "50k+", label: "Active Users" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary">WiseCare</Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-deep-blue hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-deep-blue hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-deep-blue hover:text-primary transition-colors">Contact</a>
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
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
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
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
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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

        <div className="container mx-auto px-4 z-10">
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
            <p className="text-xl md:text-2xl text-deep-blue mb-12 max-w-2xl mx-auto">
              Revolutionizing healthcare delivery with smart technology and compassionate care
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-deep-blue">{stat.label}</p>
                </motion.div>
              ))}
            </div>
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#ffffff_0%,_transparent_100%)]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join WiseCare today and experience the future of healthcare management
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
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