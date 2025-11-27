// "use client";
// import { useEffect, useState } from "react";
// import { Search, Mail, Phone } from "lucide-react";
// import Image from "next/image";

// export default function Navbar() {
//   const [query, setQuery] = useState("");
//    const [scrolled, setScrolled] = useState(false);

//    // Navbar scroll effect
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <header className={`w-full fixed top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/40 shadow-md' : 'bg-transparent'}`}>
//       {/* Top Info Bar */}
//       <div className="bg-gray-900 text-white text-sm py-2 px-6 flex flex-wrap items-center justify-between">
//         <div className="flex items-center gap-6 flex-wrap">
//           <span>✔ Import and export of Asian food and non-food</span>
//           <span>✔ Authentic food</span>
//           <span>✔ Fast delivery</span>
//           <span>✔ Order quickly</span>
//           <span>✔ EU law conform products</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <Phone size={16} />
//           <Mail size={16} />
//           <a href="#" className="hover:text-lime-400 transition">About us</a>
//           <Image
//             src="https://flagcdn.com/us.svg"
//             alt="US Flag"
//             width={20}
//             height={14}
//             className="rounded-sm"
//           />
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <nav className="flex flex-wrap items-center justify-between bg-white px-8 py-4 shadow-sm">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-semibold text-gray-800">
//             <span className="font-serif">Beagley</span>{" "}
//             <span className="font-serif text-lime-600">Copperman</span>
//           </span>
//         </div>

//         {/* Center Links */}
//         <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
//           <a href="#" className="hover:text-lime-600 transition">All products</a>
//           <a href="#" className="hover:text-lime-600 transition">Country of origin</a>
//           <a href="#" className="hover:text-lime-600 transition">All brands</a>
//           <a
//             href="#"
//             className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
//           >
//             New
//           </a>
//         </div>

//         {/* Search + Buttons */}
//         <div className="flex items-center gap-3 mt-3 md:mt-0">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 w-[400px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500"
//             />
//             <Search
//               className="absolute left-3 top-2.5 text-gray-500"
//               size={18}
//             />
//           </div>

//           <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
//             Login
//           </button>
//           <button className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition">
//             Register
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// }





// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import { Search } from "lucide-react";
// import { brands, categories, maincategory, subcategories } from "@/public/assets";


// export default function Navbar() {
//   const [showMegaMenu, setShowMegaMenu] = useState(false);
//   const [hoveredMainCategory, setHoveredMainCategory] = useState(null);

//   const handleMainCategoryHover = (id) => {
//     setHoveredMainCategory(id);
//   };

//   const getRelatedCategories = (mainId) =>
//     categories.filter((cat) => cat.maincategory?.includes(String(mainId)));

//   const getRelatedSubcategories = (mainId) =>
//     subcategories.filter((sub) =>
//       sub.category?.includes(String(mainId))
//     );

//   const getRelatedBrands = (mainId) =>
//     brands.filter((b) => b.maincategory?.includes(String(mainId)));

//   return (
//     <header className="w-full fixed top-0 z-50 bg-white shadow-md">
//       <nav className="flex items-center justify-between px-10 py-4">
//         {/* Logo */}
//         <div className="text-2xl font-serif text-gray-800">
//           Beagley <span className="text-lime-600">Copperman</span>
//         </div>

//         {/* Links */}
//         <div
//           className="relative"
//           onMouseEnter={() => setShowMegaMenu(true)}
//           onMouseLeave={() => {
//             setShowMegaMenu(false);
//             setHoveredMainCategory(null);
//           }}
//         >
//           <button className="text-gray-700 font-medium hover:text-lime-600 transition">
//             All Products
//           </button>

//           {/* Mega Menu */}
//           {showMegaMenu && (
//             <div className="absolute left-0 top-full bg-white shadow-lg w-[1200px] p-6 flex gap-6 mt-3 rounded-xl border">
//               {/* Left Sidebar - Main Categories */}
//               <div className="w-1/4 border-r overflow-y-auto">
//                 {maincategory.map((main) => (
//                   <div
//                     key={main.id}
//                     onMouseEnter={() => handleMainCategoryHover(main.id)}
//                     className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-lime-100 transition ${
//                       hoveredMainCategory === main.id ? "bg-lime-50" : ""
//                     }`}
//                   >
//                     <Image
//                       src={main.img}
//                       alt={main.name}
//                       width={40}
//                       height={40}
//                       className="rounded-md object-cover"
//                     />
//                     <span className="font-semibold text-gray-700">{main.name}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Right Content */}
//               <div className="w-3/4 grid grid-cols-3 gap-8">
//                 {/* Categories */}
//                 <div>
//                   <h3 className="font-bold text-gray-800 mb-3 text-lg">Categories</h3>
//                   <div className="flex flex-col gap-2">
//                     {hoveredMainCategory &&
//                       getRelatedCategories(hoveredMainCategory).map((cat) => (
//                         <div key={cat.id} className="flex items-center gap-2 hover:text-lime-600 cursor-pointer">
//                           <Image
//                             src={cat.img}
//                             alt={cat.name}
//                             width={30}
//                             height={30}
//                             className="rounded"
//                           />
//                           {cat.name}
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 {/* Subcategories */}
//                 <div>
//                   <h3 className="font-bold text-gray-800 mb-3 text-lg">Subcategories</h3>
//                   <div className="flex flex-col gap-2">
//                     {hoveredMainCategory &&
//                       getRelatedSubcategories(hoveredMainCategory).map((sub) => (
//                         <div key={sub.id} className="flex items-center gap-2 hover:text-lime-600 cursor-pointer">
//                           <Image
//                             src={sub.img}
//                             alt={sub.name}
//                             width={30}
//                             height={30}
//                             className="rounded"
//                           />
//                           {sub.name}
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 {/* Brands */}
//                 <div>
//                   <h3 className="font-bold text-gray-800 mb-3 text-lg">Brands</h3>
//                   <div className="grid grid-cols-2 gap-3">
//                     {hoveredMainCategory &&
//                       getRelatedBrands(hoveredMainCategory).map((b) => (
//                         <div
//                           key={b.id}
//                           className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
//                         >
//                           <Image
//                             src={b.img}
//                             alt={b.name}
//                             width={60}
//                             height={60}
//                             className="rounded-lg border"
//                           />
//                           <span className="text-sm font-medium text-gray-700 mt-1">
//                             {b.name}
//                           </span>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Search + Buttons */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               className="pl-10 pr-4 py-2 w-[300px] border rounded-full focus:ring-2 focus:ring-lime-400"
//             />
//             <Search
//               size={18}
//               className="absolute left-3 top-2.5 text-gray-500"
//             />
//           </div>
//           <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
//             Login
//           </button>
//           <button className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600">
//             Register
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// }




// "use client";
// import { useEffect, useState, useRef } from "react";
// import { Search, Mail, Phone, X, Globe, ChevronRight, Loader } from "lucide-react";
// import Image from "next/image";
// import {
//   brands,
//   categories,
//   maincategory,
//   subcategories,
//   products,
// } from "@/public/assets";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const [query, setQuery] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const [showAllProducts, setShowAllProducts] = useState(false);
//   const [hoveredMainCategory, setHoveredMainCategory] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [countryOpen, setCountryOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const searchRef = useRef(null);
//   const router = useRouter();

//    // ✅ NEW: Login related states
//   const [loginData, setLoginData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });

//   const [loginLoading, setLoginLoading] = useState(false);

//     // ✅ NEW: Use Auth Context
//   const { user, login, logout ,isTokenValid, checkAuthStatus} = useAuth();

//   // ✅ NEW: Handle Login Input Change
//   const handleLoginChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setLoginData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//     // ✅ NEW: Handle Login Submit
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setLoginLoading(true);

//     try {
//       const result = await login(loginData.email, loginData.password, loginData.rememberMe);

//       if (result.success) {
//         // Login successful
//         setIsLoginOpen(false);
//         setLoginData({ email: '', password: '', rememberMe: false });

//         // Redirect based on role
//         if (result.user.role === 'purchase') {
//           router.push('/frontend/purchase-dashboard');
//         } else if (result.user.role === 'sales') {
//           router.push('/frontend/sales-dashboard');
//         }
//       } else {
//         alert(result.message || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       alert('Login failed. Please try again.');
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   useEffect(() => {
//   checkAuthStatus();
// }, []);

//   // ✅ NEW: Handle Login Toggle
//   const handleLoginToggle = () => {
//     if (user) {
//       // If user is logged in, show logout option or redirect to dashboard
//       if (user.role === 'purchase') {
//         router.push('/frontend/purchase-dashboard');
//       } else if (user.role === 'sales') {
//         router.push('/frontend/sales-dashboard');
//       }
//     } else {
//       // If user is not logged in, open login panel
//       setIsLoginOpen(!isLoginOpen);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close search when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getRelatedCategories = (mainId) =>
//     categories.filter((cat) => cat.maincategory?.includes(String(mainId)));

//   const getRelatedSubcategories = (catId) =>
//     subcategories.filter((sub) => sub.category?.includes(String(catId)));

//   const getRelatedBrands = (mainId) =>
//     brands.filter((b) => b.maincategory?.includes(String(mainId)));

//   // ✅ Get all unique countries from product data
//   const uniqueCountries = Array.from(
//     new Set(products.map((p) => p.country))
//   ).sort();



//   // Enhanced search function
//   const performSearch = (searchQuery) => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     const query = searchQuery.toLowerCase().trim();

//     // Simulate API call delay
//     setTimeout(() => {
//       const results = {
//         products: [],
//         categories: [],
//         brands: [],
//         countries: []
//       };

//       // Search products
//       results.products = products.filter(product =>
//         product.name.toLowerCase().includes(query) ||
//         product.description?.toLowerCase().includes(query) ||
//         product.shortDescription?.toLowerCase().includes(query)
//       ).slice(0, 5); // Limit to 5 products

//       // Search categories
//       results.categories = categories.filter(category =>
//         category.name.toLowerCase().includes(query) ||
//         category.description?.toLowerCase().includes(query)
//       ).slice(0, 3);

//       // Search brands
//       results.brands = brands.filter(brand =>
//         brand.name.toLowerCase().includes(query) ||
//         brand.description?.toLowerCase().includes(query)
//       ).slice(0, 3);

//       // Search countries
//       results.countries = uniqueCountries.filter(country =>
//         country.toLowerCase().includes(query)
//       ).slice(0, 3);

//       setSearchResults(results);
//       setIsSearching(false);
//     }, 300);
//   };

//   // Debounced search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (query) {
//         performSearch(query);
//         setSearchOpen(true);
//       } else {
//         setSearchOpen(false);
//         setSearchResults([]);
//       }
//     }, 200);

//     return () => clearTimeout(timeoutId);
//   }, [query]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       router.push(`/frontend/search?q=${encodeURIComponent(query)}`);
//       setSearchOpen(false);
//       setQuery("");
//     }
//   };

//   const getSearchResultLink = (type, item) => {
//     switch (type) {
//       case 'product':
//         return `/frontend/product/${item.slug}`;
//       case 'category':
//         const mainCat = maincategory.find(mc =>
//           mc.id.toString() === item.maincategory?.[0]
//         );
//         return mainCat ? `/frontend/products/${mainCat.slug}/${item.slug}` : '#';
//       case 'brand':
//         return `/frontend/products/brand/${item.slug}`;
//       case 'country':
//         return `/frontend/products/country/${item.toLowerCase().replace(/\s+/g, '-')}`;
//       default:
//         return '#';
//     }
//   };

//   const getSearchResultIcon = (type) => {
//     switch (type) {
//       case 'product':
//         return '🛒';
//       case 'category':
//         return '📁';
//       case 'brand':
//         return '🏷️';
//       case 'country':
//         return '🌍';
//       default:
//         return '🔍';
//     }
//   };

//   const totalResults = searchResults.products?.length +
//     searchResults.categories?.length +
//     searchResults.brands?.length +
//     searchResults.countries?.length;

//   return (
//     <header
//       className={`w-full fixed top-0 z-50 transition-all duration-500 ${scrolled
//           ? "bg-black/40 shadow-md backdrop-blur-md"
//           : "bg-transparent"
//         }`}
//     >
//       {/* Top Info Bar */}
//       <div className="bg-gray-900 text-white text-sm py-2 px-6 flex flex-wrap items-center justify-between">
//         <div className="flex items-center gap-6 flex-wrap">
//           <span>✔ Import and export of Asian food and non-food</span>
//           <span>✔ Authentic food</span>
//           <span>✔ Fast delivery</span>
//           <span>✔ Order quickly</span>
//           <span>✔ EU law conform products</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <Phone size={16} />
//           <Mail size={16} />
//           <a href="#" className="hover:text-lime-400 transition">
//             About us
//           </a>
//           <Image
//             src="https://flagcdn.com/us.svg"
//             alt="US Flag"
//             width={20}
//             height={14}
//             className="rounded-sm"
//           />
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <nav className="flex flex-wrap items-center justify-between bg-white px-8 py-4 shadow-sm relative">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <a href="/" className="text-2xl font-semibold text-gray-800">
//             <span className="font-serif">Beagley</span>{" "}
//             <span className="font-serif text-lime-600">Copperman</span>
//           </a>
//         </div>

//         {/* Center Links */}
//         <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium relative">
//           {/* All Products */}
//           <button
//             onClick={() => setShowAllProducts(!showAllProducts)}
//             className="hover:text-lime-600 transition relative"
//           >
//             All products
//           </button>

//           {/* Mega Menu */}
//           {showAllProducts && (
//             <div
//               className="absolute left-1/2 transform -translate-x-[30%] top-[50px] bg-white shadow-2xl w-[1200px] rounded-md overflow-hidden flex border border-gray-300 z-50"
//               onMouseLeave={() =>
//                 setHoveredMainCategory(maincategory[0]?.id || null)
//               }
//             >
//               {/* LEFT SIDE - Main Categories */}
//               <div className="w-[25%] bg-gray-50 border-r border-gray-300 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//                 {maincategory.map((main) => (
//                   <a
//                     key={main.id}
//                     href={`/frontend/products/${main.slug}`}
//                     onMouseEnter={() => setHoveredMainCategory(main.id)}
//                     className={`flex items-center gap-3 px-5 py-4 transition ${hoveredMainCategory === main.id
//                         ? "bg-gray-100"
//                         : "hover:bg-gray-50"
//                       }`}
//                   >
//                     <Image
//                       src={main.img}
//                       alt={main.name}
//                       width={26}
//                       height={26}
//                       className="object-contain"
//                     />
//                     <span
//                       className={`text-md font-medium ${hoveredMainCategory === main.id
//                           ? "text-lime-600"
//                           : "text-gray-600"
//                         }`}
//                     >
//                       {main.name}
//                     </span>
//                   </a>
//                 ))}
//               </div>

//               {/* MIDDLE + RIGHT CONTENT */}
//               <div className="flex w-[75%] bg-white">
//                 {/* MIDDLE SECTION */}
//                 <div className="w-[70%] p-8 border-r border-gray-300 overflow-y-auto max-h-[70vh]">
//                   {hoveredMainCategory ? (
//                     <div className="grid grid-cols-3 gap-8">
//                       {getRelatedCategories(hoveredMainCategory).map((cat) => (
//                         <div key={cat.id}>
//                           <a
//                             href={`/frontend/products/${maincategory.find(
//                               (m) => m.id === hoveredMainCategory
//                             )?.slug
//                               }/${cat.slug}`}
//                             className="text-gray-800 font-semibold text-md mb-2"
//                           >
//                             {cat.name}
//                           </a>

//                           <ul className="space-y-1.5">
//                             {getRelatedSubcategories(cat.id).map((sub) => (
//                               <li key={sub.id}>
//                                 <a
//                                   href={`/frontend/products/${maincategory.find(
//                                     (m) => m.id === hoveredMainCategory
//                                   )?.slug
//                                     }/${cat.slug}/${sub.slug}`}
//                                   className="text-gray-600 text-sm hover:text-lime-600 cursor-pointer transition"
//                                 >
//                                   {sub.name}
//                                 </a>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-gray-500 flex items-center justify-center h-full italic">
//                       Hover over a category →
//                     </div>
//                   )}
//                 </div>

//                 {/* RIGHT SECTION - Brands */}
//                 <div className="w-[30%] p-8 bg-gradient-to-b from-gray-50 to-white">
//                   <h3 className="font-semibold text-gray-900 text-base mb-4">
//                     Highlighted brands
//                   </h3>
//                   {hoveredMainCategory ? (
//                     <div className="flex flex-col gap-3">
//                       {getRelatedBrands(hoveredMainCategory).map((b) => (
//                         <div
//                           key={b.id}
//                           className="flex items-center gap-3 hover:opacity-80 cursor-pointer transition"
//                         >
//                           <div className="bg-white border border-gray-300 rounded-md p-1 shadow-sm">
//                             <Image
//                               src={b.img}
//                               alt={b.name}
//                               width={60}
//                               height={40}
//                               className="object-contain"
//                             />
//                           </div>
//                           <span className="text-sm text-gray-700">
//                             {b.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-gray-400 text-sm mt-4">
//                       Hover over a category to see brands.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* 🌍 Country of Origin Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setCountryOpen((prev) => !prev)}
//               className="flex items-center gap-1 cursor-pointer hover:text-lime-600 transition select-none"
//             >
//               <Globe size={18} />
//               <span>Country of Origin</span>
//               <ChevronRight
//                 size={16}
//                 className={`transition-transform duration-300 ${countryOpen ? "rotate-90 text-lime-600" : "rotate-0"
//                   }`}
//               />
//             </button>

//             {countryOpen && (
//               <div className="absolute left-0 mt-4 w-[450px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-6 animate-slide-down">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="text-gray-900 font-semibold text-lg tracking-tight">
//                     Choose Country of Origin
//                   </h4>
//                   <button
//                     onClick={() => setCountryOpen(false)}
//                     className="text-gray-400 hover:text-gray-600 transition"
//                   >
//                     <X size={18} />
//                   </button>
//                 </div>

//                 {/* Grid Layout */}
//                 <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//                   {uniqueCountries.map((country) => (
//                     <Link
//                       key={country}
//                       href={`/frontend/products/country/${country.toLowerCase().replace(/\s+/g, '-')}`}
//                       onClick={() => setCountryOpen(false)}
//                     >
//                       <div className="group flex items-center justify-between px-4 py-2 rounded-lg text-gray-700 text-sm 
//                        border border-transparent hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700 
//                        transition cursor-pointer duration-200">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium group-hover:text-lime-700">
//                             {country}
//                           </span>
//                         </div>
//                         <ChevronRight
//                           size={14}
//                           className="text-gray-400 group-hover:text-lime-500 transition"
//                         />
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Brands Dropdown */}
//           <div className="relative">
//             <a
//               onClick={() => setOpen(!open)}
//               className="hover:text-lime-600 transition cursor-pointer"
//             >
//               All brands
//             </a>
//             {open && (
//               <div className="absolute left-0 mt-5 w-56 rounded-lg shadow-2xl bg-white border border-gray-300 z-50">
//                 <div className="p-4">
//                   <a href="/frontend/popular-brands">
//                     <h4 className="text-gray-600 font-semibold text-sm mb-2">
//                       Popular Brands
//                     </h4>
//                   </a>
//                   <a href="/frontend/all-brands">
//                     <h4 className="text-gray-600 font-semibold text-sm mt-4 mb-2">
//                       All Brands
//                     </h4>
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Link
//             href="/frontend/products/new"
//             className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
//           >
//             New
//           </Link>
//         </div>

//         {/* Search + Buttons */}
//         <div className="flex items-center gap-3 mt-3 md:mt-0" ref={searchRef}>
//           <div className="relative">
//             <form onSubmit={handleSearchSubmit}>
//               <input
//                 type="text"
//                 placeholder="Search products, categories, brands..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onFocus={() => query && setSearchOpen(true)}
//                 className="pl-10 pr-4 py-2 w-[400px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300"
//               />
//               <Search
//                 className="absolute left-3 top-2.5 text-gray-500"
//                 size={18}
//               />
//               {isSearching && (
//                 <Loader className="absolute right-3 top-2.5 text-gray-400 animate-spin" size={18} />
//               )}
//             </form>

//             {/* Search Results Dropdown */}
//             {/* Search Results Dropdown */}
//             {searchOpen && query && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden animate-slide-down">
//                 <div className="p-4 border-b border-gray-100">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-semibold text-gray-700">Search Results</span>
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                       {totalResults} results
//                     </span>
//                   </div>
//                 </div>

//                 <div className="max-h-80 overflow-y-auto">
//                   {/* Products Section */}
//                   {searchResults.products?.length > 0 && (
//                     <div className="border-b border-gray-100 last:border-b-0">
//                       <div className="px-4 py-2 bg-gray-50">
//                         <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                           Products ({searchResults.products.length})
//                         </span>
//                       </div>
//                       {searchResults.products.map((product) => (
//                         <Link
//                           key={product.id}
//                           href={getSearchResultLink("product", product)}
//                           onClick={() => {
//                             setSearchOpen(false);
//                             setQuery("");
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
//                         >
//                           <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
//                             <Image
//                               src={product.thumbImg || "/placeholder.png"}
//                               alt={product.name}
//                               width={40}
//                               height={40}
//                               className="object-cover w-full h-full"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-900 truncate group-hover:text-lime-700">
//                               {product.name}
//                             </p>
//                             <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
//                           </div>
//                           <span className="text-xs font-semibold text-lime-600 bg-lime-50 px-2 py-1 rounded">
//                             ${product.discountPrice || product.price}
//                           </span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}

//                   {/* Categories Section */}
//                   {searchResults.categories?.length > 0 && (
//                     <div className="border-b border-gray-100 last:border-b-0">
//                       <div className="px-4 py-2 bg-gray-50">
//                         <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                           Categories ({searchResults.categories.length})
//                         </span>
//                       </div>
//                       {searchResults.categories.map((category) => (
//                         <Link
//                           key={category.id}
//                           href={getSearchResultLink("category", category)}
//                           onClick={() => {
//                             setSearchOpen(false);
//                             setQuery("");
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
//                         >
//                           <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
//                             <Image
//                               src={category.img || "/placeholder.png"}
//                               alt={category.name}
//                               width={40}
//                               height={40}
//                               className="object-cover w-full h-full"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
//                               {category.name}
//                             </p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   )}

//                   {/* Brands Section */}
//                   {searchResults.brands?.length > 0 && (
//                     <div className="border-b border-gray-100 last:border-b-0">
//                       <div className="px-4 py-2 bg-gray-50">
//                         <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                           Brands ({searchResults.brands.length})
//                         </span>
//                       </div>
//                       {searchResults.brands.map((brand) => (
//                         <Link
//                           key={brand.id}
//                           href={getSearchResultLink("brand", brand)}
//                           onClick={() => {
//                             setSearchOpen(false);
//                             setQuery("");
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
//                         >
//                           <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 bg-white p-1">
//                             <Image
//                               src={brand.img || "/placeholder.png"}
//                               alt={brand.name}
//                               width={40}
//                               height={40}
//                               className="object-contain w-full h-full"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
//                               {brand.name}
//                             </p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   )}

//                   {/* Countries Section */}
//                   {searchResults.countries?.length > 0 && (
//                     <div className="border-b border-gray-100 last:border-b-0">
//                       <div className="px-4 py-2 bg-gray-50">
//                         <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                           Countries ({searchResults.countries.length})
//                         </span>
//                       </div>
//                       {searchResults.countries.map((country) => (
//                         <Link
//                           key={country}
//                           href={getSearchResultLink("country", country)}
//                           onClick={() => {
//                             setSearchOpen(false);
//                             setQuery("");
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
//                         >
//                           <div className="w-8 h-6 overflow-hidden rounded-sm border border-gray-200 flex-shrink-0">
//                             <Image
//                               src={`https://flagcdn.com/${country.slice(0, 2).toLowerCase()}.svg`}
//                               alt={country}
//                               width={24}
//                               height={16}
//                               className="object-cover w-full h-full"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
//                               {country}
//                             </p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   )}

//                   {/* No Results */}
//                   {totalResults === 0 && !isSearching && (
//                     <div className="px-4 py-8 text-center">
//                       <div className="text-gray-400 mb-2">
//                         <Search size={32} className="mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         No results found for "<span className="font-semibold">{query}</span>"
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Try different keywords or browse our categories
//                       </p>
//                     </div>
//                   )}

//                   {/* View All Results */}
//                   {totalResults > 0 && (
//                     <div className="p-4 border-t border-gray-100 bg-gray-50">
//                       <Link
//                         href={`/frontend/search?q=${encodeURIComponent(query)}`}
//                         onClick={() => {
//                           setSearchOpen(false);
//                           setQuery("");
//                         }}
//                         className="w-full bg-lime-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-lime-600 transition-colors duration-200 text-center block"
//                       >
//                         View All {totalResults} Results
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//           </div>

//           {user ? (
//     // When user is logged in
//     <>
//       <button
//         onClick={handleLoginToggle}
//         className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition"
//       >
//         {user.role === 'sales' ? 'Dashboard' : 'Dashboard'}
//       </button>
//       <button
//         onClick={logout}
//         className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
//       >
//         Logout
//       </button>
//     </>
//   ) : (
//     // When user is not logged in
//     <>
//       <button
//         onClick={handleLoginToggle}
//         className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
//       >
//         Login
//       </button>
//       <button 
//         onClick={() => router.push('/business-registration')}
//         className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600 transition"
//       >
//         Register
//       </button>
//     </>
//   )}
// </div>


//       </nav>

//       {/* LOGIN SLIDE PANEL */}


// {isLoginOpen && (
//   <>
//     {/* Backdrop Overlay */}
//     <div
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
//       onClick={handleLoginToggle}
//     ></div>

//     {/* Slide-in Panel */}
//     <div
//       className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-xl px-5 py-5 z-50 transform transition-all duration-500 ease-out ${isLoginOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center pb-2 border-b border-gray-200">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Business Login</h2>
//           <p className="text-sm text-gray-600 mt-1">Sign in to your business account</p>
//         </div>
//         <button
//           onClick={handleLoginToggle}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//         >
//           <X size={20} className="text-gray-500" />
//         </button>
//       </div>

//       {/* Form Section */}
//       <div className="py-8">
//         <form className="space-y-5" onSubmit={handleLoginSubmit}>
//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Business Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={loginData.email}
//               onChange={handleLoginChange}
//               placeholder="Enter your business email"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 outline-none"
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={loginData.password}
//               onChange={handleLoginChange}
//               placeholder="Enter your password"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 outline-none"
//               required
//             />
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={loginData.rememberMe}
//                 onChange={handleLoginChange}
//                 className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
//               />
//               <label className="ml-2 text-sm text-gray-700">Remember me</label>
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 handleLoginToggle();
//                 // You can navigate to forgot password page or show modal
//                 alert('Please use the Forgot Password link on the login page');
//               }}
//               className="text-sm text-lime-600 hover:text-lime-700 font-medium transition-colors duration-200"
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loginLoading}
//             className="w-full bg-lime-500 text-white py-3.5 rounded-lg font-semibold hover:bg-lime-600 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loginLoading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative my-8">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">New to our platform?</span>
//           </div>
//         </div>

//         {/* Sign Up Section */}
//         <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">
//             Register Your Business
//           </h3>
//           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//             Create a business account to access exclusive wholesale benefits:
//           </p>
//           <ul className="text-sm text-gray-600 space-y-2 mb-6">
//             <li className="flex items-center">
//               <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
//               Access to 3,500+ authentic Asian products
//             </li>
//             <li className="flex items-center">
//               <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
//               Personal account manager
//             </li>
//             <li className="flex items-center">
//               <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
//               Exclusive wholesale pricing
//             </li>
//             <li className="flex items-center">
//               <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
//               Fast delivery across Europe
//             </li>
//           </ul>
//           <Link 
//             href="/business-registration"
//             onClick={handleLoginToggle}
//             className="w-full border-2 border-lime-500 text-lime-600 py-3 rounded-lg font-semibold hover:bg-lime-50 transition-colors duration-200 text-center block"
//           >
//             Register Business
//           </Link>
//         </div>
//       </div>
//     </div>
//   </>
// )}
//     </header>
//   );
// }


"use client";
import { useEffect, useState, useRef } from "react";
import { Search, Mail, Phone, X, Globe, ChevronRight, Loader, Menu, User, ChevronDown, ChevronUp,LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { apiService } from "./apiService";
import GoogleTranslate from "./GoogleTranslate";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [hoveredMainCategory, setHoveredMainCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [openservices, setopenservices] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mobile specific states
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedMainCategories, setExpandedMainCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Data states
  const [maincategory, setMaincategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Language state
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("english");

  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const languageRef = useRef(null);
  const router = useRouter();

  // Login related states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loginLoading, setLoginLoading] = useState(false);

  // Use Auth Context
  const { user, login, logout, isTokenValid, checkAuthStatus } = useAuth();

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
        productsData,
        countriesData
      ] = await Promise.all([
        apiService.getMainCategories(),
        apiService.getCategories(),
        apiService.getSubcategories(),
        apiService.getBrands(),
        apiService.getProducts(),
        apiService.getCountries()
      ]);

      setMaincategory(Array.isArray(mainCategoriesData) ? mainCategoriesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMaincategory([]);
      setCategories([]);
      setSubcategories([]);
      setBrands([]);
      setProducts([]);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Input Change
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const result = await login(loginData.email, loginData.password, loginData.rememberMe);

      if (result.success) {
        setIsLoginOpen(false);
        setMobileMenuOpen(false);
        setLoginData({ email: '', password: '', rememberMe: false });

        if (result.user.role === 'purchase') {
          router.push('/frontend/purchase-dashboard');
        } else if (result.user.role === 'sales') {
          router.push('/frontend/sales-dashboard');
        }
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle Login Toggle
  const handleLoginToggle = () => {
    if (user) {
      if (user.role === 'purchase') {
        router.push('/frontend/purchase-dashboard');
      } else if (user.role === 'sales') {
        router.push('/frontend/sales-dashboard');
      }
    } else {
      setIsLoginOpen(!isLoginOpen);
      setMobileMenuOpen(false);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target) && mobileSearchOpen) {
        setMobileSearchOpen(false);
        setQuery("");
        setSearchResults([]);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, mobileSearchOpen]);

  // Helper functions to filter data
  const getRelatedCategories = (mainId) => {
    if (!mainId) return [];
    return categories.filter((cat) => {
      let catMainId;

      if (typeof cat.maincategory === 'string') {
        catMainId = cat.maincategory;
      } else if (cat.maincategory && typeof cat.maincategory === 'object') {
        catMainId = cat.maincategory.$oid || cat.maincategory._id?.$oid || cat.maincategory._id;
      } else {
        catMainId = cat.maincategory;
      }

      return catMainId === mainId;
    });
  };

  const getRelatedSubcategories = (catId) => {
    if (!catId) return [];
    return subcategories.filter((sub) => {
      let subCatId;

      if (typeof sub.category === 'string') {
        subCatId = sub.category;
      } else if (sub.category && typeof sub.category === 'object') {
        subCatId = sub.category.$oid || sub.category._id?.$oid || sub.category._id;
      } else {
        subCatId = sub.category;
      }

      return subCatId === catId;
    });
  };

  const getRelatedBrands = (mainId) => {
    if (!mainId) return [];
    return brands.filter((b) => {
      if (!b.maincategory || !Array.isArray(b.maincategory)) return false;

      return b.maincategory.some(mc => {
        const mcId = mc._id?.$oid || mc._id || mc;
        return mcId === mainId;
      });
    });
  };

  // Mobile category toggle functions
  const toggleMainCategory = (mainId) => {
    setExpandedMainCategories(prev => ({
      ...prev,
      [mainId]: !prev[mainId]
    }));
  };

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Get all unique countries from product data
  const uniqueCountries = Array.isArray(products)
    ? Array.from(
      new Set(
        products
          .map((p) => {
            if (p.country && typeof p.country === 'object') {
              return p.country.name || p.country.title || JSON.stringify(p.country);
            }
            return p.country;
          })
          .filter(Boolean)
      )
    ).sort()
    : [];

  // Enhanced search function
  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();

    setTimeout(() => {
      const results = {
        products: [],
        categories: [],
        brands: [],
        countries: []
      };

      results.products = products.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query)
      ).slice(0, 5);

      results.categories = categories.filter(category =>
        category.name?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query)
      ).slice(0, 3);

      results.brands = brands.filter(brand =>
        brand.name?.toLowerCase().includes(query) ||
        brand.description?.toLowerCase().includes(query)
      ).slice(0, 3);

      results.countries = uniqueCountries.filter(country =>
        country.toLowerCase().includes(query)
      ).slice(0, 3);

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        performSearch(query);
        setSearchOpen(true);
        setMobileSearchOpen(true);
      } else {
        setSearchOpen(false);
        setMobileSearchOpen(false);
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/frontend/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setMobileSearchOpen(false);
      setQuery("");
      setMobileMenuOpen(false);
    }
  };

  const getSearchResultLink = (type, item) => {
    switch (type) {
      case 'product':
        return `/frontend/product/${item.slug}`;
      case 'category':
        const mainCat = maincategory.find(mc => {
          const catMainId = item.maincategory?.$oid || item.maincategory;
          const mcId = mc._id?.$oid || mc._id || mc.id;
          return mcId === catMainId;
        });
        return mainCat ? `/frontend/products/${mainCat.slug}/${item.slug}` : '#';
      case 'brand':
        return `/frontend/products/brand/${item.slug}`;
      case 'country':
        return `/frontend/products/country/${item.toLowerCase().replace(/\s+/g, '-')}`;
      default:
        return '#';
    }
  };

  const getImageUrl = (imgPath) => {
    try {
      if (!imgPath) return "/images/placeholder-product.jpg";

      if (imgPath.startsWith('http')) return imgPath;

      let cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
      cleanPath = cleanPath.replace(/\/+/g, '/');

      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${cleanPath}`;

      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/images/placeholder-product.jpg";
    }
  };

  // Language handling
  const languages = [
    { code: "english", name: "English", flag: "https://flagcdn.com/gb.svg" },
    { code: "norwegian", name: "Norsk", flag: "https://flagcdn.com/no.svg" }
  ];

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language.code);
    setLanguageOpen(false);
    // Here you would typically implement your language change logic
    // For example: i18n.changeLanguage(language.code);
    console.log(`Language changed to: ${language.name}`);
  };

  const totalResults = (searchResults.products?.length || 0) +
    (searchResults.categories?.length || 0) +
    (searchResults.brands?.length || 0) +
    (searchResults.countries?.length || 0);

  if (loading) {
    return (
      <header className="w-full fixed top-0 z-50 bg-white">
        <div className="flex items-center justify-center py-4">
          <Loader className="animate-spin" size={24} />
          <span className="ml-2">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-black/40 shadow-md backdrop-blur-md"
        : "bg-transparent"
        }`}
    >
      {/* Top Info Bar - Hidden on mobile */}
      <div className="bg-gray-900 text-white text-sm py-2 px-4 lg:px-6">
        <div className="flex flex-row items-center justify-between gap-2">

          {/* LEFT ITEMS */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs lg:text-sm">
            <span className="whitespace-nowrap">✔ Import and export</span>
            <span className="whitespace-nowrap sm:block hidden">✔ Authentic food</span>
            <span className="whitespace-nowrap sm:block hidden">✔ Fast delivery</span>
            <span className="whitespace-nowrap sm:block hidden">✔ Order quickly</span>
            <span className="whitespace-nowrap">✔ EU law conform</span>
          </div>

          {/* RIGHT ITEMS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Phone size={14} className="hidden sm:block" />
            <Mail size={14} className="hidden sm:block" />

            <a
              href="/frontend/about"
              className="hover:text-lime-400 transition text-xs lg:text-sm whitespace-nowrap"
            >
              About us
            </a>

            {/* Language Selector */}
            <div className="relative">
              <GoogleTranslate />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between bg-white px-4 lg:px-8 py-3 lg:py-4 shadow-sm relative">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="text-xl lg:text-2xl font-semibold text-gray-800">
            <span className="font-serif">Deva</span>{" "}
            <span className="font-serif text-lime-600">Groupon</span>
          </a>
        </div>

        {/* Center Links - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-gray-700 font-medium relative">
          {/* All Products */}
          <div className="relative">
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              onMouseEnter={() => setShowAllProducts(true)}
              className="hover:text-lime-600 transition relative flex items-center gap-1"
            >
              All products
              <ChevronRight
                size={16}
                className={`transition-transform duration-300 ${showAllProducts ? "rotate-90 text-lime-600" : "rotate-0"}`}
              />
            </button>

            {/* Mega Menu */}
            {showAllProducts && (
              <div
                className="absolute left-1/2 transform -translate-x-[20%] top-[50px] bg-white shadow-2xl w-[1200px] rounded-md overflow-hidden flex border border-gray-300 z-50"
                onMouseLeave={() => setHoveredMainCategory(maincategory[0]?._id?.$oid || maincategory[0]?._id || null)}
              >
                {/* LEFT SIDE - Main Categories */}
                <div className="w-[25%] bg-gray-50 border-r border-gray-300 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {maincategory.map((main) => {
                    const mainId = main._id?.$oid || main._id;
                    return (
                      <a
                        key={mainId}
                        href={`/frontend/products/${main.slug}`}
                        onMouseEnter={() => setHoveredMainCategory(mainId)}
                        className={`flex items-center gap-3 px-5 py-4 transition ${hoveredMainCategory === mainId ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      >
                        <Image
                          src={getImageUrl(main.img)}
                          alt={main.name}
                          width={26}
                          height={26}
                          className="object-contain"
                        />
                        <span className={`text-md font-medium ${hoveredMainCategory === mainId ? "text-lime-600" : "text-gray-600"}`}>
                          {main.name}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* MIDDLE + RIGHT CONTENT */}
                <div className="flex w-[75%] bg-white">
                  {/* MIDDLE SECTION */}
                  <div className="w-[70%] p-6 lg:p-8 border-r border-gray-300 overflow-y-auto max-h-[70vh]">
                    {hoveredMainCategory ? (
                      <div>
                        {getRelatedCategories(hoveredMainCategory).length > 0 ? (
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {getRelatedCategories(hoveredMainCategory).map((cat) => {
                              const catId = cat._id?.$oid || cat._id;
                              const relatedSubcategories = getRelatedSubcategories(catId);

                              return (
                                <div key={catId}>
                                  <a
                                    href={`/frontend/products/${maincategory.find(
                                      (m) => (m._id?.$oid || m._id) === hoveredMainCategory
                                    )?.slug}/${cat.slug}`}
                                    className="text-gray-800 font-semibold text-sm lg:text-md mb-2 block hover:text-lime-600 transition"
                                  >
                                    {cat.name}
                                  </a>

                                  {relatedSubcategories.length > 0 ? (
                                    <ul className="space-y-1.5">
                                      {relatedSubcategories.map((sub) => (
                                        <li key={sub._id?.$oid || sub._id}>
                                          <a
                                            href={`/frontend/products/${maincategory.find(
                                              (m) => (m._id?.$oid || m._id) === hoveredMainCategory
                                            )?.slug}/${cat.slug}/${sub.slug}`}
                                            className="text-gray-600 text-xs lg:text-sm hover:text-lime-600 cursor-pointer transition block"
                                          >
                                            {sub.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-gray-400 text-xs italic">No subcategories</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500 flex items-center justify-center h-full italic">
                            No categories found
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 flex items-center justify-center h-full italic">
                        Hover over a category →
                      </div>
                    )}
                  </div>

                  {/* RIGHT SECTION - Brands */}
                  <div className="w-[30%] p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-4">
                      Highlighted brands
                    </h3>
                    {hoveredMainCategory ? (
                      <div>
                        {getRelatedBrands(hoveredMainCategory).length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {getRelatedBrands(hoveredMainCategory).map((b) => (
                              <div
                                key={b._id?.$oid || b._id}
                                className="flex items-center gap-3 hover:opacity-80 cursor-pointer transition"
                              >
                                <div className="bg-white border border-gray-300 rounded-md p-1 shadow-sm">
                                  <Image
                                    src={getImageUrl(b.img)}
                                    alt={b.name}
                                    width={60}
                                    height={40}
                                    className="object-contain"
                                  />
                                </div>
                                <span className="text-sm text-gray-700">
                                  {b.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm mt-4">
                            No brands found
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm mt-4">
                        Hover over a category to see brands
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Only Elements */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* Country of Origin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCountryOpen((prev) => !prev)}
                className="flex items-center gap-1 cursor-pointer hover:text-lime-600 transition select-none"
              >
                <Globe size={18} />
                <span>Country</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${countryOpen ? "rotate-90 text-lime-600" : "rotate-0"}`}
                />
              </button>

              {countryOpen && (
                <div className="absolute left-0 mt-4 w-80 lg:w-[450px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4 lg:p-6 animate-slide-down">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-900 font-semibold text-base lg:text-lg tracking-tight">
                      Choose Country
                    </h4>
                    <button
                      onClick={() => setCountryOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 max-h-72 overflow-y-auto">
                    {uniqueCountries.map((country) => (
                      <Link
                        key={country}
                        href={`/frontend/products/country/${country.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setCountryOpen(false)}
                      >
                        <div className="group flex items-center justify-between px-3 lg:px-4 py-2 rounded-lg text-gray-700 text-sm 
                 border border-transparent hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700 
                 transition cursor-pointer duration-200">
                          <span className="font-medium group-hover:text-lime-700">
                            {country}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-lime-500 transition"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 cursor-pointer hover:text-lime-600 transition select-none"
              >
                <span>All Brands</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${open ? "rotate-90 text-lime-600" : "rotate-0"}`}
                />
              </button>
              {open && (
                <div className="absolute left-0 mt-4 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3">
                    <Link
                      href="/frontend/popular-brands"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors"
                    >
                      Popular Brands
                    </Link>
                    <Link
                      href="/frontend/all-brands"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors mt-1"
                    >
                      All Brands
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Business Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => setopenservices(!openservices)}
                className="flex items-center gap-1 cursor-pointer hover:text-lime-600 transition select-none"
              >
                <span>Business Type</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${openservices ? "rotate-90 text-lime-600" : "rotate-0"}`}
                />
              </button>
              {openservices && (
                <div className="absolute left-0 mt-4 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3">
                    <Link
                      href="/frontend/retail-services"
                      onClick={() => setopenservices(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors"
                    >
                      Retail Services
                    </Link>
                    <Link
                      href="/frontend/food-services"
                      onClick={() => setopenservices(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors mt-1"
                    >
                      Food Services
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/frontend/products/new"
              className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition whitespace-nowrap"
            >
              New
            </Link>
          </div>
        </div>

        {/* Search + Buttons */}
        <div className="flex items-center gap-2 lg:gap-3" ref={searchRef}>
          {/* Desktop Search Bar */}
          <div className="hidden lg:block relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search products, categories, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setSearchOpen(true)}
                className="pl-10 pr-4 py-2 w-[300px] xl:w-[400px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={18}
              />
              {isSearching && (
                <Loader className="absolute right-3 top-2.5 text-gray-400 animate-spin" size={18} />
              )}
            </form>

            {/* Desktop Search Results Dropdown */}
            {searchOpen && query && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden animate-slide-down">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Search Results</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {totalResults} results
                    </span>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* Products Section */}
                  {searchResults.products?.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Products ({searchResults.products.length})
                        </span>
                      </div>
                      {searchResults.products.map((product) => (
                        <Link
                          key={product._id?.$oid || product._id}
                          href={getSearchResultLink("product", product)}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                              src={getImageUrl(product.thumbImg)}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-lime-700">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
                          </div>
                          <span className="text-xs font-semibold text-lime-600 bg-lime-50 px-2 py-1 rounded">
                            ${product.discountPrice || product.price}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Categories Section */}
                  {searchResults.categories?.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Categories ({searchResults.categories.length})
                        </span>
                      </div>
                      {searchResults.categories.map((category) => (
                        <Link
                          key={category._id?.$oid || category._id}
                          href={getSearchResultLink("category", category)}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                              src={getImageUrl(category.img)}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
                              {category.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Brands Section */}
                  {searchResults.brands?.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Brands ({searchResults.brands.length})
                        </span>
                      </div>
                      {searchResults.brands.map((brand) => (
                        <Link
                          key={brand._id?.$oid || brand._id}
                          href={getSearchResultLink("brand", brand)}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 bg-white p-1">
                            <Image
                              src={getImageUrl(brand.img)}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
                              {brand.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Countries Section */}
                  {searchResults.countries?.length > 0 && (
                    <div className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Countries ({searchResults.countries.length})
                        </span>
                      </div>
                      {searchResults.countries.map((country) => (
                        <Link
                          key={country}
                          href={getSearchResultLink("country", country)}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-6 overflow-hidden rounded-sm border border-gray-200 flex-shrink-0">
                            <Image
                              src={`https://flagcdn.com/${country.slice(0, 2).toLowerCase()}.svg`}
                              alt={country}
                              width={24}
                              height={16}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-lime-700">
                              {country}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {totalResults === 0 && !isSearching && (
                    <div className="px-4 py-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <Search size={32} className="mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600">
                        No results found for "<span className="font-semibold">{query}</span>"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try different keywords or browse our categories
                      </p>
                    </div>
                  )}

                  {/* View All Results */}
                  {totalResults > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <Link
                        href={`/frontend/search?q=${encodeURIComponent(query)}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="w-full bg-lime-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-lime-600 transition-colors duration-200 text-center block"
                      >
                        View All {totalResults} Results
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <div className="lg:hidden">
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Search Overlay - Similar to Desktop */}
          {mobileSearchOpen && (
            <div className="lg:hidden fixed inset-0 top-0 z-50 bg-white" ref={mobileSearchRef}>
              {/* Search Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setQuery("");
                      setSearchResults([]);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 transition"
                  >
                    <X size={20} />
                  </button>
                  <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search products, categories, brands..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-base"
                        autoFocus
                      />
                      <Search
                        className="absolute left-3 top-3.5 text-gray-500"
                        size={18}
                      />
                      {isSearching && (
                        <Loader className="absolute right-3 top-3.5 text-gray-400 animate-spin" size={18} />
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-lime-500 text-white px-4 py-3 rounded-lg hover:bg-lime-600 transition font-medium"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>

              {/* Mobile Search Results */}
              {query && (
                <div className="bg-white h-[calc(100vh-80px)] overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Search Results</span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {totalResults} results
                      </span>
                    </div>
                  </div>

                  <div className="pb-20">
                    {/* Products Section */}
                    {searchResults.products?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-3 bg-gray-50">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Products ({searchResults.products.length})
                          </span>
                        </div>
                        {searchResults.products.map((product) => (
                          <Link
                            key={product._id?.$oid || product._id}
                            href={getSearchResultLink("product", product)}
                            onClick={() => {
                              setMobileSearchOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-lime-50 transition-colors duration-200"
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                              <Image
                                src={getImageUrl(product.thumbImg)}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
                            </div>
                            <span className="text-xs font-semibold text-lime-600 bg-lime-50 px-2 py-1 rounded">
                              ${product.discountPrice || product.price}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Categories Section */}
                    {searchResults.categories?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-3 bg-gray-50">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Categories ({searchResults.categories.length})
                          </span>
                        </div>
                        {searchResults.categories.map((category) => (
                          <Link
                            key={category._id?.$oid || category._id}
                            href={getSearchResultLink("category", category)}
                            onClick={() => {
                              setMobileSearchOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-lime-50 transition-colors duration-200"
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                              <Image
                                src={getImageUrl(category.img)}
                                alt={category.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {category.name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Brands Section */}
                    {searchResults.brands?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-3 bg-gray-50">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Brands ({searchResults.brands.length})
                          </span>
                        </div>
                        {searchResults.brands.map((brand) => (
                          <Link
                            key={brand._id?.$oid || brand._id}
                            href={getSearchResultLink("brand", brand)}
                            onClick={() => {
                              setMobileSearchOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-lime-50 transition-colors duration-200"
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 bg-white p-1">
                              <Image
                                src={getImageUrl(brand.img)}
                                alt={brand.name}
                                width={48}
                                height={48}
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {brand.name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Countries Section */}
                    {searchResults.countries?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-3 bg-gray-50">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Countries ({searchResults.countries.length})
                          </span>
                        </div>
                        {searchResults.countries.map((country) => (
                          <Link
                            key={country}
                            href={getSearchResultLink("country", country)}
                            onClick={() => {
                              setMobileSearchOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-lime-50 transition-colors duration-200"
                          >
                            <div className="w-10 h-8 overflow-hidden rounded-sm border border-gray-200 flex-shrink-0">
                              <Image
                                src={`https://flagcdn.com/${country.slice(0, 2).toLowerCase()}.svg`}
                                alt={country}
                                width={32}
                                height={24}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {country}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {totalResults === 0 && !isSearching && (
                      <div className="px-4 py-12 text-center">
                        <div className="text-gray-400 mb-3">
                          <Search size={48} className="mx-auto" />
                        </div>
                        <p className="text-base text-gray-600 mb-1">
                          No results found for "<span className="font-semibold">{query}</span>"
                        </p>
                        <p className="text-sm text-gray-500">
                          Try different keywords or browse our categories
                        </p>
                      </div>
                    )}

                    {/* View All Results */}
                    {totalResults > 0 && (
                      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
                        <Link
                          href={`/frontend/search?q=${encodeURIComponent(query)}`}
                          onClick={() => {
                            setMobileSearchOpen(false);
                            setQuery("");
                          }}
                          className="w-full bg-lime-500 text-white py-3.5 rounded-lg text-base font-semibold hover:bg-lime-600 transition-colors duration-200 text-center block"
                        >
                          View All {totalResults} Results
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleLoginToggle}
                  className="hidden sm:block bg-lime-500 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-lime-600 transition text-sm"
                >
                  {user.role === 'sales' ? 'Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={logout}
                  className="hidden sm:block bg-gray-900 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                >
                  Logout
                </button>
                {/* Mobile User Icon */}
                <button
                  onClick={handleLoginToggle}
                  className="sm:hidden text-[10px] p-1 rounded-md text-white bg-lime-500  hover:bg-lime-600 transition"
                >
                  {user.role === 'sales' ? 'Dashboard' : <LayoutDashboard size={20} /> }
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginToggle}
                  className="hidden sm:block bg-gray-900 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    router.push('/business-registration');
                    setMobileMenuOpen(false);
                  }}
                  className="hidden sm:block bg-lime-500 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-lime-600 transition text-sm"
                >
                  Register
                </button>
                {/* Mobile User Icon */}
                <button
                  onClick={handleLoginToggle}
                  className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[84px] z-40 bg-white">
          <div ref={mobileMenuRef} className="h-full overflow-y-auto pb-32">
            {/* Mobile Header - Increased z-index */}
            <div className="bg-gray-900 text-white p-4 z-[60] flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-1">
              {/* All Products with Full Category Hierarchy */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="w-full text-left text-lg font-semibold text-gray-900 py-3 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>All Products</span>
                    {showAllProducts && (
                      <span className="text-xs bg-lime-500 text-white px-2 py-1 rounded-full">
                        {maincategory.length}
                      </span>
                    )}
                  </span>
                  {showAllProducts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showAllProducts && (
                  <div className="mt-3 space-y-2 px-10">
                    {maincategory.map((main) => {
                      const mainId = main._id?.$oid || main._id;
                      const relatedCategories = getRelatedCategories(mainId);
                      const isExpanded = expandedMainCategories[mainId];

                      return (
                        <div key={mainId} className="bg-gray-50 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleMainCategory(mainId)}
                            className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-100 transition-colors"
                          >
                            <Image
                              src={getImageUrl(main.img)}
                              alt={main.name}
                              width={28}
                              height={28}
                              className="object-contain flex-shrink-0"
                            />
                            <span className="font-medium text-gray-800 flex-1">{main.name}</span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                              {relatedCategories.length}
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isExpanded && (
                            <div className="bg-white border-t border-gray-200">
                              {/* Main Category Link */}
                              <Link
                                href={`/frontend/products/${main.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 pl-11 text-sm font-medium text-lime-600 hover:bg-lime-50 border-b border-gray-100"
                              >
                                View All {main.name}
                              </Link>

                              {/* Categories */}
                              {relatedCategories.map((cat) => {
                                const catId = cat._id?.$oid || cat._id;
                                const relatedSubcategories = getRelatedSubcategories(catId);
                                const isCatExpanded = expandedCategories[catId];

                                return (
                                  <div key={catId} className="border-b border-gray-100 last:border-b-0">
                                    <button
                                      onClick={() => toggleCategory(catId)}
                                      className="w-full flex items-center gap-3 px-3 py-2.5 pl-11 text-left hover:bg-gray-50 transition-colors"
                                    >
                                      <span className="font-medium text-gray-700 flex-1">{cat.name}</span>
                                      {relatedSubcategories.length > 0 && (
                                        <>
                                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {relatedSubcategories.length}
                                          </span>
                                          {isCatExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </>
                                      )}
                                    </button>

                                    {/* Subcategories */}
                                    {isCatExpanded && relatedSubcategories.length > 0 && (
                                      <div className="bg-gray-50 border-t border-gray-200">
                                        {relatedSubcategories.map((sub) => (
                                          <Link
                                            key={sub._id?.$oid || sub._id}
                                            href={`/frontend/products/${main.slug}/${cat.slug}/${sub.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-lime-50 hover:text-lime-700 pl-16 border-b border-gray-100 last:border-b-0 transition-colors"
                                          >
                                            {sub.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              

              {/* Country of Origin */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => setCountryOpen(!countryOpen)}
                  className="w-full text-left text-lg font-semibold text-gray-900 py-3 flex items-center justify-between"
                >
                  <span>Country of Origin</span>
                  {countryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {countryOpen && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {uniqueCountries.slice(0, 12).map((country) => (
                      <Link
                        key={country}
                        href={`/frontend/products/country/${country.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-600 hover:text-lime-600 hover:bg-lime-50 transition-colors py-2 px-3 rounded-lg text-sm border border-gray-200 text-center"
                      >
                        {country}
                      </Link>
                    ))}
                    {uniqueCountries.length > 12 && (
                      <Link
                        href="/frontend/countries"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 text-center text-lime-600 hover:bg-lime-50 transition-colors py-2 px-3 rounded-lg text-sm border border-lime-200 font-medium"
                      >
                        View All Countries →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* All Brands with Sub-options */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full text-left text-lg font-semibold text-gray-900 py-3 flex items-center justify-between"
                >
                  <span>All Brands</span>
                  {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {open && (
                  <div className="mt-3 space-y-2 pl-2">
                    <Link
                      href="/frontend/popular-brands"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-4 text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors font-medium border-l-2 border-lime-500"
                    >
                      Popular Brands
                    </Link>
                    <Link
                      href="/frontend/all-brands"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-4 text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors font-medium border-l-2 border-gray-300"
                    >
                      All Brands
                    </Link>
                  </div>
                )}
              </div>

              {/* Business Type with Sub-options */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => setopenservices(!openservices)}
                  className="w-full text-left text-lg font-semibold text-gray-900 py-3 flex items-center justify-between"
                >
                  <span>Business Type</span>
                  {openservices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openservices && (
                  <div className="mt-3 space-y-2 pl-2">
                    <Link
                      href="/frontend/retail-services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-4 text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors font-medium border-l-2 border-lime-500"
                    >
                      Retail Services
                    </Link>
                    <Link
                      href="/frontend/food-services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-4 text-gray-700 hover:bg-lime-50 hover:text-lime-700 rounded-lg transition-colors font-medium border-l-2 border-gray-300"
                    >
                      Food Services
                    </Link>
                  </div>
                )}
              </div>

              {/* Language Selector for Mobile */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="w-full text-left text-lg font-semibold text-gray-900 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={currentLanguage === "english" ? "https://flagcdn.com/gb.svg" : "https://flagcdn.com/no.svg"}
                      alt={currentLanguage === "english" ? "English" : "Norwegian"}
                      width={20}
                      height={15}
                      className="rounded-sm"
                    />
                    <span>Language</span>
                  </div>
                  {languageOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {languageOpen && (
                  <div className="mt-3 space-y-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition ${currentLanguage === language.code ? 'bg-lime-50 text-lime-700 border border-lime-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <Image
                          src={language.flag}
                          alt={language.name}
                          width={20}
                          height={15}
                          className="rounded-sm"
                        />
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* New Products */}
              <Link
                href="/frontend/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-semibold text-gray-900 py-3 hover:text-lime-600 transition border-b border-gray-200"
              >
                New Products
              </Link>

              {/* Auth Buttons for Mobile */}
              <div className="pt-6 pb-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Welcome back!</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLoginToggle}
                      className="w-full bg-lime-500 text-white py-3.5 rounded-lg font-semibold hover:bg-lime-600 transition text-base"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition text-base"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleLoginToggle}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition text-base"
                    >
                      Business Login
                    </button>
                    <button
                      onClick={() => {
                        router.push('/frontend/register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-lime-500 text-white py-3.5 rounded-lg font-semibold hover:bg-lime-600 transition text-base"
                    >
                      Register Business
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
         
      )}

      {/* LOGIN SLIDE PANEL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[999999] pointer-events-none">

          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999998] pointer-events-auto"
            onClick={handleLoginToggle}
          ></div>

          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-xl px-4 sm:px-5 py-5
  z-[999999] pointer-events-auto transform transition-all duration-500 ease-out
  ${isLoginOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Business Login</h2>
                <p className="text-sm text-gray-600 mt-1">Sign in to your business account</p>
              </div>
              <button
                onClick={handleLoginToggle}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="py-6 sm:py-8">
              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your business email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 outline-none"
                      required
                    />

                    {/* Eye Icon */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                      className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Remember me</label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginOpen(false);
                      router.push('/frontend/forgot-password');
                    }}
                    className="text-sm text-lime-600 hover:text-lime-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
                 

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-lime-500 text-white py-3.5 rounded-lg font-semibold hover:bg-lime-600 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="relative my-6 sm:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Register Your Business
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Create a business account to access exclusive wholesale benefits:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
                    Access to 3,500+ authentic Asian products
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
                    Personal account manager
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
                    Exclusive wholesale pricing
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-full mr-3"></div>
                    Fast delivery across Europe
                  </li>
                </ul>
                <Link
                  href="/business-registration"
                  onClick={handleLoginToggle}
                  className="w-full border-2 border-lime-500 text-lime-600 py-3 rounded-lg font-semibold hover:bg-lime-50 transition-colors duration-200 text-center block"
                >
                  Register Business
                </Link>
              </div>
            </div>
          </div>
        </div>
     
      )}
    </header>
  );
}