// components/AboutBrand.jsx

import { aboutbrand1, brands } from '@/public/assets';

export default function AboutBrand1({ brandSlug }) {
  // Find the brand by its slug
  const brand = brands.find((b) => b.slug === brandSlug);

  // Match the content for the specific brand
  const brandContent = aboutbrand1.find((item) => item.brandid === brand?.id);

  // If no brand or content is found, return null
  if (!brand || !brandContent) return null;

  return (
    <section className="bg-white border-t border-gray-400  py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Left: Brand Heading */}
          <div className="md:w-1/2 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              {brandContent.heading}
            </h2>
          </div>

          {/* Right: Brand Content */}
          <div className="md:w-1/2 flex justify-center">
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              {brandContent.content}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
