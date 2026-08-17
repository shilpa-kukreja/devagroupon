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
      <div className="relative w-full mt-20 h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/home/aboutus.png"
          alt="About Banner"
          fill
          className="object-cover brightness-75 "
        />
        {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            ABOUT DEVA GRUPPEN
          </h1>
          <p className="max-w-2xl text-lg md:text-xl opacity-90">
            Curating Asia’s Finest Flavours for a Global Palate
          </p>
        </div> */}
      </div>

      {/* About Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Video Thumbnail */}
          <div className="relative w-full md:w-1/2 group">
            <div className="relative overflow-hidden rounded-md shadow-2xl transition-all duration-700 ease-in-out transform group-hover:scale-[1.03] group-hover:shadow-3xl">
              <Image
                src="/home/img1.png"
                alt="Company Video Thumbnail"
                width={800}
                height={500}
                className="object-cover w-full h-full rounded-3xl"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-3xl"></div>

              {/* Play Button */}
              {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
                <button className="flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-20 h-20 transition duration-300 hover:scale-105">
                  <Play size={38} strokeWidth={2.5} className="text-white" />
                </button>
                <p className="mt-4 text-lg font-medium italic tracking-wide">
                  Click to see our company video
                </p>
              </div> */}
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              About Us
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>At Deva Gruppen,</strong>  food is not merely sourced, distributed, or sold.
              It is curated, protected, and elevated.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg text-align-justify">
              We operate at the intersection of tradition and modern global demand, bringing the finest expressions of Asian food culture to Europe’s most discerning markets. From mainstream retailers and Asian grocery chains to candy specialists, food service providers, and wholesale partners, Deva Gruppen serves as a trusted bridge between Asia’s culinary heritage and today’s premium consumer.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg text-align-justify">
              Every product in our portfolio is selected with intention. Authenticity is non negotiable. Quality is uncompromising. Compliance is absolute.
              Our role is to ensure that exceptional Asian products reach European shelves while fully aligning with regional regulations, quality benchmarks, and evolving consumer expectations.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg text-align-justify">
              What defines Deva Gruppen is not volume alone. It is judgement, taste, and responsibility. We work closely with respected brand partners and suppliers across Asia, safeguarding the integrity of each product while adapting it seamlessly for modern retail environments. The result is a collection that feels rare, relevant, and refined.
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
