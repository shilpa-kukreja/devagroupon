"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Quote from "../components/Quote";
import SalesMarketing from "../components/SalesMarketing";
import SourcingPurchase from "../components/SourcingPurchase";
import Distribution from "../components/Distribution";
import VisionMission from "../components/Visionmission";

const AboutUsSection = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Banner Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <Image
          src="/banner/banner1.webp"
          alt="About Banner"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            About Beagley Copperman
          </h1>
          <p className="max-w-2xl text-lg md:text-xl opacity-90">
            Bringing Asia’s authentic flavors to Europe since 2008
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Video Thumbnail */}
          <div className="relative w-full md:w-1/2 group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ease-in-out transform group-hover:scale-[1.03] group-hover:shadow-3xl">
              <Image
                src="/about/vidoe_2.webp"
                alt="Company Video Thumbnail"
                width={800}
                height={500}
                className="object-cover w-full h-full rounded-3xl"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-3xl"></div>

              {/* Play Button */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
                <button className="flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-20 h-20 transition duration-300 hover:scale-105">
                  <Play size={38} strokeWidth={2.5} className="text-white" />
                </button>
                <p className="mt-4 text-lg font-medium italic tracking-wide">
                  Click to see our company video
                </p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              About Us
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Beagley Copperman</strong> was founded in 2008 and has
              rapidly established itself as one of Europe’s leading importers of
              authentic and on-trend Asian food and non-food products.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg">
              From day one, our founders pursued their passion for making
              authentic Asian cuisine accessible to everyone. In just 16 years,
              we’ve grown to distribute over{" "}
              <strong>3,500 unique products</strong> across{" "}
              <strong>38+ countries</strong>.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg">
              Our customers include supermarkets, candy shops, food service
              providers, and wholesalers. Through close collaboration with
              premium brand partners, we ensure every product meets European
              quality standards and regulations.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg">
              By combining deep market knowledge with our trusted suppliers, we
              guarantee that each product delivers an{" "}
              <strong>authentic and unforgettable taste experience.</strong>
            </p>
          </div>
        </div>
      </section>
        <Quote />
        <SalesMarketing />
        <SourcingPurchase />
        <Distribution />
        <VisionMission />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsSection;
