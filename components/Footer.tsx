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
      icon: <Package className="w-5 h-5 text-white" />,
      text: "Exclusive Drops"
    },
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      text: "Fast Shipping"
    },
    {
      icon: <Tag className="w-5 h-5 text-white" />,
      text: "Member-Only Sales"
    },
    {
      icon: <Gift className="w-5 h-5 text-white" />,
      text: "Special Offers"
    }
  ];

  return (
    <footer 
      id="contact"
      className="bg-gray-900 text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url('/footer_bg.jpg')` }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700 border-opacity-20">
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
                  <Sparkles className="w-7 h-7 mr-3 text-secondary" />
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    Become a <span className="text-secondary">Style Insider</span>
                  </h3>
                </div>
                <p className="text-xl mb-8 leading-relaxed text-gray-400">
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
                      className="flex items-center text-sm bg-gray-800 rounded-xl p-3 border border-gray-700"
                    >
                      <div className="p-2 rounded-lg mr-3 bg-secondary">
                        {feature.icon}
                      </div>
                      <span className="font-medium text-gray-400">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="backdrop-blur-lg rounded-3xl p-10 border border-gray-700 hover:border-orange-400/50 transition-all duration-300 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Gift className="w-8 h-8 mr-2 text-primary" />
                    <h4 className="text-2xl font-bold text-white">
                      Get 15% Off Your First Order
                    </h4>
                  </div>
                  <p className="text-gray-500">Subscribe and save on your first purchase</p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for exclusive offers"
                      className="w-full px-6 py-5 bg-gray-800 border border-gray-700 rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      required
                    />
                    <Mail className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 rounded-2xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl bg-primary hover:bg-opacity-90 text-white"
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
                
                <p className="text-xs mt-6 text-center text-gray-500">
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
                <h2 className="text-3xl font-bold text-white">
                  KidsZone <span className="text-primary">Premium</span>
                </h2>
              </div>
              <p className="mb-8 text-lg leading-relaxed text-gray-400">
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
                    className={`p-4 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:text-white hover:bg-primary/20`}
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
              <h3 className="text-xl font-semibold mb-8 flex items-center">
                <Tag className="w-6 h-6 mr-3 text-secondary" />
                Shop
              </h3>
              <ul className="space-y-4">
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-2 h-2 rounded-full mr-3 bg-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <h3 className="text-xl font-semibold mb-8 flex items-center">
                <ArrowRight className="w-6 h-6 mr-3 text-secondary" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-2 h-2 rounded-full mr-3 bg-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                className="backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-primary">
                    {React.cloneElement(info.icon, { className: "text-white" })}
                  </div>
                  <div>
                    <p className="text-sm mb-1 text-gray-500">{info.label}</p>
                    <p className="font-medium text-white">{info.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 border-opacity-20 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} KidsZone Premium. All Rights Reserved. Crafted with <Heart className="inline w-4 h-4 text-primary" /> for the next generation.
              </p>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <a href="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/shipping" className="hover:text-primary transition-colors duration-300">
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