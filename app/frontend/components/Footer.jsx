import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaYoutube, FaChevronUp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'
import { useState } from 'react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [openSections, setOpenSections] = useState({})

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const footerSections = [
    {
      id: 'my-account',
      title: 'My Account',
      links: [
        { href: "/frontend/purchase-dashboard", label: "My Account" },
        { href: "/frontend/purchase-dashboard", label: "My Orders" },
       
      ]
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { href: "/frontend/contact", label: "Contact Us" },
        { href: "/frontend/register", label: "Register" },
        { href: "/frontend/newsletter", label: "Newsletter" },
       
       
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { href: "/frontend/about", label: "About us" },
        { href: "/frontend/shipping-policy", label: "Shipping Info" },
        { href: "/frontend/quality-guarantee", label: "Quality Guarantee" },
        { href: "/frontend/privacy-policy", label: "Privacy Policy" }
      ]
    },
    {
      id: 'shop',
      title: 'Shop',
      links: [
        { href: "/frontend/all-products", label: "SALE" },
        { href: "/frontend/products/new", label: "New Arrivals" },
        { href: "/frontend/vegan-products", label: "Vegan" },
        { href: "/frontend/frozen-products", label: "Frozen" },
        { href: "/frontend/catalogues-and-folders", label: "Catalogues" },
       
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 40%)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 lg:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-12">
          
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-lg">BC</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Beagley<span className="text-green-400">Copperman</span>
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Your premier partner for authentic Asian food and beverages across Europe. 
                Committed to delivering exceptional quality and authentic taste experiences.
              </p>
              
              {/* Enhanced Contact Info */}
              <div className="space-y-2 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
                <div className="flex items-center space-x-4 group hover:transform hover:translate-x-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <FaPhone className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-200 font-medium">(+31) 888 880 288</span>
                </div>
                <div className="flex items-center space-x-4 group hover:transform hover:translate-x-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <FaEnvelope className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-200 font-medium">sales@beagleycopperman.com</span>
                </div>
                <div className="flex items-start space-x-2 group hover:transform hover:translate-x-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors mt-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-gray-200">
                    <p className="font-medium">Steenwycklaan 2</p>
                    <p className="text-gray-400">1424 NL De Kwakel</p>
                    <p className="text-gray-400">The Netherlands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="lg:hidden space-y-4">
            {footerSections.map((section) => (
              <div key={section.id} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h4 className="text-lg font-semibold text-white">
                    {section.title}
                  </h4>
                  <FaChevronDown 
                    className={`w-4 h-4 text-green-400 transition-transform duration-300 ${
                      openSections[section.id] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div className={`px-6 transition-all duration-300 ${
                  openSections[section.id] ? 'max-h-96 pb-4' : 'max-h-0'
                } overflow-hidden`}>
                  <ul className="space-y-3">
                    {section.links.map((item) => (
                      <li key={item.href}>
                        <Link 
                          href={item.href}
                          className="text-gray-400 hover:text-green-400 transition-all duration-300 text-sm flex items-center group py-2"
                        >
                          <span className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-green-400 group-hover:shadow-lg group-hover:shadow-green-400/25 transition-all duration-300"></span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:col-span-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.id}>
                <h4 className="text-lg font-semibold mb-4 text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-green-600">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((item) => (
                    <li key={item.href}>
                      <Link 
                        href={item.href}
                        className="text-gray-400 hover:text-green-400 transition-all duration-300 text-sm flex items-center group py-2"
                      >
                        <span className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-green-400 group-hover:shadow-lg group-hover:shadow-green-400/25 transition-all duration-300"></span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Enhanced Social Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <span className="text-sm text-gray-400 font-medium">Connect With Us:</span>
              <div className="flex space-x-3">
                {[
                  { icon: FaFacebookF, href: "https://facebook.com", color: "hover:bg-blue-600" },
                  { icon: FaInstagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
                  { icon: FaYoutube, href: "https://youtube.com", color: "hover:bg-red-600" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-gray-800 ${social.color} rounded-xl flex items-center justify-center transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm border border-gray-700`}
                    aria-label={`Follow on ${social.icon.name.replace('Fa', '')}`}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Business Hours */}
            <div className="text-center lg:text-right">
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 backdrop-blur-sm border border-gray-700">
                <p className="text-sm text-gray-300 font-medium">
                  <span className="text-green-400">●</span> Business Hours: 
                  <span className="text-white ml-1">Mon-Fri, 8:30 AM - 6:00 PM (CET)</span>
                </p>
              </div>
            </div>

            {/* Enhanced Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-2 shadow-2xl hover:shadow-green-500/25 group border border-green-400/20"
              aria-label="Scroll to top"
            >
              <FaChevronUp className="w-5 h-5 text-white transform group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Enhanced Copyright */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Beagle Copperman. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link href="/privacy" className="hover:text-green-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-green-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-green-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer