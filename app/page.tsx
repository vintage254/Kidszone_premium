import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProductMenu from "@/components/HomeProductMenu";
import { Banner } from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <Footer />
    </>
  );
};

export default Home;