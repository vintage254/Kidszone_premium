import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Draggable3DImageRing from '@/components/3daboutring';

const AboutPage = () => {
  const aboutImages = [
    '/images/c1.jpg',
    '/images/c2.jpg', 
    '/images/c3.jpg',
    '/images/c4.jpg',
    '/images/c5.jpg',
    '/images/c6.jpg'
  ];

  const faqData = [
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship worldwide with tracking numbers provided for all orders. Enjoy seamless checkout with card/PayPal payments."
    },
    {
      question: "What age range are your products suitable for?",
      answer: "Our products cater to babies and kids from newborn to 12+ years. Each product page includes specific age recommendations."
    },
    {
      question: "How can I track my order?",
      answer: "After your order is processed, you'll receive a tracking number via email to monitor your package every step of the way."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We stand behind our products! Contact our customer service team and we'll work to make things right."
    },
    {
      question: "Are your products safe for children?",
      answer: "Absolutely! Every product is handpicked for durability, safety, and fun. We prioritize child safety in all our selections."
    },
    {
      question: "How long have you been in business?",
      answer: "KidsZone Premium has been serving families since 2020, with 4 years of experience delivering smiles worldwide."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section with 3D Ring */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    About <span className="text-orange-600">KidsZone</span> Premium
                  </h1>
                  <div className="w-24 h-1 bg-orange-600 rounded-full mb-6"></div>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Your trusted partner for quality baby and kids' products in Massachusetts since 2020!
                  </p>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>
                    Located in the heart of Natick Mall, KidsZone specializes in safe, comfortable, and innovative baby gear, from premium carriers to interactive toys, designed to make parenting easier and more joyful.
                  </p>
                  <p>
                    With 4 years of experience, we've delivered smiles to families across the USA and worldwide, offering both convenient mall pickup and international shipping.
                  </p>
                </div>
              </div>
              
              {/* 3D Image Ring */}
              <div className="h-[500px] flex items-center justify-center">
                <Draggable3DImageRing
                  images={aboutImages}
                  width={400}
                  perspective={2000}
                  imageDistance={300}
                  initialRotation={0}
                  animationDuration={2}
                  staggerDelay={0.15}
                  backgroundColor="transparent"
                  containerClassName="w-full h-full"
                  draggable={true}
                  mobileScaleFactor={0.8}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Us?
              </h2>
              <div className="w-24 h-1 bg-orange-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Delivery</h3>
                <p className="text-gray-600">
                  We ship internationally! Enjoy seamless checkout with card/PayPal payments, and receive a tracking number to monitor your order every step of the way.
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
                <p className="text-gray-600">
                  Every product is handpicked for durability, safety, and fun. We stand behind every item we sell.
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Parent-Approved</h3>
                <p className="text-gray-600">
                  Trusted by thousands of families for reliable products and timely deliveries worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-orange-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              KidsZone Premium isn't just a shop—it's a commitment to helping you cherish every moment with your little ones.
            </p>
            <p className="text-2xl font-bold text-orange-600">
              Let's grow together! 🌱
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-orange-600 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <summary className="flex justify-between items-center p-6 cursor-pointer text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors duration-200">
                    {faq.question}
                    <svg 
                      className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;