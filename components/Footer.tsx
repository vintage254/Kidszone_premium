import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ShoppingBag, Baby, Sparkles } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Baby Carriers', href: '/products?category=baby-carriers' },
    { name: 'Kids Toys', href: '/products?category=children-toys' },
    { name: 'Kids Furniture', href: '/products?category=kids-furniture' },
    { name: 'Baby Clothes', href: '/products?category=baby-clothes' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Quality Promise', href: '/about#quality' },
    { name: 'Reviews', href: '#testimonials' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '#shipping' },
    { name: 'Returns & Refunds', href: '#returns' },
    { name: 'Size Guide', href: '#sizing' },
    { name: 'FAQ', href: '/about#faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
  { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
  { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
];

const contactInfo = [
  { icon: <Mail className="h-4 w-4" />, text: 'info@kidszonenatick.com', href: 'mailto:info@kidszonenatick.com' },
  { icon: <Phone className="h-4 w-4" />, text: '(508) 655-4800', href: 'tel:+15086554800' },
  { icon: <MapPin className="h-4 w-4" />, text: '1245 Worcester St, Natick MA', href: 'https://www.google.com/maps?daddr=1245+Worcester+Street+Natick+MA+01760' },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-orange-50/30 via-white/20 to-orange-100/30 backdrop-blur-sm border-t border-white/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-orange-200">
          <Baby className="h-16 w-16" />
        </div>
        <div className="absolute top-20 right-20 text-orange-200">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-orange-200">
          <Heart className="h-14 w-14" />
        </div>
        <div className="absolute bottom-10 right-1/3 text-orange-200">
          <Sparkles className="h-10 w-10" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-300/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Stay Updated with <span className="text-orange-600">KidsZone</span> Premium
              </h3>
              <p className="text-gray-600 mb-6">Get the latest updates on new products, special offers, and parenting tips!</p>
              <div className="max-w-md mx-auto flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  KidsZone <span className="text-orange-600">Premium</span>
                </span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your trusted partner for quality baby and kids' products in Massachusetts since 2020. Located in Natick Mall, we specialize in safe, comfortable, and innovative baby gear for families worldwide.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.href} 
                    className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300 group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3 group-hover:bg-orange-200 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 text-orange-600 mr-2" />
                Shop
              </h3>
              <ul className="space-y-2">
                {footerLinks.shop.map(link => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-300 hover:pl-2 transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="h-5 w-5 text-orange-600 mr-2" />
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map(link => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-300 hover:pl-2 transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 mb-6">
                {footerLinks.support.map(link => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-300 hover:pl-2 transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-md font-medium text-gray-900 mb-2">Legal</h4>
              <ul className="space-y-1">
                {footerLinks.legal.map(link => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-gray-500 hover:text-orange-600 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gradient-to-r from-white/50 via-white/30 to-white/50 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left">
                <p className="text-sm text-gray-600">
                  &copy; {new Date().getFullYear()} KidsZone Premium. All rights reserved.
                </p>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span>🇺🇸 Located in USA</span>
                  <span>🌍 Worldwide Shipping</span>
                  <span>✅ 4+ Years Trusted</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Follow us:</span>
                {socialLinks.map((link, index) => (
                  <Link 
                    key={index} 
                    href={link.href} 
                    aria-label={link.label}
                    className="flex items-center justify-center w-10 h-10 bg-white/60 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Image */}
      <div className="absolute bottom-0 left-0 z-0">
        <Image 
          src="/images/blue-flowers.jpg" 
          alt="" 
          width={250} 
          height={160} 
          className="opacity-30 rounded-tr-3xl h-auto" 
        />
      </div>
    </footer>
  );
};

export default Footer;