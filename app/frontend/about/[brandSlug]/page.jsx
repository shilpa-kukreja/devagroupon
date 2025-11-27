// pages/about/[brandSlug].jsx
"use client";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import BrandProduct from "../../components/BrandProduct";
import AboutBrand from "../../components/Aboutbrand";

export default function BrandAboutPage() {
  const params = useParams();
  const brandSlug = params.brandSlug;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Our Brand
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the story, passion, and quality behind our premium products
          </p>
        </div>
      </section>

      {/* About Brand Sections */}
      <AboutBrand brandSlug={brandSlug} sectionType="all" />
      <BrandProduct brandSlug={brandSlug} />
      
      <Footer />
    </div>
  );
}