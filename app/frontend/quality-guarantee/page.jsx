"use client"
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function QualityGuarantee() {
  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Quality Guarantee - Beagley Copperman</title>
        <meta name="description" content="Our commitment to quality and EU law compliance" />
      </Head>

      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Quality Guarantee</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gray-600 px-6 py-16 text-white">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold mb-4">Our Commitment to Quality</h2>
              <p className="text-xl text-blue-100">
                At Beagley Copperman, we work hard to deliver high-quality products that meet the highest standards.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-12 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-700 text-justify leading-relaxed">
                  At Beagley Copperman we work hard to make sure we deliver high-quality products. 
                  We do this by working with the best manufacturers and suppliers and investing in 
                  building good and reliable business relations.
                </p>
              </div>

              {/* Quality Team Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Dedicated Quality Team</h3>
                </div>
                <p className="text-gray-700 text-justify leading-relaxed mb-4">
                  To make sure our products are conform to EU law and of good quality, we installed a special quality team. 
                  These food science experts test the quality of our products and make sure labels are in order.
                </p>
                <p className="text-gray-700 text-justify leading-relaxed">
                  All new products are being inspected and tested elaborately by this team, and only being added to our 
                  assortment when we feel confident the quality is up to our standards.
                </p>
              </div>

              {/* Continuous Monitoring Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Continuous Monitoring</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We keep close contact with our customers and suppliers to stay on top of any changes 
                  in law or product specifications.
                </p>
              </div>

              {/* Final Commitment */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">Our Promise</h4>
                <p className="text-blue-800 text-justify text-lg font-medium">
                  This way we make sure that the products we deliver to you are of high-quality and EU law conform!
                </p>
              </div>

              {/* Features Grid */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">Premium Suppliers</h5>
                  <p className="text-gray-600 text-sm">Working with the best manufacturers and suppliers</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">EU Law Compliant</h5>
                  <p className="text-gray-600 text-sm">All products meet EU regulations and standards</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">Continuous Communication</h5>
                  <p className="text-gray-600 text-sm">Staying updated with customers and suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
</div>
     <Footer/>
    </div>
  )
}