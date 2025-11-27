// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useParams } from "next/navigation";
// import { Filter, Grid, List, ChevronDown, ChevronUp, X } from "lucide-react";
// import Image from "next/image";
// import ReactCountryFlag from "react-country-flag";
// import { products, maincategory, categories, subcategories, brands } from "@/public/assets";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import Link from "next/link";

// export default function ProductsPage() {
//   const params = useParams();
//   const slug = params.slug || [];
  
//   const [showFilters, setShowFilters] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [sortBy, setSortBy] = useState('default');
//   const [expandedFilters, setExpandedFilters] = useState({});
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [selectedFilters, setSelectedFilters] = useState({
//     brands: [],
//     countries: [],
//     halal: false,
//     vegan: false,
//     new: false,
//     kosher: false,
//     allergens: [],
//     language: [],
//     frozen: false,
//     salt: false,
//     fat: false,
//     sugar: false,
//     unit: []
//   });

//   // Determine current navigation context
//   const currentContext = useMemo(() => {
//     if (slug.length === 0) return { type: 'all', data: null };
    
//     const lastSlug = slug[slug.length - 1];
    
//     // Check main category
//     const mainCat = maincategory.find(cat => cat.slug === lastSlug);
//     if (mainCat) return { type: 'maincategory', data: mainCat };
    
//     // Check category
//     const cat = categories.find(c => c.slug === lastSlug);
//     if (cat) return { type: 'category', data: cat };
    
//     // Check subcategory
//     const subCat = subcategories.find(sc => sc.slug === lastSlug);
//     if (subCat) return { type: 'subcategory', data: subCat };
    
//     return { type: 'all', data: null };
//   }, [slug]);

//   // Get products based on current context
//   const contextProducts = useMemo(() => {
//     let filteredProducts = products;

//     // Filter products based on navigation context
//     if (currentContext.type === 'maincategory') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.maincategory.includes(currentContext.data.id.toString())
//       );
//     } else if (currentContext.type === 'category') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.category.includes(currentContext.data.id.toString())
//       );
//     } else if (currentContext.type === 'subcategory') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.subcategory.includes(currentContext.data.id.toString())
//       );
//     }

//     return filteredProducts;
//   }, [currentContext]);

//   // Get available filters based on current context products
//   const availableFilters = useMemo(() => {
//     const brandSet = new Set();
//     const countrySet = new Set();
//     const allergenSet = new Set();
//     const languageSet = new Set();
//     const unitSet = new Set();

//     contextProducts.forEach(product => {
//       product.brand.forEach(brandId => brandSet.add(brandId));
//       countrySet.add(product.country);
//       if (product.Allergens) {
//         product.Allergens.split(',').forEach(allergen => 
//           allergenSet.add(allergen.trim())
//         );
//       }
//       if (product.languageoflabels) {
//         languageSet.add(product.languageoflabels);
//       }
//       if (product.ml) unitSet.add('ml');
//       if (product.kg) unitSet.add('kg');
//     });

//     return {
//       brands: Array.from(brandSet).map(brandId => 
//         brands.find(b => b.id.toString() === brandId)
//       ).filter(Boolean),
//       countries: Array.from(countrySet),
//       allergens: Array.from(allergenSet),
//       languages: Array.from(languageSet),
//       units: Array.from(unitSet),
//       hasHalal: contextProducts.some(p => p.Halal),
//       hasVegan: contextProducts.some(p => p.Vegan),
//       hasNew: contextProducts.some(p => p.NewProduct),
//       hasKosher: contextProducts.some(p => p.Kosher),
//       hasFrozen: contextProducts.some(p => p.Frozen),
//       hasSalt: contextProducts.some(p => p.Salt),
//       hasFat: contextProducts.some(p => p.Fat),
//       hasSugar: contextProducts.some(p => p.ofwhichSugars),
//     };
//   }, [contextProducts]);

//   // Filter products based on selected filters
//   const filteredProducts = useMemo(() => {
//     let filtered = contextProducts;

//     // Apply brand filter
//     if (selectedFilters.brands.length > 0) {
//       filtered = filtered.filter(product =>
//         product.brand.some(brandId => 
//           selectedFilters.brands.includes(brandId.toString())
//         )
//       );
//     }

//     // Apply country filter
//     if (selectedFilters.countries.length > 0) {
//       filtered = filtered.filter(product =>
//         selectedFilters.countries.includes(product.country)
//       );
//     }

//     // Apply attribute filters
//     if (selectedFilters.halal) {
//       filtered = filtered.filter(product => product.Halal === true);
//     }
//     if (selectedFilters.vegan) {
//       filtered = filtered.filter(product => product.Vegan === true);
//     }
//     if (selectedFilters.new) {
//       filtered = filtered.filter(product => product.NewProduct === true);
//     }
//     if (selectedFilters.kosher) {
//       filtered = filtered.filter(product => product.Kosher === true);
//     }
//     if (selectedFilters.frozen) {
//       filtered = filtered.filter(product => product.Frozen === true);
//     }
//     if (selectedFilters.salt) {
//       filtered = filtered.filter(product => product.Salt === true);
//     }
//     if (selectedFilters.fat) {
//       filtered = filtered.filter(product => product.Fat === true);
//     }
//     if (selectedFilters.sugar) {
//       filtered = filtered.filter(product => product.ofwhichSugars === true);
//     }

//     // Apply allergen filter
//     if (selectedFilters.allergens.length > 0) {
//       filtered = filtered.filter(product => 
//         product.Allergens && 
//         selectedFilters.allergens.some(allergen => 
//           product.Allergens.includes(allergen)
//         )
//       );
//     }

//     // Apply language filter
//     if (selectedFilters.language.length > 0) {
//       filtered = filtered.filter(product =>
//         selectedFilters.language.includes(product.languageoflabels)
//       );
//     }

//     // Apply unit filter
//     if (selectedFilters.unit.length > 0) {
//       filtered = filtered.filter(product =>
//         (selectedFilters.unit.includes('ml') && product.ml) ||
//         (selectedFilters.unit.includes('kg') && product.kg)
//       );
//     }

//     // Apply price filter
//     filtered = filtered.filter(product => {
//       const price = product.discountPrice || product.price;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });

//     // Apply sorting
//     switch (sortBy) {
//       case 'price-low':
//         filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
//         break;
//       case 'price-high':
//         filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
//         break;
//       case 'name':
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case 'newest':
//         filtered.sort((a, b) => b.id - a.id);
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [contextProducts, selectedFilters, priceRange, sortBy]);

//   const toggleFilter = (filterType, value) => {
//     setSelectedFilters(prev => {
//       if (filterType === 'brands' || filterType === 'countries' || filterType === 'allergens' || filterType === 'language' || filterType === 'unit') {
//         return {
//           ...prev,
//           [filterType]: prev[filterType].includes(value)
//             ? prev[filterType].filter(item => item !== value)
//             : [...prev[filterType], value]
//         };
//       } else {
//         return {
//           ...prev,
//           [filterType]: !prev[filterType]
//         };
//       }
//     });
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({
//       brands: [],
//       countries: [],
//       halal: false,
//       vegan: false,
//       new: false,
//       kosher: false,
//       allergens: [],
//       language: [],
//       frozen: false,
//       salt: false,
//       fat: false,
//       sugar: false,
//       unit: []
//     });
//     setPriceRange([0, 1000]);
//   };

//   const toggleFilterSection = (section) => {
//     setExpandedFilters(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const getBreadcrumbPath = () => {
//     const path = [{ name: 'Home', href: '/' }];
    
//     if (currentContext.type === 'all') {
//       path.push({ name: 'All Products', href: '/products' });
//     } else {
//       path.push({ name: 'All Products', href: '/products' });
      
//       if (currentContext.type === 'maincategory') {
//         path.push({ 
//           name: currentContext.data.name, 
//           href: `/products/${currentContext.data.slug}` 
//         });
//       } else if (currentContext.type === 'category') {
//         const category = currentContext.data;
//         const mainCat = maincategory.find(mc => 
//           mc.id.toString() === category.maincategory[0]
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: category.name, 
//           href: `/products/${mainCat?.slug}/${category.slug}` 
//         });
//       } else if (currentContext.type === 'subcategory') {
//         const subcategory = currentContext.data;
//         const category = categories.find(c => 
//           c.id.toString() === subcategory.category[0]
//         );
//         const mainCat = maincategory.find(mc => 
//           mc.id.toString() === category?.maincategory[0]
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
//         if (category) {
//           path.push({ 
//             name: category.name, 
//             href: `/products/${mainCat?.slug}/${category.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: subcategory.name, 
//           href: `/products/${mainCat?.slug}/${category?.slug}/${subcategory.slug}` 
//         });
//       }
//     }
    
//     return path;
//   };

//   const FilterSection = ({ title, children, isExpanded = false }) => (
//     <div className="border-b border-gray-200 pb-4">
//       <button
//         onClick={() => toggleFilterSection(title)}
//         className="flex items-center justify-between w-full text-left"
//       >
//         <span className="font-semibold text-gray-900">{title}</span>
//         {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </button>
//       {(expandedFilters[title] !== false) && (
//         <div className="mt-3 space-y-2">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div>
//       <Navbar/>
//       <div>
//         <img src="/banner/newsletterbanner.webp" alt="Banner" />
//         <div className="min-h-screen bg-gray-50 py-6">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Breadcrumb */}
//             <nav className="mb-8">
//               <ol className="flex items-center space-x-2 text-sm text-gray-600">
//                 {getBreadcrumbPath().map((item, index) => (
//                   <li key={index} className="flex items-center">
//                     {index > 0 && <ChevronDown size={16} className="rotate-[-90deg] mx-2" />}
//                     <a 
//                       href={item.href}
//                       className="hover:text-lime-600 transition-colors"
//                     >
//                       {item.name}
//                     </a>
//                   </li>
//                 ))}
//               </ol>
//             </nav>

//             {/* Header */}
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {currentContext.type === 'all' ? 'All Products' : currentContext.data.name}
//               </h1>
//               <p className="text-gray-600">
//                 Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
//                 {contextProducts.length !== filteredProducts.length && 
//                   ` (filtered from ${contextProducts.length} products)`
//                 }
//               </p>
//             </div>

//             <div className="flex gap-8">
//               {/* Filter Sidebar */}
//               <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
//                   {/* Header */}
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={clearAllFilters}
//                         className="text-sm text-lime-600 hover:text-lime-700 font-medium"
//                       >
//                         Clear all
//                       </button>
//                       <button
//                         onClick={() => setShowFilters(false)}
//                         className="lg:hidden p-1 hover:bg-gray-100 rounded"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Price Range */}
//                   <FilterSection title="Price Range" isExpanded={true}>
//                     <div className="space-y-3">
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         value={priceRange[1]}
//                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
//                       />
//                       <div className="flex items-center justify-between text-sm text-gray-600">
//                         <span>${priceRange[0]}</span>
//                         <span>${priceRange[1]}</span>
//                       </div>
//                     </div>
//                   </FilterSection>

//                   {/* Brands */}
//                   {availableFilters.brands.length > 0 && (
//                     <FilterSection title="Brand">
//                       <div className="space-y-2 max-h-48 overflow-y-auto">
//                         {availableFilters.brands.map(brand => (
//                           <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.brands.includes(brand.id.toString())}
//                               onChange={() => toggleFilter('brands', brand.id.toString())}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {brand.name}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Countries */}
//                   {availableFilters.countries.length > 0 && (
//                     <FilterSection title="Country of Origin">
//                       <div className="space-y-2">
//                         {availableFilters.countries.map(country => (
//                           <label key={country} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.countries.includes(country)}
//                               onChange={() => toggleFilter('countries', country)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {country}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

                  

//                   {/* Attributes */}
//                   <FilterSection title="Attributes">
//                     <div className="space-y-3">
//                       {availableFilters.hasHalal && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.halal}
//                             onChange={() => toggleFilter('halal')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
//                         </label>
//                       )}
//                       {availableFilters.hasVegan && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.vegan}
//                             onChange={() => toggleFilter('vegan')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
//                         </label>
//                       )}
//                       {availableFilters.hasNew && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.new}
//                             onChange={() => toggleFilter('new')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">New Product</span>
//                         </label>
//                       )}
//                       {availableFilters.hasKosher && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.kosher}
//                             onChange={() => toggleFilter('kosher')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
//                         </label>
//                       )}

//                       {availableFilters.hasFrozen && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.frozen}
//                             onChange={() => toggleFilter('frozen')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
//                         </label>
//                       )}
                      
//                       {availableFilters.hasSugar && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.sugar}
//                             onChange={() => toggleFilter('sugar')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
//                         </label>
//                       )}
//                     </div>
//                   </FilterSection>

//                   {/* Allergens */}
//                   {availableFilters.allergens.length > 0 && (
//                     <FilterSection title="Allergens">
//                       <div className="space-y-2">
//                         {availableFilters.allergens.map(allergen => (
//                           <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.allergens.includes(allergen)}
//                               onChange={() => toggleFilter('allergens', allergen)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {allergen}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {
//                     availableFilters.salt > 0 && (
//                       <FilterSection title="Salt">
//                         <div className="space-y-2">
//                           {availableFilters.salt.map(salt => (
//                             <label key={salt} className="flex items-center gap-3 cursor-pointer group">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedFilters.salt.includes(salt)}
//                                 onChange={() => toggleFilter('salt', salt)}
//                                 className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                               />
//                               <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                                 {salt}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </FilterSection>
//                     )
//                   }

                  
//                   {
//                     availableFilters.fat > 0 && (
//                       <FilterSection title="fat">
//                         <div className="space-y-2">
//                           {availableFilters.fat.map(fat => (
//                             <label key={fat} className="flex items-center gap-3 cursor-pointer group">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedFilters.fat.includes(fat)}
//                                 onChange={() => toggleFilter('fat', fat)}
//                                 className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                               />
//                               <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                                 {fat}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </FilterSection>
//                     )
//                   }



//                   {/* Language */}
//                   {availableFilters.languages.length > 0 && (
//                     <FilterSection title="Language on the Label">
//                       <div className="space-y-2">
//                         {availableFilters.languages.map(language => (
//                           <label key={language} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.language.includes(language)}
//                               onChange={() => toggleFilter('language', language)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {language}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Unit */}
//                   {availableFilters.units.length > 0 && (
//                     <FilterSection title="Unit">
//                       <div className="space-y-2">
//                         {availableFilters.units.map(unit => (
//                           <label key={unit} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.unit.includes(unit)}
//                               onChange={() => toggleFilter('unit', unit)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

                 
//                 </div>
//               </div>

//               {/* Main Content */}
//               <div className="flex-1">
//                 {/* Toolbar */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     {!showFilters && (
//                       <button
//                         onClick={() => setShowFilters(true)}
//                         className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
//                       >
//                         <Filter size={20} />
//                         Show Filters
//                       </button>
//                     )}

//                     <div className="flex items-center gap-4 ml-auto">
//                       <span className="text-sm text-gray-600">Sort by:</span>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
//                       >
//                         <option value="default">Priority descending</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="name">Name A-Z</option>
//                         <option value="newest">Newest First</option>
//                       </select>
//                     </div>

//                     <div className="flex items-center gap-2 ml-4">
//                       <button
//                         onClick={() => setViewMode('grid')}
//                         className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <Grid size={20} />
//                       </button>
//                       <button
//                         onClick={() => setViewMode('list')}
//                         className={`p-2 rounded-lg ${viewMode === 'list' ? ' text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <List size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products Grid */}
//                 {filteredProducts.length > 0 ? (
//                   <div className={
//                     viewMode === 'grid' 
//                       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-2"
//                       : "space-y-4"
//                   }>
//                     {filteredProducts.map(product => (
//                       <ProductCard 
//                         key={product.id} 
//                         product={product} 
//                         viewMode={viewMode}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 mb-4">
//                       <Filter size={64} className="mx-auto" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No products found
//                     </h3>
//                     <p className="text-gray-600 mb-4">
//                       Try adjusting your filters or search terms
//                     </p>
//                     <button
//                       onClick={clearAllFilters}
//                       className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }





// function ProductCard({ product, viewMode }) {
//   const hasDiscount = product.discountPrice && product.discountPrice < product.price;

//   const getCountryCode = (country) => {
//     const map = {
//       Thailand: "TH",
//       Korea: "KR",
//       India: "IN",
//       Japan: "JP",
//       China: "CN",
//       USA: "US",
//       Germany: "DE",
//       France: "FR",
//       Italy: "IT",
//       "United Kingdom": "GB",
//     };
//     return map[country] || "UN";
//   };

//   // URL to product detail page
//   const detailLink = `/frontend/product/${product.slug}`;

//   // --- List View ---
//   if (viewMode === "list") {
//     return (
//       <Link href={detailLink}>
//         <div className="rounded-md border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer">
//           <div className="flex gap-6">
//             <div className="relative w-32 h-32">
//               <Image
//                 src={product.thumbImg}
//                 alt={product.name}
//                 fill
//                 className="object-contain rounded-md"
//               />
//             </div>

//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2  hover:text-lime-600 transition">
//                 {product.name}
//               </h3>

//               <div className="flex items-center gap-4 mb-3">
//                 <span className="text-2xl font-bold text-gray-900">
//                   ${hasDiscount ? product.discountPrice : product.price}
//                 </span>
//                 {hasDiscount && (
//                   <span className="text-lg text-gray-500 line-through">
//                     ${product.price}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <ReactCountryFlag
//                   countryCode={getCountryCode(product.country)}
//                   svg
//                   style={{ width: "1.5em", height: "1.5em" }}
//                 />
//                 <span>{product.country}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // --- Grid View ---
//   return (
//     <Link href={detailLink}>
//       <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group cursor-pointer border border-gray-100">
//         <div className="relative aspect-square">
//           <Image
//             src={product.thumbImg}
//             alt={product.name}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         </div>

//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <ReactCountryFlag
//               countryCode={getCountryCode(product.country)}
//               svg
//               style={{ width: "1.3em", height: "1.3em" }}
//             />
//             <span className="text-sm text-gray-600">{product.country}</span>
//           </div>

//           <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 truncate group-hover:text-lime-600 transition">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-2">
//             <span className="text-xl font-bold text-gray-900">
//               ${hasDiscount ? product.discountPrice : product.price}
//             </span>
//             {hasDiscount && (
//               <span className="text-sm text-gray-500 line-through">
//                 ${product.price}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }








// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Filter, Grid, List, ChevronDown, ChevronUp, X } from "lucide-react";
// import Image from "next/image";
// import ReactCountryFlag from "react-country-flag";
// import { products, maincategory, categories, subcategories, brands } from "@/public/assets";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import Link from "next/link";

// export default function ProductsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params.slug || [];
  
//   const [showFilters, setShowFilters] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [sortBy, setSortBy] = useState('default');
//   const [expandedFilters, setExpandedFilters] = useState({});
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [selectedFilters, setSelectedFilters] = useState({
//     brands: [],
//     countries: [],
//     halal: false,
//     vegan: false,
//     new: false,
//     kosher: false,
//     allergens: [],
//     language: [],
//     frozen: false,
//     salt: false,
//     fat: false,
//     sugar: false,
//     unit: []
//   });

//   // Determine current navigation context
//   const currentContext = useMemo(() => {
//     if (slug.length === 0) return { type: 'all', data: null };
    
//     const lastSlug = slug[slug.length - 1];
    
//     // Check if it's a new products route
//     if (slug[0] === 'new') {
//       return { type: 'new', data: { name: 'New Products', slug: 'new' } };
//     }
    
//     // Check if it's a brand route
//     if (slug[0] === 'brand') {
//       const brand = brands.find(b => b.slug === lastSlug);
//       if (brand) return { type: 'brand', data: brand };
//     }
    
//     // Check if it's a country route
//     if (slug[0] === 'country') {
//       const countryName = slug.slice(1).join(' ').replace(/-/g, ' ');
//       const formattedCountryName = countryName.replace(/\b\w/g, l => l.toUpperCase());
//       return { type: 'country', data: { name: formattedCountryName, slug: lastSlug } };
//     }
    
//     // Check main category
//     const mainCat = maincategory.find(cat => cat.slug === lastSlug);
//     if (mainCat) return { type: 'maincategory', data: mainCat };
    
//     // Check category
//     const cat = categories.find(c => c.slug === lastSlug);
//     if (cat) return { type: 'category', data: cat };
    
//     // Check subcategory
//     const subCat = subcategories.find(sc => sc.slug === lastSlug);
//     if (subCat) return { type: 'subcategory', data: subCat };
    
//     return { type: 'all', data: null };
//   }, [slug]);

//   // Get products based on current context
//   const contextProducts = useMemo(() => {
//     let filteredProducts = products;

//     // Filter products based on navigation context
//     if (currentContext.type === 'new') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.NewProduct === true
//       );
//     } else if (currentContext.type === 'brand') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.brand.includes(currentContext.data.id.toString())
//       );
//     } else if (currentContext.type === 'country') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.country.toLowerCase() === currentContext.data.name.toLowerCase()
//       );
//     } else if (currentContext.type === 'maincategory') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.maincategory.includes(currentContext.data.id.toString())
//       );
//     } else if (currentContext.type === 'category') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.category.includes(currentContext.data.id.toString())
//       );
//     } else if (currentContext.type === 'subcategory') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.subcategory.includes(currentContext.data.id.toString())
//       );
//     }

//     return filteredProducts;
//   }, [currentContext]);

//   // Get available filters based on current context products
//   const availableFilters = useMemo(() => {
//     const brandSet = new Set();
//     const countrySet = new Set();
//     const allergenSet = new Set();
//     const languageSet = new Set();
//     const unitSet = new Set();

//     contextProducts.forEach(product => {
//       product.brand.forEach(brandId => brandSet.add(brandId));
//       countrySet.add(product.country);
//       if (product.Allergens) {
//         product.Allergens.split(',').forEach(allergen => 
//           allergenSet.add(allergen.trim())
//         );
//       }
//       if (product.languageoflabels) {
//         languageSet.add(product.languageoflabels);
//       }
//       if (product.ml) unitSet.add('ml');
//       if (product.kg) unitSet.add('kg');
//     });

//     // Filter brands to only show those available in current context
//     const availableBrands = Array.from(brandSet).map(brandId => 
//       brands.find(b => b.id.toString() === brandId)
//     ).filter(Boolean);

//     return {
//       brands: availableBrands,
//       countries: Array.from(countrySet),
//       allergens: Array.from(allergenSet),
//       languages: Array.from(languageSet),
//       units: Array.from(unitSet),
//       hasHalal: contextProducts.some(p => p.Halal),
//       hasVegan: contextProducts.some(p => p.Vegan),
//       hasNew: contextProducts.some(p => p.NewProduct) && currentContext.type !== 'new',
//       hasKosher: contextProducts.some(p => p.Kosher),
//       hasFrozen: contextProducts.some(p => p.Frozen),
//       hasSalt: contextProducts.some(p => p.Salt),
//       hasFat: contextProducts.some(p => p.Fat),
//       hasSugar: contextProducts.some(p => p.ofwhichSugars),
//     };
//   }, [contextProducts, currentContext.type]);

//   // Filter products based on selected filters
//   const filteredProducts = useMemo(() => {
//     let filtered = contextProducts;

//     // Apply brand filter (only if not already filtered by brand route)
//     if (selectedFilters.brands.length > 0 && currentContext.type !== 'brand') {
//       filtered = filtered.filter(product =>
//         product.brand.some(brandId => 
//           selectedFilters.brands.includes(brandId.toString())
//         )
//       );
//     }

//     // Apply country filter (only if not already filtered by country route)
//     if (selectedFilters.countries.length > 0 && currentContext.type !== 'country') {
//       filtered = filtered.filter(product =>
//         selectedFilters.countries.includes(product.country)
//       );
//     }

//     // Apply new filter (only if not already on new products page)
//     if (selectedFilters.new && currentContext.type !== 'new') {
//       filtered = filtered.filter(product => product.NewProduct === true);
//     }

//     // Apply attribute filters
//     if (selectedFilters.halal) {
//       filtered = filtered.filter(product => product.Halal === true);
//     }
//     if (selectedFilters.vegan) {
//       filtered = filtered.filter(product => product.Vegan === true);
//     }
//     if (selectedFilters.kosher) {
//       filtered = filtered.filter(product => product.Kosher === true);
//     }
//     if (selectedFilters.frozen) {
//       filtered = filtered.filter(product => product.Frozen === true);
//     }
//     if (selectedFilters.salt) {
//       filtered = filtered.filter(product => product.Salt === true);
//     }
//     if (selectedFilters.fat) {
//       filtered = filtered.filter(product => product.Fat === true);
//     }
//     if (selectedFilters.sugar) {
//       filtered = filtered.filter(product => product.ofwhichSugars === true);
//     }

//     // Apply allergen filter
//     if (selectedFilters.allergens.length > 0) {
//       filtered = filtered.filter(product => 
//         product.Allergens && 
//         selectedFilters.allergens.some(allergen => 
//           product.Allergens.includes(allergen)
//         )
//       );
//     }

//     // Apply language filter
//     if (selectedFilters.language.length > 0) {
//       filtered = filtered.filter(product =>
//         selectedFilters.language.includes(product.languageoflabels)
//       );
//     }

//     // Apply unit filter
//     if (selectedFilters.unit.length > 0) {
//       filtered = filtered.filter(product =>
//         (selectedFilters.unit.includes('ml') && product.ml) ||
//         (selectedFilters.unit.includes('kg') && product.kg)
//       );
//     }

//     // Apply price filter
//     filtered = filtered.filter(product => {
//       const price = product.discountPrice || product.price;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });

//     // Apply sorting
//     switch (sortBy) {
//       case 'price-low':
//         filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
//         break;
//       case 'price-high':
//         filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
//         break;
//       case 'name':
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case 'newest':
//         filtered.sort((a, b) => b.id - a.id);
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [contextProducts, selectedFilters, priceRange, sortBy, currentContext.type]);

//   const toggleFilter = (filterType, value) => {
//     setSelectedFilters(prev => {
//       if (filterType === 'brands' || filterType === 'countries' || filterType === 'allergens' || filterType === 'language' || filterType === 'unit') {
//         return {
//           ...prev,
//           [filterType]: prev[filterType].includes(value)
//             ? prev[filterType].filter(item => item !== value)
//             : [...prev[filterType], value]
//         };
//       } else {
//         return {
//           ...prev,
//           [filterType]: !prev[filterType]
//         };
//       }
//     });
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({
//       brands: [],
//       countries: [],
//       halal: false,
//       vegan: false,
//       new: false,
//       kosher: false,
//       allergens: [],
//       language: [],
//       frozen: false,
//       salt: false,
//       fat: false,
//       sugar: false,
//       unit: []
//     });
//     setPriceRange([0, 1000]);
//   };

//   const toggleFilterSection = (section) => {
//     setExpandedFilters(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const getBreadcrumbPath = () => {
//     const path = [{ name: 'Home', href: '/' }];
    
//     if (currentContext.type === 'all') {
//       path.push({ name: 'All Products', href: '/products' });
//     } else if (currentContext.type === 'new') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: 'New Products', 
//         href: `/products/new` 
//       });
//     } else if (currentContext.type === 'brand') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: currentContext.data.name, 
//         href: `/products/brand/${currentContext.data.slug}` 
//       });
//     } else if (currentContext.type === 'country') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: `${currentContext.data.name} Products`, 
//         href: `/products/country/${currentContext.data.slug}` 
//       });
//     } else {
//       path.push({ name: 'All Products', href: '/products' });
      
//       if (currentContext.type === 'maincategory') {
//         path.push({ 
//           name: currentContext.data.name, 
//           href: `/products/${currentContext.data.slug}` 
//         });
//       } else if (currentContext.type === 'category') {
//         const category = currentContext.data;
//         const mainCat = maincategory.find(mc => 
//           mc.id.toString() === category.maincategory[0]
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: category.name, 
//           href: `/products/${mainCat?.slug}/${category.slug}` 
//         });
//       } else if (currentContext.type === 'subcategory') {
//         const subcategory = currentContext.data;
//         const category = categories.find(c => 
//           c.id.toString() === subcategory.category[0]
//         );
//         const mainCat = maincategory.find(mc => 
//           mc.id.toString() === category?.maincategory[0]
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
//         if (category) {
//           path.push({ 
//             name: category.name, 
//             href: `/products/${mainCat?.slug}/${category.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: subcategory.name, 
//           href: `/products/${mainCat?.slug}/${category?.slug}/${subcategory.slug}` 
//         });
//       }
//     }
    
//     return path;
//   };

//   const getPageTitle = () => {
//     switch (currentContext.type) {
//       case 'new':
//         return 'New Products';
//       case 'brand':
//         return currentContext.data.name;
//       case 'country':
//         return `${currentContext.data.name} Products`;
//       case 'maincategory':
//       case 'category':
//       case 'subcategory':
//         return currentContext.data.name;
//       default:
//         return 'All Products';
//     }
//   };

//   const getProductCountText = () => {
//     const total = filteredProducts.length;
//     const contextTotal = contextProducts.length;
    
//     let text = `Showing ${total} product${total !== 1 ? 's' : ''}`;
    
//     if (contextTotal !== total) {
//       text += ` (filtered from ${contextTotal} products)`;
//     }
    
//     if (currentContext.type === 'new') {
//       text += ` - All new arrivals`;
//     }
    
//     return text;
//   };

//   const FilterSection = ({ title, children, isExpanded = false }) => (
//     <div className="border-b border-gray-200 pb-4">
//       <button
//         onClick={() => toggleFilterSection(title)}
//         className="flex items-center justify-between w-full text-left"
//       >
//         <span className="font-semibold text-gray-900">{title}</span>
//         {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </button>
//       {(expandedFilters[title] !== false) && (
//         <div className="mt-3 space-y-2">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div>
//       <Navbar/>
//       <div>
//         <img src="/banner/newsletterbanner.webp" alt="Banner" />
//         <div className="min-h-screen bg-gray-50 py-6">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Breadcrumb */}
//             <nav className="mb-8">
//               <ol className="flex items-center space-x-2 text-sm text-gray-600">
//                 {getBreadcrumbPath().map((item, index) => (
//                   <li key={index} className="flex items-center">
//                     {index > 0 && <ChevronDown size={16} className="rotate-[-90deg] mx-2" />}
//                     <Link 
//                       href={item.href}
//                       className="hover:text-lime-600 transition-colors"
//                     >
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ol>
//             </nav>

//             {/* Header */}
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {getPageTitle()}
//               </h1>
//               <p className="text-gray-600">
//                 {getProductCountText()}
//               </p>
//             </div>

//             <div className="flex gap-8">
//               {/* Filter Sidebar */}
//               <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
//                   {/* Header */}
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={clearAllFilters}
//                         className="text-sm text-lime-600 hover:text-lime-700 font-medium"
//                       >
//                         Clear all
//                       </button>
//                       <button
//                         onClick={() => setShowFilters(false)}
//                         className="lg:hidden p-1 hover:bg-gray-100 rounded"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Price Range */}
//                   <FilterSection title="Price Range" isExpanded={true}>
//                     <div className="space-y-3">
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         value={priceRange[1]}
//                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
//                       />
//                       <div className="flex items-center justify-between text-sm text-gray-600">
//                         <span>${priceRange[0]}</span>
//                         <span>${priceRange[1]}</span>
//                       </div>
//                     </div>
//                   </FilterSection>

//                   {/* Brands - Hide if already on brand page */}
//                   {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
//                     <FilterSection title="Brands">
//                       <div className="space-y-2 max-h-48 overflow-y-auto">
//                         {availableFilters.brands.map(brand => (
//                           <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.brands.includes(brand.id.toString())}
//                               onChange={() => toggleFilter('brands', brand.id.toString())}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {brand.name}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Countries - Hide if already on country page */}
//                   {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
//                     <FilterSection title="Country of Origin">
//                       <div className="space-y-2">
//                         {availableFilters.countries.map(country => (
//                           <label key={country} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.countries.includes(country)}
//                               onChange={() => toggleFilter('countries', country)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {country}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Attributes */}
//                   <FilterSection title="Attributes">
//                     <div className="space-y-3">
//                       {/* New Products filter - Hide if already on new products page */}
//                       {availableFilters.hasNew && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.new}
//                             onChange={() => toggleFilter('new')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
//                         </label>
//                       )}
                      
//                       {availableFilters.hasHalal && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.halal}
//                             onChange={() => toggleFilter('halal')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
//                         </label>
//                       )}
//                       {availableFilters.hasVegan && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.vegan}
//                             onChange={() => toggleFilter('vegan')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
//                         </label>
//                       )}
//                       {availableFilters.hasKosher && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.kosher}
//                             onChange={() => toggleFilter('kosher')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
//                         </label>
//                       )}

//                       {availableFilters.hasFrozen && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.frozen}
//                             onChange={() => toggleFilter('frozen')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
//                         </label>
//                       )}
                      
//                       {availableFilters.hasSugar && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.sugar}
//                             onChange={() => toggleFilter('sugar')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
//                         </label>
//                       )}
//                     </div>
//                   </FilterSection>

//                   {/* Allergens */}
//                   {availableFilters.allergens.length > 0 && (
//                     <FilterSection title="Allergens">
//                       <div className="space-y-2">
//                         {availableFilters.allergens.map(allergen => (
//                           <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.allergens.includes(allergen)}
//                               onChange={() => toggleFilter('allergens', allergen)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {allergen}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Language */}
//                   {availableFilters.languages.length > 0 && (
//                     <FilterSection title="Language on the Label">
//                       <div className="space-y-2">
//                         {availableFilters.languages.map(language => (
//                           <label key={language} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.language.includes(language)}
//                               onChange={() => toggleFilter('language', language)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {language}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Unit */}
//                   {availableFilters.units.length > 0 && (
//                     <FilterSection title="Unit">
//                       <div className="space-y-2">
//                         {availableFilters.units.map(unit => (
//                           <label key={unit} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.unit.includes(unit)}
//                               onChange={() => toggleFilter('unit', unit)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}
//                 </div>
//               </div>

//               {/* Main Content */}
//               <div className="flex-1">
//                 {/* Toolbar */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     {!showFilters && (
//                       <button
//                         onClick={() => setShowFilters(true)}
//                         className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
//                       >
//                         <Filter size={20} />
//                         Show Filters
//                       </button>
//                     )}

//                     <div className="flex items-center gap-4 ml-auto">
//                       <span className="text-sm text-gray-600">Sort by:</span>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
//                       >
//                         <option value="default">Priority descending</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="name">Name A-Z</option>
//                         <option value="newest">Newest First</option>
//                       </select>
//                     </div>

//                     <div className="flex items-center gap-2 ml-4">
//                       <button
//                         onClick={() => setViewMode('grid')}
//                         className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <Grid size={20} />
//                       </button>
//                       <button
//                         onClick={() => setViewMode('list')}
//                         className={`p-2 rounded-lg ${viewMode === 'list' ? ' text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <List size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products Grid */}
//                 {filteredProducts.length > 0 ? (
//                   <div className={
//                     viewMode === 'grid' 
//                       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
//                       : "space-y-4"
//                   }>
//                     {filteredProducts.map(product => (
//                       <ProductCard 
//                         key={product.id} 
//                         product={product} 
//                         viewMode={viewMode}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 mb-4">
//                       <Filter size={64} className="mx-auto" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No products found
//                     </h3>
//                     <p className="text-gray-600 mb-4">
//                       Try adjusting your filters or search terms
//                     </p>
//                     <button
//                       onClick={clearAllFilters}
//                       className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }

// // ProductCard component remains the same...
// function ProductCard({ product, viewMode }) {
//   const hasDiscount = product.discountPrice && product.discountPrice < product.price;

//   const getCountryCode = (country) => {
//     const map = {
//       Thailand: "TH",
//       Korea: "KR",
//       India: "IN",
//       Japan: "JP",
//       China: "CN",
//       USA: "US",
//       Germany: "DE",
//       France: "FR",
//       Italy: "IT",
//       "United Kingdom": "GB",
//       Cambodia: "KH",
//     };
//     return map[country] || "UN";
//   };

//   // URL to product detail page
//   const detailLink = `/frontend/product/${product.slug}`;

//   // --- List View ---
//   if (viewMode === "list") {
//     return (
//       <Link href={detailLink}>
//         <div className="rounded-md border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer">
//           <div className="flex gap-6">
//             <div className="relative w-32 h-32">
//               <Image
//                 src={product.thumbImg}
//                 alt={product.name}
//                 fill
//                 className="object-contain rounded-md"
//               />
//             </div>

//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2  hover:text-lime-600 transition">
//                 {product.name}
//               </h3>

//               <div className="flex items-center gap-4 mb-3">
//                 <span className="text-2xl font-bold text-gray-900">
//                   ${hasDiscount ? product.discountPrice : product.price}
//                 </span>
//                 {hasDiscount && (
//                   <span className="text-lg text-gray-500 line-through">
//                     ${product.price}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <ReactCountryFlag
//                   countryCode={getCountryCode(product.country)}
//                   svg
//                   style={{ width: "1.5em", height: "1.5em" }}
//                 />
//                 <span>{product.country}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // --- Grid View ---
//   return (
//     <Link href={detailLink}>
//       <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group cursor-pointer border border-gray-100">
//         <div className="relative aspect-square">
//           <Image
//             src={product.thumbImg}
//             alt={product.name}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         </div>

//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <ReactCountryFlag
//               countryCode={getCountryCode(product.country)}
//               svg
//               style={{ width: "1.3em", height: "1.3em" }}
//             />
//             <span className="text-sm text-gray-600">{product.country}</span>
//           </div>

//           <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 truncate group-hover:text-lime-600 transition">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-2">
//             <span className="text-xl font-bold text-gray-900">
//               ${hasDiscount ? product.discountPrice : product.price}
//             </span>
//             {hasDiscount && (
//               <span className="text-sm text-gray-500 line-through">
//                 ${product.price}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }




// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Filter, Grid, List, ChevronDown, ChevronUp, X } from "lucide-react";
// import Image from "next/image";
// import ReactCountryFlag from "react-country-flag";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import Link from "next/link";
// import { apiService } from "../../components/apiService";


// export default function ProductsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params.slug || [];
  
//   const [showFilters, setShowFilters] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [sortBy, setSortBy] = useState('default');
//   const [expandedFilters, setExpandedFilters] = useState({});
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [selectedFilters, setSelectedFilters] = useState({
//     brands: [],
//     countries: [],
//     halal: false,
//     vegan: false,
//     new: false,
//     kosher: false,
//     allergens: [],
//     language: [],
//     frozen: false,
//     salt: false,
//     fat: false,
//     sugar: false,
//     unit: []
//   });

//   // Data states
//   const [products, setProducts] = useState([]);
//   const [maincategory, setMaincategory] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [
//         mainCategoriesData,
//         categoriesData,
//         subcategoriesData,
//         brandsData,
//         productsData
//       ] = await Promise.all([
//         apiService.getMainCategories(),
//         apiService.getCategories(),
//         apiService.getSubcategories(),
//         apiService.getBrands(),
//         apiService.getProducts()
//       ]);

//       // Ensure we always have arrays
//       setMaincategory(Array.isArray(mainCategoriesData) ? mainCategoriesData : []);
//       setCategories(Array.isArray(categoriesData) ? categoriesData : []);
//       setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
//       setBrands(Array.isArray(brandsData) ? brandsData : []);
//       setProducts(Array.isArray(productsData) ? productsData : []);
      
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       // Set empty arrays as fallback
//       setMaincategory([]);
//       setCategories([]);
//       setSubcategories([]);
//       setBrands([]);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to extract ID from different data structures
//   const extractId = (item) => {
//     if (!item) return null;
//     if (typeof item === 'string') return item;
//     if (item.$oid) return item.$oid;
//     if (item._id?.$oid) return item._id.$oid;
//     if (item._id) return item._id;
//     if (item.id) return item.id.toString();
//     return null;
//   };

//   // Determine current navigation context
//   const currentContext = useMemo(() => {
//     if (slug.length === 0) return { type: 'all', data: null };
    
//     const lastSlug = slug[slug.length - 1];
    
//     // Check if it's a new products route
//     if (slug[0] === 'new') {
//       return { type: 'new', data: { name: 'New Products', slug: 'new' } };
//     }
    
//     // Check if it's a brand route
//     if (slug[0] === 'brand') {
//       const brand = brands.find(b => b.slug === lastSlug);
//       if (brand) return { type: 'brand', data: brand };
//     }
    
//     // Check if it's a country route
//     if (slug[0] === 'country') {
//       const countryName = slug.slice(1).join(' ').replace(/-/g, ' ');
//       const formattedCountryName = countryName.replace(/\b\w/g, l => l.toUpperCase());
//       return { type: 'country', data: { name: formattedCountryName, slug: lastSlug } };
//     }
    
//     // Check main category
//     const mainCat = maincategory.find(cat => cat.slug === lastSlug);
//     if (mainCat) return { type: 'maincategory', data: mainCat };
    
//     // Check category
//     const cat = categories.find(c => c.slug === lastSlug);
//     if (cat) return { type: 'category', data: cat };
    
//     // Check subcategory
//     const subCat = subcategories.find(sc => sc.slug === lastSlug);
//     if (subCat) return { type: 'subcategory', data: subCat };
    
//     return { type: 'all', data: null };
//   }, [slug, maincategory, categories, subcategories, brands]);

//   // Get products based on current context
//   const contextProducts = useMemo(() => {
//     let filteredProducts = products;

//     // Filter products based on navigation context
//     if (currentContext.type === 'new') {
//       filteredProducts = filteredProducts.filter(product => 
//         product.NewProduct === true
//       );
//     } else if (currentContext.type === 'brand') {
//       const brandId = extractId(currentContext.data);
//       filteredProducts = filteredProducts.filter(product => {
//         const productBrandId = extractId(product.brand);
//         return productBrandId === brandId;
//       });
//     } else if (currentContext.type === 'country') {
//       filteredProducts = filteredProducts.filter(product => {
//         const productCountry = product.country?.name || product.country;
//         return productCountry?.toLowerCase() === currentContext.data.name.toLowerCase();
//       });
//     } else if (currentContext.type === 'maincategory') {
//       const mainId = extractId(currentContext.data);
//       filteredProducts = filteredProducts.filter(product => {
//         const productMainId = extractId(product.maincategory);
//         return productMainId === mainId;
//       });
//     } else if (currentContext.type === 'category') {
//       const catId = extractId(currentContext.data);
//       filteredProducts = filteredProducts.filter(product => {
//         const productCatId = extractId(product.category);
//         return productCatId === catId;
//       });
//     } else if (currentContext.type === 'subcategory') {
//       const subId = extractId(currentContext.data);
//       filteredProducts = filteredProducts.filter(product => {
//         const productSubId = extractId(product.subcategory);
//         return productSubId === subId;
//       });
//     }

//     return filteredProducts;
//   }, [products, currentContext]);

//   // Get available filters based on current context products
//   const availableFilters = useMemo(() => {
//     const brandSet = new Set();
//     const countrySet = new Set();
//     const allergenSet = new Set();
//     const languageSet = new Set();
//     const unitSet = new Set();

//     contextProducts.forEach(product => {
//       // Handle brands
//       if (product.brand) {
//         const brandId = extractId(product.brand);
//         if (brandId) brandSet.add(brandId);
//       }
      
//       // Handle countries
//       const country = product.country?.name || product.country;
//       if (country) countrySet.add(country);
      
//       // Handle allergens
//       if (product.Allergens) {
//         product.Allergens.split(',').forEach(allergen => 
//           allergenSet.add(allergen.trim())
//         );
//       }
      
//       // Handle languages
//       if (product.languageoflabels) {
//         languageSet.add(product.languageoflabels);
//       }
      
//       // Handle units
//       if (product.ml) unitSet.add('ml');
//       if (product.kg) unitSet.add('kg');
//     });

//     // Filter brands to only show those available in current context
//     const availableBrands = Array.from(brandSet).map(brandId => 
//       brands.find(b => extractId(b) === brandId)
//     ).filter(Boolean);

//     return {
//       brands: availableBrands,
//       countries: Array.from(countrySet),
//       allergens: Array.from(allergenSet),
//       languages: Array.from(languageSet),
//       units: Array.from(unitSet),
//       hasHalal: contextProducts.some(p => p.Halal),
//       hasVegan: contextProducts.some(p => p.Vegan),
//       hasNew: contextProducts.some(p => p.NewProduct) && currentContext.type !== 'new',
//       hasKosher: contextProducts.some(p => p.Kosher),
//       hasFrozen: contextProducts.some(p => p.Frozen),
//       hasSalt: contextProducts.some(p => p.Salt),
//       hasFat: contextProducts.some(p => p.Fat),
//       hasSugar: contextProducts.some(p => p.ofwhichSugars),
//     };
//   }, [contextProducts, currentContext.type, brands]);

//   // Filter products based on selected filters
//   const filteredProducts = useMemo(() => {
//     let filtered = contextProducts;

//     // Apply brand filter (only if not already filtered by brand route)
//     if (selectedFilters.brands.length > 0 && currentContext.type !== 'brand') {
//       filtered = filtered.filter(product => {
//         const productBrandId = extractId(product.brand);
//         return selectedFilters.brands.includes(productBrandId);
//       });
//     }

//     // Apply country filter (only if not already filtered by country route)
//     if (selectedFilters.countries.length > 0 && currentContext.type !== 'country') {
//       filtered = filtered.filter(product => {
//         const productCountry = product.country?.name || product.country;
//         return selectedFilters.countries.includes(productCountry);
//       });
//     }

//     // Apply new filter (only if not already on new products page)
//     if (selectedFilters.new && currentContext.type !== 'new') {
//       filtered = filtered.filter(product => product.NewProduct === true);
//     }

//     // Apply attribute filters
//     if (selectedFilters.halal) {
//       filtered = filtered.filter(product => product.Halal === true);
//     }
//     if (selectedFilters.vegan) {
//       filtered = filtered.filter(product => product.Vegan === true);
//     }
//     if (selectedFilters.kosher) {
//       filtered = filtered.filter(product => product.Kosher === true);
//     }
//     if (selectedFilters.frozen) {
//       filtered = filtered.filter(product => product.Frozen === true);
//     }
//     if (selectedFilters.salt) {
//       filtered = filtered.filter(product => product.Salt === true);
//     }
//     if (selectedFilters.fat) {
//       filtered = filtered.filter(product => product.Fat === true);
//     }
//     if (selectedFilters.sugar) {
//       filtered = filtered.filter(product => product.ofwhichSugars === true);
//     }

//     // Apply allergen filter
//     if (selectedFilters.allergens.length > 0) {
//       filtered = filtered.filter(product => 
//         product.Allergens && 
//         selectedFilters.allergens.some(allergen => 
//           product.Allergens.includes(allergen)
//         )
//       );
//     }

//     // Apply language filter
//     if (selectedFilters.language.length > 0) {
//       filtered = filtered.filter(product =>
//         selectedFilters.language.includes(product.languageoflabels)
//       );
//     }

//     // Apply unit filter
//     if (selectedFilters.unit.length > 0) {
//       filtered = filtered.filter(product =>
//         (selectedFilters.unit.includes('ml') && product.ml) ||
//         (selectedFilters.unit.includes('kg') && product.kg)
//       );
//     }

//     // Apply price filter
//     filtered = filtered.filter(product => {
//       const price = product.discountPrice || product.price;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });

//     // Apply sorting
//     switch (sortBy) {
//       case 'price-low':
//         filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
//         break;
//       case 'price-high':
//         filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
//         break;
//       case 'name':
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case 'newest':
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [contextProducts, selectedFilters, priceRange, sortBy, currentContext.type]);

//   const toggleFilter = (filterType, value) => {
//     setSelectedFilters(prev => {
//       if (filterType === 'brands' || filterType === 'countries' || filterType === 'allergens' || filterType === 'language' || filterType === 'unit') {
//         return {
//           ...prev,
//           [filterType]: prev[filterType].includes(value)
//             ? prev[filterType].filter(item => item !== value)
//             : [...prev[filterType], value]
//         };
//       } else {
//         return {
//           ...prev,
//           [filterType]: !prev[filterType]
//         };
//       }
//     });
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({
//       brands: [],
//       countries: [],
//       halal: false,
//       vegan: false,
//       new: false,
//       kosher: false,
//       allergens: [],
//       language: [],
//       frozen: false,
//       salt: false,
//       fat: false,
//       sugar: false,
//       unit: []
//     });
//     setPriceRange([0, 1000]);
//   };

//   const toggleFilterSection = (section) => {
//     setExpandedFilters(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const getBreadcrumbPath = () => {
//     const path = [{ name: 'Home', href: '/' }];
    
//     if (currentContext.type === 'all') {
//       path.push({ name: 'All Products', href: '/products' });
//     } else if (currentContext.type === 'new') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: 'New Products', 
//         href: `/products/new` 
//       });
//     } else if (currentContext.type === 'brand') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: currentContext.data.name, 
//         href: `/products/brand/${currentContext.data.slug}` 
//       });
//     } else if (currentContext.type === 'country') {
//       path.push({ name: 'All Products', href: '/products' });
//       path.push({ 
//         name: `${currentContext.data.name} Products`, 
//         href: `/products/country/${currentContext.data.slug}` 
//       });
//     } else {
//       path.push({ name: 'All Products', href: '/products' });
      
//       if (currentContext.type === 'maincategory') {
//         path.push({ 
//           name: currentContext.data.name, 
//           href: `/products/${currentContext.data.slug}` 
//         });
//       } else if (currentContext.type === 'category') {
//         const category = currentContext.data;
//         const mainCat = maincategory.find(mc => 
//           extractId(mc) === extractId(category.maincategory)
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: category.name, 
//           href: `/products/${mainCat?.slug}/${category.slug}` 
//         });
//       } else if (currentContext.type === 'subcategory') {
//         const subcategory = currentContext.data;
//         const category = categories.find(c => 
//           extractId(c) === extractId(subcategory.category)
//         );
//         const mainCat = maincategory.find(mc => 
//           extractId(mc) === extractId(category?.maincategory)
//         );
        
//         if (mainCat) {
//           path.push({ 
//             name: mainCat.name, 
//             href: `/products/${mainCat.slug}` 
//           });
//         }
//         if (category) {
//           path.push({ 
//             name: category.name, 
//             href: `/products/${mainCat?.slug}/${category.slug}` 
//           });
//         }
        
//         path.push({ 
//           name: subcategory.name, 
//           href: `/products/${mainCat?.slug}/${category?.slug}/${subcategory.slug}` 
//         });
//       }
//     }
    
//     return path;
//   };

//   const getPageTitle = () => {
//     switch (currentContext.type) {
//       case 'new':
//         return 'New Products';
//       case 'brand':
//         return currentContext.data.name;
//       case 'country':
//         return `${currentContext.data.name} Products`;
//       case 'maincategory':
//       case 'category':
//       case 'subcategory':
//         return currentContext.data.name;
//       default:
//         return 'All Products';
//     }
//   };

//   const getProductCountText = () => {
//     const total = filteredProducts.length;
//     const contextTotal = contextProducts.length;
    
//     let text = `Showing ${total} product${total !== 1 ? 's' : ''}`;
    
//     if (contextTotal !== total) {
//       text += ` (filtered from ${contextTotal} products)`;
//     }
    
//     if (currentContext.type === 'new') {
//       text += ` - All new arrivals`;
//     }
    
//     return text;
//   };

//  const getImageUrl = (imgPath) => {
//   if (!imgPath) return "/placeholder.png";
//   if (imgPath.startsWith('http')) return imgPath;
  
//   // Handle different path formats
//   let cleanPath = imgPath;
//   if (cleanPath.startsWith('/')) {
//     cleanPath = cleanPath.substring(1);
//   }
  
//   return `http://localhost:5000/${cleanPath}`;
// };



//   const FilterSection = ({ title, children, isExpanded = false }) => (
//     <div className="border-b border-gray-200 pb-4">
//       <button
//         onClick={() => toggleFilterSection(title)}
//         className="flex items-center justify-between w-full text-left"
//       >
//         <span className="font-semibold text-gray-900">{title}</span>
//         {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </button>
//       {(expandedFilters[title] !== false) && (
//         <div className="mt-3 space-y-2">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div>
//         <Navbar/>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading products...</p>
//           </div>
//         </div>
//         <Footer/>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar/>
//       <div>
//         <img src="/banner/newsletterbanner.webp" alt="Banner" />
//         <div className="min-h-screen bg-gray-50 py-6">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Breadcrumb */}
//             <nav className="mb-8">
//               <ol className="flex items-center space-x-2 text-sm text-gray-600">
//                 {getBreadcrumbPath().map((item, index) => (
//                   <li key={index} className="flex items-center">
//                     {index > 0 && <ChevronDown size={16} className="rotate-[-90deg] mx-2" />}
//                     <Link 
//                       href={item.href}
//                       className="hover:text-lime-600 transition-colors"
//                     >
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ol>
//             </nav>

//             {/* Header */}
//             <div className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 {getPageTitle()}
//               </h1>
//               <p className="text-gray-600">
//                 {getProductCountText()}
//               </p>
//             </div>

//             <div className="flex gap-8">
//               {/* Filter Sidebar */}
//               <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
//                   {/* Header */}
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={clearAllFilters}
//                         className="text-sm text-lime-600 hover:text-lime-700 font-medium"
//                       >
//                         Clear all
//                       </button>
//                       <button
//                         onClick={() => setShowFilters(false)}
//                         className="lg:hidden p-1 hover:bg-gray-100 rounded"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Price Range */}
//                   <FilterSection title="Price Range" isExpanded={true}>
//                     <div className="space-y-3">
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         value={priceRange[1]}
//                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
//                       />
//                       <div className="flex items-center justify-between text-sm text-gray-600">
//                         <span>${priceRange[0]}</span>
//                         <span>${priceRange[1]}</span>
//                       </div>
//                     </div>
//                   </FilterSection>

//                   {/* Brands - Hide if already on brand page */}
//                   {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
//                     <FilterSection title="Brands">
//                       <div className="space-y-2 max-h-48 overflow-y-auto">
//                         {availableFilters.brands.map(brand => (
//                           <label key={extractId(brand)} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.brands.includes(extractId(brand))}
//                               onChange={() => toggleFilter('brands', extractId(brand))}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {brand.name}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Countries - Hide if already on country page */}
//                   {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
//                     <FilterSection title="Country of Origin">
//                       <div className="space-y-2">
//                         {availableFilters.countries.map(country => (
//                           <label key={country} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.countries.includes(country)}
//                               onChange={() => toggleFilter('countries', country)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {country}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Attributes */}
//                   <FilterSection title="Attributes">
//                     <div className="space-y-3">
//                       {/* New Products filter - Hide if already on new products page */}
//                       {availableFilters.hasNew && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.new}
//                             onChange={() => toggleFilter('new')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
//                         </label>
//                       )}
                      
//                       {availableFilters.hasHalal && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.halal}
//                             onChange={() => toggleFilter('halal')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
//                         </label>
//                       )}
//                       {availableFilters.hasVegan && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.vegan}
//                             onChange={() => toggleFilter('vegan')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
//                         </label>
//                       )}
//                       {availableFilters.hasKosher && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.kosher}
//                             onChange={() => toggleFilter('kosher')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
//                         </label>
//                       )}

//                       {availableFilters.hasFrozen && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.frozen}
//                             onChange={() => toggleFilter('frozen')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
//                         </label>
//                       )}
                      
//                       {availableFilters.hasSugar && (
//                         <label className="flex items-center gap-3 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.sugar}
//                             onChange={() => toggleFilter('sugar')}
//                             className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
//                         </label>
//                       )}
//                     </div>
//                   </FilterSection>

//                   {/* Allergens */}
//                   {availableFilters.allergens.length > 0 && (
//                     <FilterSection title="Allergens">
//                       <div className="space-y-2">
//                         {availableFilters.allergens.map(allergen => (
//                           <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.allergens.includes(allergen)}
//                               onChange={() => toggleFilter('allergens', allergen)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {allergen}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Language */}
//                   {availableFilters.languages.length > 0 && (
//                     <FilterSection title="Language on the Label">
//                       <div className="space-y-2">
//                         {availableFilters.languages.map(language => (
//                           <label key={language} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.language.includes(language)}
//                               onChange={() => toggleFilter('language', language)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {language}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}

//                   {/* Unit */}
//                   {availableFilters.units.length > 0 && (
//                     <FilterSection title="Unit">
//                       <div className="space-y-2">
//                         {availableFilters.units.map(unit => (
//                           <label key={unit} className="flex items-center gap-3 cursor-pointer group">
//                             <input
//                               type="checkbox"
//                               checked={selectedFilters.unit.includes(unit)}
//                               onChange={() => toggleFilter('unit', unit)}
//                               className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//                             />
//                             <span className="text-sm text-gray-700 group-hover:text-gray-900">
//                               {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </FilterSection>
//                   )}
//                 </div>
//               </div>

//               {/* Main Content */}
//               <div className="flex-1">
//                 {/* Toolbar */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     {!showFilters && (
//                       <button
//                         onClick={() => setShowFilters(true)}
//                         className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
//                       >
//                         <Filter size={20} />
//                         Show Filters
//                       </button>
//                     )}

//                     <div className="flex items-center gap-4 ml-auto">
//                       <span className="text-sm text-gray-600">Sort by:</span>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
//                       >
//                         <option value="default">Priority descending</option>
//                         <option value="price-low">Price: Low to High</option>
//                         <option value="price-high">Price: High to Low</option>
//                         <option value="name">Name A-Z</option>
//                         <option value="newest">Newest First</option>
//                       </select>
//                     </div>

//                     <div className="flex items-center gap-2 ml-4">
//                       <button
//                         onClick={() => setViewMode('grid')}
//                         className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <Grid size={20} />
//                       </button>
//                       <button
//                         onClick={() => setViewMode('list')}
//                         className={`p-2 rounded-lg ${viewMode === 'list' ? ' text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         <List size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products Grid */}
//                 {filteredProducts.length > 0 ? (
//                   <div className={
//                     viewMode === 'grid' 
//                       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
//                       : "space-y-4"
//                   }>
//                     {filteredProducts.map(product => (
//                       <ProductCard 
//                         key={extractId(product)} 
//                         product={product} 
//                         viewMode={viewMode}
//                         getImageUrl={getImageUrl}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 mb-4">
//                       <Filter size={64} className="mx-auto" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No products found
//                     </h3>
//                     <p className="text-gray-600 mb-4">
//                       Try adjusting your filters or search terms
//                     </p>
//                     <button
//                       onClick={clearAllFilters}
//                       className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }

// // Updated ProductCard component
// // Updated ProductCard component with better error handling
// function ProductCard({ product, viewMode, getImageUrl }) {
//   const hasDiscount = product.discountPrice && product.discountPrice < product.price;

//   const getCountryCode = (country) => {
//     const countryName = typeof country === 'string' ? country : country?.name;
//     const map = {
//       Thailand: "TH",
//       Korea: "KR",
//       India: "IN",
//       Japan: "JP",
//       China: "CN",
//       USA: "US",
//       Germany: "DE",
//       France: "FR",
//       Italy: "IT",
//       "United Kingdom": "GB",
//       Cambodia: "KH",
//       "test country": "US",
//     };
//     return map[countryName] || "UN";
//   };

//   // URL to product detail page
//   const detailLink = `/frontend/product/${product.slug}`;

//   // Extract country name
//   const countryName = product.country?.name || product.country;

//   // Safe image URL handling
//   const imageUrl = getImageUrl(product.thumbImg);

//   // --- List View ---
//   if (viewMode === "list") {
//     return (
//       <Link href={detailLink}>
//         <div className="rounded-md border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer">
//           <div className="flex gap-6">
//             <div className="relative w-32 h-32">
//               <Image
//                 src={imageUrl}
//                 alt={product.name || 'Product image'}
//                 fill
//                 className="object-contain rounded-md"
//                 onError={(e) => {
//                   e.target.src = '/placeholder.png';
//                 }}
//               />
//             </div>

//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-lime-600 transition">
//                 {product.name || 'Unnamed Product'}
//               </h3>

//               <div className="flex items-center gap-4 mb-3">
//                 <span className="text-2xl font-bold text-gray-900">
//                   ${hasDiscount ? product.discountPrice : product.price}
//                 </span>
//                 {hasDiscount && (
//                   <span className="text-lg text-gray-500 line-through">
//                     ${product.price}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <ReactCountryFlag
//                   countryCode={getCountryCode(countryName)}
//                   svg
//                   style={{ width: "1.5em", height: "1.5em" }}
//                 />
//                 <span>{countryName || 'Unknown Country'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // --- Grid View ---
//   return (
//     <Link href={detailLink}>
//       <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group cursor-pointer border border-gray-100">
//         <div className="relative aspect-square bg-gray-100">
//           <Image
//             src={imageUrl}
//             alt={product.name || 'Product image'}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => {
//               e.target.src = '/placeholder.png';
//             }}
//           />
//         </div>

//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-1">
//             <ReactCountryFlag
//               countryCode={getCountryCode(countryName)}
//               svg
//               style={{ width: "1.3em", height: "1.3em" }}
//             />
//             <span className="text-sm text-gray-600">{countryName || 'Unknown Country'}</span>
//           </div>

//           <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 truncate group-hover:text-lime-600 transition">
//             {product.name || 'Unnamed Product'}
//           </h3>

//           <div className="flex items-center gap-2">
//             <span className="text-xl font-bold text-gray-900">
//               ${hasDiscount ? product.discountPrice : product.price}
//             </span>
//             {hasDiscount && (
//               <span className="text-sm text-gray-500 line-through">
//                 ${product.price}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }




"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Filter, Grid, List, ChevronDown, ChevronUp, X, Menu } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { apiService } from "../../components/apiService";

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug || [];
  
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [expandedFilters, setExpandedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    countries: [],
    halal: false,
    vegan: false,
    new: false,
    kosher: false,
    allergens: [],
    language: [],
    frozen: false,
    salt: false,
    fat: false,
    sugar: false,
    unit: []
  });

  // Mobile specific states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  // Data states
  const [products, setProducts] = useState([]);
  const [maincategory, setMaincategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        mainCategoriesData,
        categoriesData,
        subcategoriesData,
        brandsData,
        productsData
      ] = await Promise.all([
        apiService.getMainCategories(),
        apiService.getCategories(),
        apiService.getSubcategories(),
        apiService.getBrands(),
        apiService.getProducts()
      ]);

      // Ensure we always have arrays
      setMaincategory(Array.isArray(mainCategoriesData) ? mainCategoriesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays as fallback
      setMaincategory([]);
      setCategories([]);
      setSubcategories([]);
      setBrands([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract ID from different data structures
  const extractId = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (item.$oid) return item.$oid;
    if (item._id?.$oid) return item._id.$oid;
    if (item._id) return item._id;
    if (item.id) return item.id.toString();
    return null;
  };

  // Determine current navigation context
  const currentContext = useMemo(() => {
    if (slug.length === 0) return { type: 'all', data: null };
    
    const lastSlug = slug[slug.length - 1];
    
    // Check if it's a new products route
    if (slug[0] === 'new') {
      return { type: 'new', data: { name: 'New Products', slug: 'new' } };
    }
    
    // Check if it's a brand route
    if (slug[0] === 'brand') {
      const brand = brands.find(b => b.slug === lastSlug);
      if (brand) return { type: 'brand', data: brand };
    }
    
    // Check if it's a country route
    if (slug[0] === 'country') {
      const countryName = slug.slice(1).join(' ').replace(/-/g, ' ');
      const formattedCountryName = countryName.replace(/\b\w/g, l => l.toUpperCase());
      return { type: 'country', data: { name: formattedCountryName, slug: lastSlug } };
    }
    
    // Check main category
    const mainCat = maincategory.find(cat => cat.slug === lastSlug);
    if (mainCat) return { type: 'maincategory', data: mainCat };
    
    // Check category
    const cat = categories.find(c => c.slug === lastSlug);
    if (cat) return { type: 'category', data: cat };
    
    // Check subcategory
    const subCat = subcategories.find(sc => sc.slug === lastSlug);
    if (subCat) return { type: 'subcategory', data: subCat };
    
    return { type: 'all', data: null };
  }, [slug, maincategory, categories, subcategories, brands]);

  // Get products based on current context
  const contextProducts = useMemo(() => {
    let filteredProducts = products;

    // Filter products based on navigation context
    if (currentContext.type === 'new') {
      filteredProducts = filteredProducts.filter(product => 
        product.NewProduct === true
      );
    } else if (currentContext.type === 'brand') {
      const brandId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productBrandId = extractId(product.brand);
        return productBrandId === brandId;
      });
    } else if (currentContext.type === 'country') {
      filteredProducts = filteredProducts.filter(product => {
        const productCountry = product.country?.name || product.country;
        return productCountry?.toLowerCase() === currentContext.data.name.toLowerCase();
      });
    } else if (currentContext.type === 'maincategory') {
      const mainId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productMainId = extractId(product.maincategory);
        return productMainId === mainId;
      });
    } else if (currentContext.type === 'category') {
      const catId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productCatId = extractId(product.category);
        return productCatId === catId;
      });
    } else if (currentContext.type === 'subcategory') {
      const subId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productSubId = extractId(product.subcategory);
        return productSubId === subId;
      });
    }

    return filteredProducts;
  }, [products, currentContext]);

  // Get available filters based on current context products
  const availableFilters = useMemo(() => {
    const brandSet = new Set();
    const countrySet = new Set();
    const allergenSet = new Set();
    const languageSet = new Set();
    const unitSet = new Set();

    contextProducts.forEach(product => {
      // Handle brands
      if (product.brand) {
        const brandId = extractId(product.brand);
        if (brandId) brandSet.add(brandId);
      }
      
      // Handle countries
      const country = product.country?.name || product.country;
      if (country) countrySet.add(country);
      
      // Handle allergens
      if (product.Allergens) {
        product.Allergens.split(',').forEach(allergen => 
          allergenSet.add(allergen.trim())
        );
      }
      
      // Handle languages
      if (product.languageoflabels) {
        languageSet.add(product.languageoflabels);
      }
      
      // Handle units
      if (product.ml) unitSet.add('ml');
      if (product.kg) unitSet.add('kg');
    });

    // Filter brands to only show those available in current context
    const availableBrands = Array.from(brandSet).map(brandId => 
      brands.find(b => extractId(b) === brandId)
    ).filter(Boolean);

    return {
      brands: availableBrands,
      countries: Array.from(countrySet),
      allergens: Array.from(allergenSet),
      languages: Array.from(languageSet),
      units: Array.from(unitSet),
      hasHalal: contextProducts.some(p => p.Halal),
      hasVegan: contextProducts.some(p => p.Vegan),
      hasNew: contextProducts.some(p => p.NewProduct) && currentContext.type !== 'new',
      hasKosher: contextProducts.some(p => p.Kosher),
      hasFrozen: contextProducts.some(p => p.Frozen),
      hasSalt: contextProducts.some(p => p.Salt),
      hasFat: contextProducts.some(p => p.Fat),
      hasSugar: contextProducts.some(p => p.ofwhichSugars),
    };
  }, [contextProducts, currentContext.type, brands]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    let filtered = contextProducts;

    // Apply brand filter (only if not already filtered by brand route)
    if (selectedFilters.brands.length > 0 && currentContext.type !== 'brand') {
      filtered = filtered.filter(product => {
        const productBrandId = extractId(product.brand);
        return selectedFilters.brands.includes(productBrandId);
      });
    }

    // Apply country filter (only if not already filtered by country route)
    if (selectedFilters.countries.length > 0 && currentContext.type !== 'country') {
      filtered = filtered.filter(product => {
        const productCountry = product.country?.name || product.country;
        return selectedFilters.countries.includes(productCountry);
      });
    }

    // Apply new filter (only if not already on new products page)
    if (selectedFilters.new && currentContext.type !== 'new') {
      filtered = filtered.filter(product => product.NewProduct === true);
    }

    // Apply attribute filters
    if (selectedFilters.halal) {
      filtered = filtered.filter(product => product.Halal === true);
    }
    if (selectedFilters.vegan) {
      filtered = filtered.filter(product => product.Vegan === true);
    }
    if (selectedFilters.kosher) {
      filtered = filtered.filter(product => product.Kosher === true);
    }
    if (selectedFilters.frozen) {
      filtered = filtered.filter(product => product.Frozen === true);
    }
    if (selectedFilters.salt) {
      filtered = filtered.filter(product => product.Salt === true);
    }
    if (selectedFilters.fat) {
      filtered = filtered.filter(product => product.Fat === true);
    }
    if (selectedFilters.sugar) {
      filtered = filtered.filter(product => product.ofwhichSugars === true);
    }

    // Apply allergen filter
    if (selectedFilters.allergens.length > 0) {
      filtered = filtered.filter(product => 
        product.Allergens && 
        selectedFilters.allergens.some(allergen => 
          product.Allergens.includes(allergen)
        )
      );
    }

    // Apply language filter
    if (selectedFilters.language.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.language.includes(product.languageoflabels)
      );
    }

    // Apply unit filter
    if (selectedFilters.unit.length > 0) {
      filtered = filtered.filter(product =>
        (selectedFilters.unit.includes('ml') && product.ml) ||
        (selectedFilters.unit.includes('kg') && product.kg)
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filtered;
  }, [contextProducts, selectedFilters, priceRange, sortBy, currentContext.type]);

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => {
      if (filterType === 'brands' || filterType === 'countries' || filterType === 'allergens' || filterType === 'language' || filterType === 'unit') {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
        };
      } else {
        return {
          ...prev,
          [filterType]: !prev[filterType]
        };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      countries: [],
      halal: false,
      vegan: false,
      new: false,
      kosher: false,
      allergens: [],
      language: [],
      frozen: false,
      salt: false,
      fat: false,
      sugar: false,
      unit: []
    });
    setPriceRange([0, 1000]);
    setMobileFiltersOpen(false);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getBreadcrumbPath = () => {
    const path = [{ name: 'Home', href: '/' }];
    
    if (currentContext.type === 'all') {
      path.push({ name: 'All Products', href: '/products' });
    } else if (currentContext.type === 'new') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: 'New Products', 
        href: `/products/new` 
      });
    } else if (currentContext.type === 'brand') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: currentContext.data.name, 
        href: `/products/brand/${currentContext.data.slug}` 
      });
    } else if (currentContext.type === 'country') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: `${currentContext.data.name} Products`, 
        href: `/products/country/${currentContext.data.slug}` 
      });
    } else {
      path.push({ name: 'All Products', href: '/products' });
      
      if (currentContext.type === 'maincategory') {
        path.push({ 
          name: currentContext.data.name, 
          href: `/products/${currentContext.data.slug}` 
        });
      } else if (currentContext.type === 'category') {
        const category = currentContext.data;
        const mainCat = maincategory.find(mc => 
          extractId(mc) === extractId(category.maincategory)
        );
        
        if (mainCat) {
          path.push({ 
            name: mainCat.name, 
            href: `/products/${mainCat.slug}` 
          });
        }
        
        path.push({ 
          name: category.name, 
          href: `/products/${mainCat?.slug}/${category.slug}` 
        });
      } else if (currentContext.type === 'subcategory') {
        const subcategory = currentContext.data;
        const category = categories.find(c => 
          extractId(c) === extractId(subcategory.category)
        );
        const mainCat = maincategory.find(mc => 
          extractId(mc) === extractId(category?.maincategory)
        );
        
        if (mainCat) {
          path.push({ 
            name: mainCat.name, 
            href: `/products/${mainCat.slug}` 
          });
        }
        if (category) {
          path.push({ 
            name: category.name, 
            href: `/products/${mainCat?.slug}/${category.slug}` 
          });
        }
        
        path.push({ 
          name: subcategory.name, 
          href: `/products/${mainCat?.slug}/${category?.slug}/${subcategory.slug}` 
        });
      }
    }
    
    return path;
  };

  const getPageTitle = () => {
    switch (currentContext.type) {
      case 'new':
        return 'New Products';
      case 'brand':
        return currentContext.data.name;
      case 'country':
        return `${currentContext.data.name} Products`;
      case 'maincategory':
      case 'category':
      case 'subcategory':
        return currentContext.data.name;
      default:
        return 'All Products';
    }
  };

  const getProductCountText = () => {
    const total = filteredProducts.length;
    const contextTotal = contextProducts.length;
    
    let text = `Showing ${total} product${total !== 1 ? 's' : ''}`;
    
    if (contextTotal !== total) {
      text += ` (filtered from ${contextTotal} products)`;
    }
    
    if (currentContext.type === 'new') {
      text += ` - All new arrivals`;
    }
    
    return text;
  };

 const getImageUrl = (imgPath) => {
  if (!imgPath) return "/placeholder.png";
  if (imgPath.startsWith('http')) return imgPath;
  
  // Handle different path formats
  let cleanPath = imgPath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `http://localhost:5000/${cleanPath}`;
};

  const FilterSection = ({ title, children, isExpanded = false }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleFilterSection(title)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {(expandedFilters[title] !== false) && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  // Mobile Filter Tabs Component
  const MobileFilterTabs = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveFilterTab('all')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeFilterTab === 'all' 
              ? 'border-lime-500 text-lime-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Filters
        </button>
        {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
          <button
            onClick={() => setActiveFilterTab('brands')}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeFilterTab === 'brands' 
                ? 'border-lime-500 text-lime-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Brands
          </button>
        )}
        {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
          <button
            onClick={() => setActiveFilterTab('countries')}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeFilterTab === 'countries' 
                ? 'border-lime-500 text-lime-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Countries
          </button>
        )}
        <button
          onClick={() => setActiveFilterTab('attributes')}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeFilterTab === 'attributes' 
              ? 'border-lime-500 text-lime-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Attributes
        </button>
        {availableFilters.allergens.length > 0 && (
          <button
            onClick={() => setActiveFilterTab('allergens')}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeFilterTab === 'allergens' 
                ? 'border-lime-500 text-lime-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Allergens
          </button>
        )}
      </div>
    </div>
  );

  // Mobile Filter Content Component
  const MobileFilterContent = () => (
  <div className="lg:hidden p-4 pb-32 h-screen flex flex-col">
    {/* Scrollable content container */}
    <div className="flex-1 overflow-y-auto">
      {/* Price Range - Always visible */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
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
      {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (activeFilterTab === 'all' || activeFilterTab === 'brands') && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableFilters.brands.map(brand => (
              <label key={extractId(brand)} className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(extractId(brand))}
                  onChange={() => toggleFilter('brands', extractId(brand))}
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
      {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (activeFilterTab === 'all' || activeFilterTab === 'countries') && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Country of Origin</h3>
          <div className="space-y-2">
            {availableFilters.countries.map(country => (
              <label key={country} className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.countries.includes(country)}
                  onChange={() => toggleFilter('countries', country)}
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
      {(activeFilterTab === 'all' || activeFilterTab === 'attributes') && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Attributes</h3>
          <div className="space-y-3">
            {/* New Products filter - Hide if already on new products page */}
            {availableFilters.hasNew && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.new}
                  onChange={() => toggleFilter('new')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
              </label>
            )}
            
            {availableFilters.hasHalal && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.halal}
                  onChange={() => toggleFilter('halal')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
              </label>
            )}
            {availableFilters.hasVegan && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.vegan}
                  onChange={() => toggleFilter('vegan')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
              </label>
            )}
            {availableFilters.hasKosher && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.kosher}
                  onChange={() => toggleFilter('kosher')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
              </label>
            )}

            {availableFilters.hasFrozen && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.frozen}
                  onChange={() => toggleFilter('frozen')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
              </label>
            )}
            
            {availableFilters.hasSugar && (
              <label className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.sugar}
                  onChange={() => toggleFilter('sugar')}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Allergens */}
      {availableFilters.allergens.length > 0 && (activeFilterTab === 'all' || activeFilterTab === 'allergens') && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Allergens</h3>
          <div className="space-y-2">
            {availableFilters.allergens.map(allergen => (
              <label key={allergen} className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.allergens.includes(allergen)}
                  onChange={() => toggleFilter('allergens', allergen)}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {allergen}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Language */}
      {availableFilters.languages.length > 0 && activeFilterTab === 'all' && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Language on the Label</h3>
          <div className="space-y-2">
            {availableFilters.languages.map(language => (
              <label key={language} className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.language.includes(language)}
                  onChange={() => toggleFilter('language', language)}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {language}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Unit */}
      {availableFilters.units.length > 0 && activeFilterTab === 'all' && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Unit</h3>
          <div className="space-y-2">
            {availableFilters.units.map(unit => (
              <label key={unit} className="flex items-center gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.unit.includes(unit)}
                  onChange={() => toggleFilter('unit', unit)}
                  className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

  if (loading) {
    return (
      <div>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div>
        <img src="/banner/newsletterbanner.webp" alt="Banner" className="w-full h-auto" />
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-600 flex-wrap">
                {getBreadcrumbPath().map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronDown size={16} className="rotate-[-90deg] mx-2" />}
                    <Link 
                      href={item.href}
                      className="hover:text-lime-600 transition-colors text-xs sm:text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {getProductCountText()}
              </p>
            </div>

            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <div className={`hidden lg:block ${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price Range */}
                  <FilterSection title="Price Range" isExpanded={true}>
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
                  </FilterSection>

                  {/* Brands - Hide if already on brand page */}
                  {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
                    <FilterSection title="Brands">
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableFilters.brands.map(brand => (
                          <label key={extractId(brand)} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.brands.includes(extractId(brand))}
                              onChange={() => toggleFilter('brands', extractId(brand))}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {brand.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Countries - Hide if already on country page */}
                  {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
                    <FilterSection title="Country of Origin">
                      <div className="space-y-2">
                        {availableFilters.countries.map(country => (
                          <label key={country} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.countries.includes(country)}
                              onChange={() => toggleFilter('countries', country)}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {country}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Attributes */}
                  <FilterSection title="Attributes">
                    <div className="space-y-3">
                      {/* New Products filter - Hide if already on new products page */}
                      {availableFilters.hasNew && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.new}
                            onChange={() => toggleFilter('new')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
                        </label>
                      )}
                      
                      {availableFilters.hasHalal && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.halal}
                            onChange={() => toggleFilter('halal')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
                        </label>
                      )}
                      {availableFilters.hasVegan && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.vegan}
                            onChange={() => toggleFilter('vegan')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
                        </label>
                      )}
                      {availableFilters.hasKosher && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.kosher}
                            onChange={() => toggleFilter('kosher')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
                        </label>
                      )}

                      {availableFilters.hasFrozen && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.frozen}
                            onChange={() => toggleFilter('frozen')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
                        </label>
                      )}
                      
                      {availableFilters.hasSugar && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters.sugar}
                            onChange={() => toggleFilter('sugar')}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
                        </label>
                      )}
                    </div>
                  </FilterSection>

                  {/* Allergens */}
                  {availableFilters.allergens.length > 0 && (
                    <FilterSection title="Allergens">
                      <div className="space-y-2">
                        {availableFilters.allergens.map(allergen => (
                          <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.allergens.includes(allergen)}
                              onChange={() => toggleFilter('allergens', allergen)}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {allergen}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Language */}
                  {availableFilters.languages.length > 0 && (
                    <FilterSection title="Language on the Label">
                      <div className="space-y-2">
                        {availableFilters.languages.map(language => (
                          <label key={language} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.language.includes(language)}
                              onChange={() => toggleFilter('language', language)}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {language}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}

                  {/* Unit */}
                  {availableFilters.units.length > 0 && (
                    <FilterSection title="Unit">
                      <div className="space-y-2">
                        {availableFilters.units.map(unit => (
                          <label key={unit} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.unit.includes(unit)}
                              onChange={() => toggleFilter('unit', unit)}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden flex items-center gap-4">
                      <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm"
                      >
                        <Filter size={18} />
                        Filters
                        {Object.values(selectedFilters).flat().filter(Boolean).length > 0 && (
                          <span className="bg-white text-lime-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {Object.values(selectedFilters).flat().filter(Boolean).length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Desktop Filter Toggle */}
                    {!showFilters && (
                      <button
                        onClick={() => setShowFilters(true)}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                      >
                        <Filter size={20} />
                        Show Filters
                      </button>
                    )}

                    <div className="flex items-center gap-4 ml-auto flex-wrap">
                      <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 min-w-[140px]"
                      >
                        <option value="default">Priority descending</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? ' text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }>
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={extractId(product)} 
                        product={product} 
                        viewMode={viewMode}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Filter size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-full sm:w-96 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <MobileFilterTabs />

            {/* Filter Content */}
            <div className="flex-1 overflow-hidden">
              <MobileFilterContent />
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-lime-500 text-white py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Updated ProductCard component with mobile responsiveness
function ProductCard({ product, viewMode, getImageUrl }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const getCountryCode = (country) => {
    const countryName = typeof country === 'string' ? country : country?.name;
    const map = {
      Thailand: "TH",
      Korea: "KR",
      India: "IN",
      Japan: "JP",
      China: "CN",
      USA: "US",
      Germany: "DE",
      France: "FR",
      Italy: "IT",
      "United Kingdom": "GB",
      Cambodia: "KH",
      "test country": "US",
    };
    return map[countryName] || "UN";
  };

  // URL to product detail page
  const detailLink = `/frontend/product/${product.slug}`;

  // Extract country name
  const countryName = product.country?.name || product.country;

  // Safe image URL handling
  const imageUrl = getImageUrl(product.thumbImg);

  // --- List View ---
  if (viewMode === "list") {
    return (
      <Link href={detailLink}>
        <div className="rounded-lg border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer bg-white">
          <div className="flex gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={product.name || 'Product image'}
                fill
                className="object-contain rounded-md"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-lime-600 transition line-clamp-2">
                {product.name || 'Unnamed Product'}
              </h3>

              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xl font-bold text-gray-900">
                  ${hasDiscount ? product.discountPrice : product.price}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-lg text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ReactCountryFlag
                  countryCode={getCountryCode(countryName)}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                <span className="truncate">{countryName || 'Unknown Country'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // --- Grid View ---
  return (
    <Link href={detailLink}>
      <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group cursor-pointer border border-gray-100 bg-white">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name || 'Product image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <ReactCountryFlag
              countryCode={getCountryCode(countryName)}
              svg
              style={{ width: "1.3em", height: "1.3em" }}
            />
            <span className="text-xs sm:text-sm text-gray-600 truncate">{countryName || 'Unknown Country'}</span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-lime-600 transition leading-tight">
            {product.name || 'Unnamed Product'}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ${hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}