"use client";
import React  from 'react'
import Navbar from './frontend/components/Navbar';
import Banner from './frontend/components/Banner';
import PhotoCardSection from './frontend/components/PhotoCardSection';
import CategoryCarousel from './frontend/components/CategoryCarousel';
import PopularPagesCarousel from './frontend/components/PopularPagesCarousel';
import AboutUs from './frontend/components/AboutUs';
import BlogSection from './frontend/components/BlogSection';

import Banner1 from './frontend/components/Banner1';
import BrandsSection from './frontend/components/BrandsSection';
import JobVacancies from './frontend/components/JobVacancies';
import Footer from './frontend/components/Footer';





const Home = () => {
 
   
  return (
    <>
      <Navbar/>
      <Banner />
      <PhotoCardSection />
      <CategoryCarousel />
      <PopularPagesCarousel/>
      <AboutUs/>
      <BlogSection/>
      <Banner1/>
      <BrandsSection/>
      <JobVacancies/>
      <Footer/>
      
    </>
  )
}

export default Home
