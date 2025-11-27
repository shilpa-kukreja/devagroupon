"use client";

import { useState, useEffect } from "react";
import { ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CataloguePage() {
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center mt-20 py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl">
          <div className="flex justify-center mb-4">
            {/* <div className="p-3 bg-blue-50 rounded-xl">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Product Catalogue
          </h1>
          {/* <p className="text-xl text-gray-600 mt-4 leading-relaxed">
            Discover our comprehensive range of premium products designed to 
            meet your highest standards of quality and performance.
          </p> */}
        </div>

        {/* Catalogue Container */}
        <div className="w-full max-w-7xl">
          <div className="
            bg-white 
            rounded-2xl 
            shadow-lg 
            border border-gray-100 
            overflow-hidden
            transition-all duration-300
            hover:shadow-xl
          ">

            {/* Header Section with Download CTA */}
            <div className="
              flex flex-col sm:flex-row 
              justify-between items-center 
              px-8 py-6 
              bg-gradient-to-r from-gray-50 to-blue-50 
              border-b border-gray-200
            ">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Complete Product Line
                </h2>
                <p className="text-gray-600 mt-1">
                  Updated: {new Date().toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              <a
                href="/pdf/sample_catalogue.pdf"
                download="Product_Catalogue.pdf"
                className="
                  inline-flex items-center gap-3 
                  bg-gradient-to-r from-blue-600 to-blue-700 
                  text-white 
                  px-6 py-3 rounded-lg 
                  font-semibold text-sm
                  shadow-md 
                  hover:shadow-lg 
                  hover:from-blue-700 hover:to-blue-800
                  active:scale-95 
                  transform transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download PDF Catalogue
              </a>
            </div>

            {/* PDF Viewer Section */}
            <div className="p-8">
              <div className="relative w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-gray-50">

                {/* Enhanced Loading State */}
                {(!iframeLoaded || loading) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <div className="text-gray-700 font-medium">
                      Loading Catalogue...
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Preparing your viewing experience
                    </p>
                  </div>
                )}

                {/* PDF Viewer */}
                <iframe
                  src="/pdf/sample_catalogue.pdf#toolbar=0&navpanes=0"
                  className="w-full h-[75vh] rounded-lg"
                  onLoad={handleIframeLoad}
                  title="Product Catalogue PDF Viewer"
                />
                
                {/* Viewer Footer */}
                <div className="
                  bg-gray-50 
                  border-t border-gray-200 
                  px-4 py-3 
                  flex justify-between items-center 
                  text-sm text-gray-600
                ">
                  <span>Interactive PDF Viewer</span>
                  <span>Use controls to navigate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Latest Products</h3>
              <p className="text-gray-600 text-sm">
                Featuring our newest innovations and product enhancements
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Technical Specs</h3>
              <p className="text-gray-600 text-sm">
                Detailed specifications and performance metrics
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Sales</h3>
              <p className="text-gray-600 text-sm">
                Need assistance? Our team is ready to help
              </p>
            </div>
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
}