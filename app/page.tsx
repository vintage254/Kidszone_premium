import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProductMenu from "@/components/HomeProductMenu";
import { Banner } from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/Chatbox";
import WhatsApp from "@/components/WhatsApp";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactivebutton";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProductMenu />
        <FeaturedProduct />
        <Banner />
      </div>
      
      {/* Glassy About Section */}
      <section className="relative py-20 mx-6 md:mx-16 lg:mx-32 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-lg border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-orange-400/3 to-transparent"></div>
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  About <span className="text-orange-600">KidsZone</span> Premium
                </h2>
                <div className="w-24 h-1 bg-orange-600 rounded-full mx-auto mb-6"></div>
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                Your trusted partner for quality baby and kids' products in Kenya since 2020! At KidsZone, we specialize in safe, comfortable, and innovative baby gear, from premium carriers to interactive toys.
              </p>
              
              <p className="text-base md:text-lg text-gray-600 mb-8">
                With 4 years of experience, we've delivered smiles to families not just in Kenya, but worldwide. We ship internationally with tracking numbers and guarantee quality in every product.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/about">
                  <InteractiveHoverButton className="bg-orange-600 text-white hover:bg-orange-700">
                    Learn More About Us
                  </InteractiveHoverButton>
                </Link>
                <Link href="/products">
                  <InteractiveHoverButton className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50">
                    Shop Our Products
                  </InteractiveHoverButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ChatBox />
      <WhatsApp />
      <Footer />
    </>
  );
};

export default Home;