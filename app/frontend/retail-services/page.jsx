"use client";

import Image from "next/image";
import { FiShoppingBag, FiEdit3, FiStar } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RetailPage() {
  const services = [
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: "Store Design & Layout",
      desc: "Plan customer-friendly layouts that increase discovery, engagement, and basket value.",
      price: "Starting ₹12,000",
    },
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: "Visual Merchandising",
      desc: "Product arrangement, signage, and display strategy designed to boost conversions.",
      price: "Starting ₹10,000",
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Omnichannel Retail",
      desc: "Integrate POS, online store, and inventory into one unified customer experience.",
      price: "Starting ₹18,000",
    },
  ];

  return (
    <div className="bg-neutral-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto mt-20 px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Retail Services</h1>
        <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
          We design retail environments that enhance customer experience,
          increase conversions, and simplify store operations. Everything is
          built around shopper psychology and modern retail strategy.
        </p>
      </section>

      {/* SERVICES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Our Retail Services
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Solutions built to drive performance and elevate your in-store
          experience.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* <div className="mt-6 flex items-center justify-between pt-4 border-t">
                <a
                  href="#contact"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Request audit
                </a>
                <span className="text-sm text-gray-500">{s.price}</span>
              </div> */}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
