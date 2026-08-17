// components/SourcingPurchase.js

export default function SourcingPurchase() {
  return (
    <section className="py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
        {/* Text Section */}
        <div className="text-gray-900 flex-1 space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            SOURCING AND PURCHASING
          </h2>
          <p className="text-lg max-w-2xl text-justify">
            Deva Gruppen collaborates with carefully selected premium suppliers across Asia, prioritizing long term partnerships built on transparency, consistency, and shared values. Our sourcing specialists are deeply embedded in market trends, consumer shifts, and category evolution, allowing us to identify products that feel both authentic and commercially relevant.Our purchasing process is designed to balance availability, quality, and value. By aligning demand forecasting with supply expertise, we ensure our partners receive the right products at the right time, without compromising standards.
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex-shrink-0 max-w-md mx-auto lg:mx-0">
          <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
            <img
              className="object-cover w-full h-full transform transition-all duration-300 hover:scale-105"
              src="/home/img3.png" // Replace with your image URL
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
