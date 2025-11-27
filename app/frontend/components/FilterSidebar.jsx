import { X } from "lucide-react";

export default function FilterSidebar({
  showFilters,
  setShowFilters,
  availableFilters,
  selectedBrands,
  setSelectedBrands,
  selectedCountries,
  setSelectedCountries,
  priceRange,
  setPriceRange,
  selectedAttributes,
  setSelectedAttributes,
  clearAllFilters,
}) {
  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleCountryToggle = (country) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const sidebarContent = (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-lime-600 hover:text-lime-700 font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      {availableFilters.brands.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableFilters.brands.map(brand => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id.toString())}
                  onChange={() => handleBrandToggle(brand.id.toString())}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Countries */}
      {availableFilters.countries.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Countries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableFilters.countries.map(country => (
              <label key={country} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country)}
                  onChange={() => handleCountryToggle(country)}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {country}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Attributes */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Attributes</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedAttributes.halal}
              onChange={(e) => setSelectedAttributes(prev => ({ ...prev, halal: e.target.checked }))}
              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal Certified</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedAttributes.vegan}
              onChange={(e) => setSelectedAttributes(prev => ({ ...prev, vegan: e.target.checked }))}
              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedAttributes.new}
              onChange={(e) => setSelectedAttributes(prev => ({ ...prev, new: e.target.checked }))}
              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto transform transition-transform">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {sidebarContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}