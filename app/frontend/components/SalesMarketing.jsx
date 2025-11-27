// components/SalesMarketing.js

export default function SalesMarketing() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 to-teal-700 py-2 px-4 lg:py-5 mb-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-white space-y-2 lg:space-y-4">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="inline-block w-12 h-1 bg-amber-400 mb-2"></span>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  Sales & Marketing
                </h2>
              </div>
              <p className="text-xl leading-relaxed text-emerald-50 opacity-95">
                Over the years, we have built a strong customer base across Europe, 
                serving both ethnic and mainstream markets. Our multilingual sales team, 
                fluent in 22 languages, creates authentic connections by engaging customers 
                in their native tongue.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xl leading-relaxed text-emerald-50 opacity-95">
                Our in-house creative marketing team develops integrated campaigns across 
                digital and traditional channels. We ensure retail partners stay informed 
                about latest promotions while driving brand visibility through strategic 
                in-store activations and above-the-line campaigns.
              </p>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-amber-400">22+</div>
                <div className="text-emerald-100 text-sm font-medium">Languages</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-amber-400">EU</div>
                <div className="text-emerald-100 text-sm font-medium">Market Coverage</div>
              </div>
            </div> */}
          </div>
          
          {/* Image Container */}
          <div className="flex-shrink-0 w-full lg:w-2/5">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-300 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                <img
                  className="w-full h-96 lg:h-[480px] object-cover transform group-hover:scale-105 transition duration-700"
                  src="/about/aboutus.webp"
                  alt="Our multilingual sales and marketing team collaborating"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}