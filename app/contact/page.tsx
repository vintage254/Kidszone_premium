"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    type: '', // 'success', 'error', 'loading'
    message: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      // Simulate API call for now
      // In a real implementation, you'd call your email service here
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'info@kidszonenatick.com' // Your business email
        })
      });

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours!' 
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Oops! Something went wrong. Please try again later or call us directly.' 
      });
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Need help choosing the perfect products for your little one? Have questions about shipping or our products? 
            We're here to help make parenting easier!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">Send us a message anytime</p>
            <p className="text-blue-600 font-medium">info@kidszonenatick.com</p>
            <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Speak to our team</p>
            <p className="text-green-600 font-medium">(508) 655-4800</p>
            <p className="text-sm text-gray-500 mt-1">Mon-Sat, 10AM-9PM EST</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-3">Located in Natick Mall</p>
            <p className="text-red-600 font-medium">1245 Worcester Street, Natick MA 01760</p>
            <p className="text-sm text-gray-500 mt-1">Serving USA & Worldwide</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            {/* Status Message */}
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : status.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
                role="status"
                aria-live="polite"
              >
                {status.type === 'success' && <CheckCircle className="h-5 w-5" />}
                {status.type === 'error' && <AlertCircle className="h-5 w-5" />}
                {status.type === 'loading' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(508) 555-0123"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  How can we help? *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Please select...</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="order-status">Order Status</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="bulk-orders">Bulk Orders</option>
                  <option value="international-shipping">International Shipping</option>
                  <option value="product-recommendation">Product Recommendation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us more about how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {status.type === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Business Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About KidsZone</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your trusted partner for quality baby and kids' products in Massachusetts since 2020! 
                  Located in the heart of Natick Mall, KidsZone specializes in safe, comfortable, and innovative baby gear, 
                  from premium carriers to interactive toys.
                </p>
                <p>
                  With 4 years of experience, we've delivered smiles to families across the USA and worldwide. 
                  We offer convenient mall pickup and ship internationally with tracking numbers, guaranteeing quality in every product.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">4+ Years Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Worldwide Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-red-600" />
                    <span className="text-sm">Tracking Provided</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Questions?</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Shipping:</span> We ship worldwide with tracking numbers provided for all orders.
                </div>
                <div>
                  <span className="font-medium">Returns:</span> 30-day return policy on all products (terms apply).
                </div>
                <div>
                  <span className="font-medium">Bulk Orders:</span> Special discounts available for bulk purchases - contact us for quotes.
                </div>
                <div>
                  <span className="font-medium">Product Safety:</span> All products meet international safety standards for babies and children.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
}