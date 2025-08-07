"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Send,
  Heart,
  Sparkles,
  Star,
  ArrowRight,
  Clock,
  Zap,
  Gift,
  Users,
  Tag,
  Truck, 
  Package
} from 'lucide-react';

const Footer = () => {
  // Define colors from the palette - Updated to match site's brown/orange theme
  const colors = {
    charcoal: '#1A1A1A', // A bit lighter than pure black for depth
    white: '#FFFFFF',
    orange: '#EA580C', // bg-orange-600 equivalent
    tan: '#A67C52',
    lightGray: '#E5E5E5',
    coolGray: '#7D7D7D',
  };
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Customer Support",
      value: "+1 (555) KIDS-ZONE",
      href: "tel:15555437966"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Us",
      value: "support@kidszonepremium.com",
      href: "mailto:support@kidszonepremium.com"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Our Location",
      value: "456 Family Plaza, Kids City, KC 12345",
      href: "#"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Support Hours",
      value: "Mon-Sat: 8AM-8PM EST",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      href: "https://instagram.com/kidszonepremium",
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      href: "https://facebook.com/kidszonepremium",
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: "Twitter",
      href: "https://twitter.com/kidszonepremium",
    }
  ];

  const shopLinks = [
    { name: "Electronics", href: "/products?category=electronics" },
    { name: "Gaming Accessories", href: "/products?category=gaming" },
    { name: "Audio & Headphones", href: "/products?category=audio" },
    { name: "Computers & Laptops", href: "/products?category=computers" },
    { name: "Smart Devices", href: "/products?category=smart" },
    { name: "Special Offers", href: "/products?category=sale" }
  ];

  const quickLinks = [
    { name: "About KidsZone Premium", href: "/about" },
    { name: "All Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "My Account", href: "/account" }
  ];

  const features = [
    {
      icon: <Package style={{ color: colors.tan }} className="w-5 h-5" />,
      text: "Exclusive Drops"
    },
    {
      icon: <Truck style={{ color: colors.tan }} className="w-5 h-5" />,
      text: "Fast Shipping"
    },
    {
      icon: <Tag style={{ color: colors.tan }} className="w-5 h-5" />,
      text: "Member-Only Sales"
    },
    {
      icon: <Gift style={{ color: colors.tan }} className="w-5 h-5" />,
      text: "Special Offers"
    }
  ];

  return (
    <footer 
      id="contact"
      style={{ backgroundColor: colors.charcoal, color: colors.white }}
      className="relative overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url('/footer_bg.jpg')` }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div style={{ borderColor: colors.coolGray }} className="border-b border-opacity-20">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* VIP Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <Sparkles style={{ color: colors.tan }} className="w-7 h-7 mr-3" />
                  <h3 className="text-3xl md:text-4xl font-bold" style={{ color: colors.white }}>
                    Become a <span style={{ color: colors.tan }}>Style Insider</span>
                  </h3>
                </div>
                <p style={{ color: colors.lightGray }} className="text-xl mb-8 leading-relaxed">
                  Get exclusive access to new drops, special discounts, and be the first to know about our latest collaborations and events.
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: colors.lightGray }}
                      className="flex items-center text-sm backdrop-blur-sm rounded-xl p-3 border"
                    >
                      <div style={{ backgroundColor: 'rgba(166, 124, 82, 0.1)' }} className="p-2 rounded-lg mr-3">
                        {feature.icon}
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
                className="backdrop-blur-lg rounded-3xl p-10 border hover:border-tan-500/50 transition-all duration-300 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Gift style={{ color: colors.orange }} className="w-8 h-8 mr-2" />
                    <h4 className="text-2xl font-bold" style={{ color: colors.white }}>
                      Get 15% Off Your First Order
                    </h4>
                  </div>
                  <p style={{ color: colors.coolGray }}>Subscribe and save on your first purchase</p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for exclusive offers"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        borderColor: 'rgba(255, 255, 255, 0.2)', 
                        color: colors.white 
                      }}
                      className="w-full px-6 py-5 backdrop-blur-sm border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-[#A67C52] transition-all duration-300"
                      required
                    />
                    <Mail style={{ color: colors.coolGray }} className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ backgroundColor: colors.orange, color: colors.white }}
                    className="w-full py-5 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-opacity-90"
                  >
                    {isSubscribed ? (
                      <>
                        <Heart className="w-6 h-6" />
                        <span>Welcome, Insider!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Claim My Discount</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </form>
                
                <p style={{ color: colors.coolGray }} className="text-xs mt-6 text-center">
                  Instant 15% off • Early access to new drops • Insider-only promotions
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold" style={{ color: colors.white }}>
                  KidsZone <span style={{ color: colors.orange }}>Premium</span>
                </h2>
              </div>
              <p style={{ color: colors.lightGray }} className="mb-8 text-lg leading-relaxed">
                Your premium destination for electronics, gaming gear, and tech accessories. We bring you the latest gadgets and devices for kids and families.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -5 }}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    className={`p-4 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:text-white hover:bg-tan-500/20`}
                  >
                    {social.icon} 
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-8 flex items-center" style={{ color: colors.white }}>
                <Tag style={{ color: colors.tan }} className="w-6 h-6 mr-3" />
                Shop
              </h3>
              <ul className="space-y-4">
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      style={{ color: colors.lightGray }}
                      className="hover-text-tan transition-colors duration-300 flex items-center group"
                    >
                      <div style={{ backgroundColor: colors.tan }} className="w-2 h-2 rounded-full mr-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-8 flex items-center" style={{ color: colors.white }}>
                <ArrowRight style={{ color: colors.tan }} className="w-6 h-6 mr-3" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      style={{ color: colors.lightGray }}
                      className="hover-text-tan transition-colors duration-300 flex items-center group"
                    >
                      <div style={{ backgroundColor: colors.tan }} className="w-2 h-2 rounded-full mr-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                className="backdrop-blur-sm border rounded-2xl p-6 hover:border-tan-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div style={{ backgroundColor: 'rgba(166, 124, 82, 0.1)' }} className="p-3 rounded-xl transition-all duration-300">
                    {React.cloneElement(info.icon, { style: { color: colors.tan } })}
                  </div>
                  <div>
                    <p style={{ color: colors.coolGray }} className="text-sm mb-1">{info.label}</p>
                    <p style={{ color: colors.white }} className="font-medium">{info.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderColor: colors.coolGray }} className="border-t border-opacity-20 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p style={{ color: colors.coolGray }} className="text-sm">
                {new Date().getFullYear()} The Street Clothing. All Rights Reserved.
              </p>
              <div style={{ color: colors.coolGray }} className="flex items-center space-x-8 text-sm">
                <a href="/privacy" className="hover-text-tan transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover-text-tan transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/shipping" className="hover-text-tan transition-colors duration-300">
                  Shipping Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;