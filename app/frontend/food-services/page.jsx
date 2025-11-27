// ===== app/food/page.jsx =====
"use client";

import React from "react";
import { FiCoffee, FiTruck, FiLayers } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FoodPage() {
  const services = [
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: "Menu Engineering",
      desc: "Increase margins by optimising dishes, placement and pricing through proven strategies.",
      price: "Starting ₹9,999",
    },
    {
      icon: <FiTruck className="w-6 h-6" />,
      title: "Delivery & Packaging",
      desc: "Smart packaging that reduces cost, preserves food quality and improves customer delight.",
      price: "Starting ₹12,000",
    },
    {
      icon: <FiCoffee className="w-6 h-6" />,
      title: "Kitchen Operations",
      desc: "Improve flow, station design and prep systems to reduce ticket times and errors.",
      price: "Starting ₹15,000",
    },
  ];

  return (
    <div className="bg-neutral-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto mt-20 px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">
          Food Business Services
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
          From menu engineering to kitchen optimisation, we help food brands
          increase efficiency, improve customer experience and boost margins.
        </p>
      </section>

      {/* SERVICES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Our Food Services
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Practical, data-backed systems to improve quality, reduce operational
          friction and grow profitability.
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
                  Start audit
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
