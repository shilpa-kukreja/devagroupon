"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="relative w-full h-[700px] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Homebanner.webp"
          alt="Tokyo Design Studio Background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 sm:pl-12 sm:pr-6  h-full max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="max-w-2xl text-center lg:text-left mt-20">
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white italic leading-tight drop-shadow-2xl"
            style={{
              textShadow:
                "2px 4px 8px rgba(0,0,0,0.4), 0px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Check it out!
          </h1>

          {/* <div className="space-y-2 mt-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black drop-shadow-2xl">
              TOKYO
            </h2>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black drop-shadow-2xl">
              DESIGN STUDIO
            </h2>
          </div> */}

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mt-8">
            <button className="group relative inline-flex items-center gap-3 bg-green-400 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10">Read more</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Right Section — Image + Video */}
        <div className="relative w-full lg:w-auto mt-auto flex justify-center lg:justify-end items-end gap-6 lg:gap-10 pb-10 lg:pb-20">
          {/* Product Image */}
          <div className="relative group transition-all duration-500 hover:scale-105">
            <img
              src="/banner1.webp"
              alt="Tokyo Design Studio"
              
              className="rounded-xl w-[200px] h-[220px] shadow-2xl object-cover"
            />
          </div>

          {/* Product Video (same size) */}
          <div className="relative group transition-all duration-500 hover:scale-105">
            <video
              src="/video1.mp4" // 🔁 Replace with your video file (public/sample.mp4)
              muted
              loop
              autoPlay
              playsInline
              className="rounded-xl w-[200px] h-[220px]  shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
    </section>
  );
};

export default Banner;
