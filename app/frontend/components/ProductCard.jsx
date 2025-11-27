import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, viewMode }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <Image
              src={product.thumbImg}
              alt={product.name}
              width={200}
              height={200}
              className="w-40 h-40 object-contain rounded-lg"
            />
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{discountPercentage}%
              </span>
            )}
            {product.NewProduct && (
              <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                New
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              {product.Halal && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Halal
                </span>
              )}
              {product.Vegan && (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                  Vegan
                </span>
              )}
              <span className="text-gray-500 text-sm">{product.country}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.discountPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                  )}
                </div>
                {product.ml && (
                  <span className="text-sm text-gray-500">{product.ml}</span>
                )}
                {product.kg && (
                  <span className="text-sm text-gray-500">{product.kg}kg</span>
                )}
              </div>
              
              <button className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors flex items-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group">
      <div className="relative mb-4">
        <Image
          src={product.thumbImg}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-48 object-contain rounded-lg"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercentage}%
            </span>
          )}
          {product.NewProduct && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </span>
          )}
        </div>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-lime-600 transition-colors">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(24)</span>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        {product.Halal && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            Halal
          </span>
        )}
        {product.Vegan && (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
            Vegan
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-gray-900">
                ${product.discountPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
          )}
        </div>
        {product.ml && (
          <span className="text-sm text-gray-500">{product.ml}</span>
        )}
        {product.kg && (
          <span className="text-sm text-gray-500">{product.kg}kg</span>
        )}
      </div>
      
      <button className="w-full bg-lime-500 text-white py-2.5 rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center gap-2">
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  );
}