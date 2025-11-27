// components/SourcingPurchase.js

export default function SourcingPurchase() {
  return (
    <section className="py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
        {/* Text Section */}
        <div className="text-gray-900 flex-1 space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            SOURCING & PURCHASE
          </h2>
          <p className="text-lg max-w-2xl text-justify">
            We collaborate with premium brand suppliers in Asia, always striving for long-term relationships. Our experienced sourcing specialists are constantly searching for high-quality, authentic products to expand our assortment. They closely follow market demands and keep up with the latest trends. Our purchasing team ensures that the right products are in stock at the right time and at a fair price. This way, we offer the best brands at the best prices!
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex-shrink-0 max-w-md mx-auto lg:mx-0">
          <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
            <img
              className="object-cover w-full h-full transform transition-all duration-300 hover:scale-105"
              src="/about/aboutus2.webp" // Replace with your image URL
              alt="Sourcing & Purchase"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0  opacity-50"></div>
            <div className="absolute bottom-4 left-4 text-sm text-white bg-black px-3 py-1 rounded-full">
              Famous from TikTok
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
