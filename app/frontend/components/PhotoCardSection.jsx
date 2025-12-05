// components/PhotoCardSection.js

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const photoCards = [
  {
    title: "Asian Store",
    imageSrc: "/home/Group1.png",
    description: "Authentic Asian groceries and ingredients",
    href: "/frontend/asian-store",
  },
  {
    title: "Candy Store",
    imageSrc: "/home/Group2.png",
    description: "Sweet delights from around the world",
    href: "/frontend/candy-store",
  },
  {
    title: "Retail",
    imageSrc: "/home/Group3.png",
    description: "Premium retail shopping experience",
    href: "/frontend/retail",
  },
  {
    title: "Asian Wholesale",
    imageSrc: "/home/Group4.png",
    description: "Bulk sourcing for businesses",
    href: "/frontend/asian-wholesale",
  },
];

const PhotoCardSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden mt-[-47px]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url(/home/bg-1.svg)" }}
      />

      {/* Color blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Business Verticals
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-200 max-w-2xl mx-auto"
          >
            Discover our diverse range of specialized stores and services
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {photoCards.map((card, index) => {
            const CardContent = (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl 
                           overflow-hidden border border-white/20 hover:border-white/40 
                           transition-all duration-500 shadow-2xl hover:shadow-3xl cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 
                           (max-width: 1200px) 50vw, 
                           25vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t 
                                  from-black/80 via-black/20 to-transparent 
                                  opacity-60 group-hover:opacity-40 
                                  transition-opacity duration-500" />

                  {/* Text */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white 
                               transform transition-transform duration-500 
                               group-hover:-translate-y-2"
                  >
                    <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                    <p
                      className="text-blue-200 opacity-0 group-hover:opacity-100 
                                 transition-opacity duration-500 delay-100"
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Hover Border */}
                  <div
                    className="absolute inset-0 border-2 border-transparent 
                               group-hover:border-white/30 rounded-2xl 
                               transition-all duration-500"
                  />
                </div>

                {/* Shine Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent 
                             via-white/10 to-transparent -skew-x-12 -translate-x-full 
                             group-hover:translate-x-full transition-transform duration-1000"
                />
              </motion.div>
            );

            // Wrap with Link only if "href" exists
            return card.href ? (
              <Link key={index} href={card.href}>
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="bg-white text-slate-900 px-8 py-4 rounded-full 
                             font-semibold text-lg hover:bg-blue-50 
                             transform hover:scale-105 transition-all duration-300 
                             shadow-lg hover:shadow-xl">
            Explore All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoCardSection;
