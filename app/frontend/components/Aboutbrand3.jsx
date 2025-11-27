"use client";
import Image from "next/image";
import { aboutbrand3, brands } from "@/public/assets";
import { motion } from "framer-motion";

export default function AboutBrand3({ brandSlug }) {
  // Find brand and its about content
  const brand = brands.find((b) => b.slug === brandSlug);
  const brandContent = aboutbrand3.find((item) => item.brandid === brand?.id);

  if (!brand || !brandContent) return null;

  return (
    <section className={`${brandContent.color} text-gray-900 py-16`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: Text Section */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 uppercase tracking-wide">
            {brandContent.heading}
          </h2>
          <p className="text-md leading-relaxed text-gray-700 whitespace-pre-line text-justify">
            {brandContent.content}
          </p>
        </motion.div>

        {/* Right: Image Section */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] rounded-xl  overflow-hidden   transition-all duration-300">
            <Image
              src={brandContent.image}
              alt={brandContent.heading}
              fill
              className="object-cover  transition-transform duration-500"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
