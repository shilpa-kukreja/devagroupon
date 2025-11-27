// components/AboutBrand.jsx

import { aboutbrand2, brands } from '@/public/assets';
import Image from 'next/image';

export default function AboutBrand2() {
  const brandContent = aboutbrand2[0];
  const brand = brands.find(b => b.id === brandContent.brandid);

  return (
    <div className="bg-white border-t border-gray-400 py-16">
      <div className="max-w-6xl m-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4">
        
       
       

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={brandContent.image}
            alt="Crying Thaiger Sriracha"
            className="w-full max-w-md object-contain"
          />
        </div>

         {/* Text Section */}
         <div className="md:w-1/2 flex flex-col justify-center">
          <h3 className="text-sm font-bold uppercase text-red-600 mb-2">Authentic Thai spice and sweetness</h3>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            {brandContent.heading}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-justify">
            {brandContent.content}
          </p>

          {/* <div className="flex flex-wrap items-center gap-4">
            <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded shadow">
              All Products
            </button>
            <a
              href="https://cryingthaiger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline font-medium"
            >
              Crying Thaiger Website
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
