import Image from 'next/image'
import Link from 'next/link'

const JobVacancies = () => {
  return (
    <section className="bg-gradient-to-br from-white to-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about/JobVaccancies.webp"
                alt="Beagle Copperman Office Environment"
                className="w-full h-[400px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-full -z-10" />
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Career Opportunities
              </span>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Join Our <span className="text-green-600">Innovative</span> Team
              </h2>
              
              <div className="w-20 h-1 bg-green-500 rounded-full" />
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                As a market leader in authentic Asian food and beverages across Europe, 
                we're experiencing remarkable growth and expansion. Our entrepreneurial 
                culture thrives on innovation and excellence.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                We offer dynamic career paths for talented professionals seeking meaningful 
                development opportunities. Join us in shaping the future of Asian cuisine in Europe.
              </p>

              {/* Features List */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {[
                  'Professional Growth',
                  'Innovative Projects', 
                  'Competitive Benefits',
                  'International Team'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span>Explore Open Positions</span>
                <svg 
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JobVacancies