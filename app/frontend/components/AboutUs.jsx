import Image from 'next/image'
import Link from 'next/link'

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-8 lg:py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-green-50 rounded-full -translate-y-36 translate-x-36 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left side: Text Content */}
          <div className="lg:w-1/2 text-left space-y-2">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ABOUT OUR COMPANY
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Beagley <span className="text-green-600">Copperman</span>
            </h2>

            {/* Subheading */}
            <h3 className="text-2xl font-semibold text-gray-700 border-l-4 border-green-500 pl-4 py-1">
              Pioneering Asian Food Distribution in Europe
            </h3>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-xl text-gray-600 leading-relaxed">
                We serve clients across multiple sectors within the food industry, including mainstream retailers, Asian grocery stores, candy stores, food service providers, and wholesalers.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                By collaborating with these partners and our top-brand suppliers, we introduce the unique products of Asia to consumers, all while ensuring that our offerings comply with European laws and regulations.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/about" 
                className="group inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <span>Learn More About Us</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              {/* Secondary CTA */}
              <Link 
                href="/contact" 
                className="group inline-flex items-center gap-3 border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
              >
                <span>Get In Touch</span>
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50+</div>
                <div className="text-gray-600">Brand Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1000+</div>
                <div className="text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div> */}
          </div>

          {/* Right side: Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
            {/* Image Container with decorative elements */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full max-w-lg">
                <img
                  src="/home/about-us.png"
                  alt="Beagley Copperman Flags"
                
                  className="rounded-2xl w-[500px] h-[500px] shadow-2xl object-cover"
                  
                />
                
                {/* Floating Badge */}
                 <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Since 2008</div>
                    <div className="text-gray-600 text-sm">Trusted Partner</div>
                  </div>
                </div>
              </div>

          
              <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl"></div>
            </div> 
          </div> 
        </div>
      </div>
    </section>
  )
}

export default AboutUs