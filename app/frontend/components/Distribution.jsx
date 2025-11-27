// components/Distribution.js

export default function Distribution() {
  return (
    <section className=" py-10 bg-gray-600 px-6 lg:py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-black space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="inline-block w-16 h-1 bg-cyan-400 mb-3"></span>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  DISTRIBUTION
                </h1>
              </div>
              
              <p className="text-xl lg:text-2xl leading-relaxed text-blue-100 opacity-95 font-light">
                Our advanced distribution network allows us to deliver goods to nearly every corner of Europe. 
                We operate eight strategically located warehouses and collaborate with 72 transport companies 
                to ensure seamless logistics.
              </p>
              
              <p className="text-xl lg:text-2xl leading-relaxed text-blue-100 opacity-95 font-light">
                From these warehouses, we offer quick and efficient delivery directly to your stores 
                or distribution centers.
              </p>
            </div>

            {/* Stats Grid */}
            {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">8</div>
                <div className="text-blue-100 text-lg font-semibold">Strategic Warehouses</div>
                <div className="text-cyan-300 text-sm mt-2">Europe-wide coverage</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">72</div>
                <div className="text-blue-100 text-lg font-semibold">Transport Partners</div>
                <div className="text-cyan-300 text-sm mt-2">Reliable logistics</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group col-span-2 lg:col-span-1">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">EU</div>
                <div className="text-blue-100 text-lg font-semibold">Market Coverage</div>
                <div className="text-cyan-300 text-sm mt-2">Pan-European reach</div>
              </div>
            </div> */}

          
            
          </div>
          
          {/* Visual Content */}
          <div className="flex-shrink-0 w-full lg:w-2/5">
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              
              {/* Main card */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                {/* Map visualization */}
                <div className="relative h-80 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden border border-cyan-500/30">
                  {/* Simplified Europe map dots */}
                  <div className="absolute inset-0 opacity-30">
                    {/* Warehouse locations */}
                    {[
                      { top: '20%', left: '15%' }, // UK
                      { top: '30%', left: '50%' }, // Germany
                      { top: '45%', left: '55%' }, // Italy
                      { top: '25%', left: '65%' }, // Poland
                      { top: '60%', left: '45%' }, // Spain
                      { top: '35%', left: '30%' }, // France
                      { top: '50%', left: '75%' }, // Romania
                      { top: '15%', left: '80%' }, // Finland
                    ].map((pos, index) => (
                      <div
                        key={index}
                        className="absolute w-3 h-3 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                          top: pos.top,
                          left: pos.left,
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping"></div>
                      </div>
                    ))}
                    
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                      {[...Array(12)].map((_, i) => (
                        <line
                          key={i}
                          x1={`${15 + Math.random() * 70}%`}
                          y1={`${15 + Math.random() * 70}%`}
                          x2={`${15 + Math.random() * 70}%`}
                          y2={`${15 + Math.random() * 70}%`}
                          stroke="url(#gradient)"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      ))}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Overlay text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="text-cyan-400 text-2xl font-bold mb-2">European Network</div>
                      <div className="text-white text-lg">Complete Coverage</div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center mt-6 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-300 text-sm">Warehouse</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                    <span className="text-cyan-300 text-sm">Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}