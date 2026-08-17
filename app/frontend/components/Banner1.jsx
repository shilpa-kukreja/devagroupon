import React from 'react'
import Image from 'next/image'

const Banner1 = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/banner/banner2.jpg"
          alt="Premium Asian Food Collection - Beagley Copperman"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30"></div>
        {/* Additional subtle overlay */}
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Premium Selection
          </div> */}

          {/* Main Heading */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Asian Taste, 
            <span className="block text-green-300">Perfectly Curated</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
            Experience a refined selection of Asian food products, from everyday essentials to specialty delights, thoughtfully sourced and adapted for modern European markets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group/btn inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <span>Shop Now</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button className="group/btn2 inline-flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <span>Explore Collection</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn2:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-6 mt-12 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Curated Brand Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Reliable EU Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Quality and Compliance Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  )
}

export default Banner1