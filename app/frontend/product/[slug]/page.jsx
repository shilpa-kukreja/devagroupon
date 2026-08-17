// "use client";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import ReactCountryFlag from "react-country-flag";
// import { products } from "@/public/assets";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { LogIn, UserPlus, Globe, ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Recommendations, SimpleDynamicRecommendations } from "../../components/Recommendations";

// export default function ProductDetailPage() {
//   const { slug } = useParams();
//   const router = useRouter();
//   const product = products.find((p) => p.slug === slug);

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isModalOpen]);

//   if (!product)
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center p-8">
//           <div className="text-6xl mb-4">😔</div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
//           <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
//           <button 
//             onClick={() => router.push('/')}
//             className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );

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

//   const nextImage = () => {
//     setSelectedImageIndex((prev) => 
//       prev === product.galleryImg.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) => 
//       prev === 0 ? product.galleryImg.length - 1 : prev - 1
//     );
//   };

//   const openModal = (index) => {
//     setSelectedImageIndex(index);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
//       <Navbar />

//       <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 lg:pt-32  py-8 lg:py-12">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
//           {/* LEFT SIDE - Product Images */}
//           <div className="space-y-6">
//             {/* Main Image */}
//             <div className="relative group">
//               <div 
//                 className="relative w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 cursor-zoom-in transition-all duration-300 hover:shadow-2xl"
//                 onClick={() => openModal(selectedImageIndex)}
//               >
//                 <Image
//                   src={ product.galleryImg[selectedImageIndex] ||   product.thumbImg }
//                   alt={product.name}
//                   fill
//                   className="object-contain p-8 transition-transform duration-500"
//                   priority
//                 />
//                 <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
//                   <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </div>

//               {/* Navigation Arrows */}
//               {product.galleryImg.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Image Gallery */}
//             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {product.galleryImg.map((img, index) => (
//                 <div
//                   key={index}
//                   className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
//                     selectedImageIndex === index 
//                       ? 'border-lime-500 shadow-md scale-105' 
//                       : 'border-gray-200'
//                   }`}
//                   onClick={() => setSelectedImageIndex(index)}
//                 >
//                   <Image
//                     src={img}
//                     alt={`${product.name} - View ${index + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Image Counter */}
//             {product.galleryImg.length > 1 && (
//               <div className="text-center">
//                 <span className="inline-block bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
//                   {selectedImageIndex + 1} / {product.galleryImg.length}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* RIGHT SIDE - Product Details */}
//           <div className="flex flex-col pt-5 space-y-4">
//             {/* Header */}
//             <div className="space-y-2">


//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
//                 {product.name}
//               </h1>
//             </div>
//              <div className="flex items-center gap-3">
//                 <ReactCountryFlag
//                   countryCode={getCountryCode(product.country)}
//                   svg
//                   className="rounded-lg shadow-md"
//                   style={{ width: "2.5em", height: "2.5em" }}
//                 />
//                 <span className="text-gray-600 text-md font-medium bg-white px-3 py-1 rounded-lg shadow-sm">
//                   {product.country}
//                 </span>
//               </div>

//             {/* Description */}
//             <p className="text-gray-600 text-sm leading-relaxed">
//               {product.shortDescription}
//             </p>

//             {/* Price Section */}
//             <div className="flex items-end gap-4">
//               <span className="text-2xl font-bold text-lime-600">
//                 ${product.discountPrice || product.price}
//               </span>
//               {product.discountPrice && (
//                 <>
//                   <span className="text-2xl text-gray-400 line-through">
//                     ${product.price}
//                   </span>
//                   {/* <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
//                     Save ${(product.price - product.discountPrice).toFixed(2)}
//                   </span> */}
//                 </>
//               )}
//             </div>

//             {/* Login/Register Card */}
//             <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-xl p-8 max-w-lg transform hover:scale-[1.02] transition-transform duration-300">
//               {/* Online Badge */}
//               <div className="absolute -top-4 -right-4 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl">
//                 <Globe className="w-5 h-5" />
//               </div>

//               <div className="text-center space-y-4">
//                 <h3 className="text-xl font-bold text-gray-800">
//                   Access Real-time Information
//                 </h3>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                   Log in to view live stock availability, current market prices, 
//                   and place orders seamlessly. New customers can register in minutes 
//                   and start sourcing immediately.
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                 <button
//                   onClick={() => router.push('/login')}
//                   className="flex-1 flex items-center justify-center text-sm gap-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-lime-800 transition-all duration-200 transform hover:-translate-y-0.5"
//                 >
//                   <LogIn className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </button>

//                 <button
//                   onClick={() => router.push('/register')}
//                   className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-300 bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl hover:border-lime-500 hover:bg-lime-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
//                 >
//                   <UserPlus className="w-5 h-5 text-lime-600" />
//                   <span>Register</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//            <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">General Specifications</h2>
//         <div className="border border-gray-200 rounded-md p-4 overflow-x-auto">
//           <table className="table-auto w-full text-sm">
//             <tbody>
//               <tr><td className="font-semibold py-2">Product code</td><td>#{product.id}</td></tr>
//               <tr><td className="font-semibold py-2">Product EAN</td><td>{product.ProductEan}</td></tr>
//               <tr><td className="font-semibold py-2">Country of origin</td><td>{product.country}</td></tr>
//               <tr><td className="font-semibold py-2">Frozen</td><td>{product.Frozen ? 'Yes' : 'No'}</td></tr>
//               <tr><td className="font-semibold py-2">Halal</td><td>{product.Halal ? 'Yes' : 'No'}</td></tr>
//               <tr><td className="font-semibold py-2">Languages on the Label</td><td>{product.languageoflabels}</td></tr>
//               <tr><td className="font-semibold py-2">New product</td><td>{product.NewProduct ? 'Yes' : 'No'}</td></tr>
//               <tr><td className="font-semibold py-2">Packaging composition</td><td>{product.PackingComposition}</td></tr>
//               <tr><td className="font-semibold py-2">Volume (ml)</td><td>{product.ml || '-'}</td></tr>
//               <tr><td className="font-semibold py-2">Weight (kg)</td><td>{product.kg || product.weight}</td></tr>
//               <tr><td className="font-semibold py-2">Variant</td><td>{product.variant}</td></tr>
//               <tr><td className="font-semibold py-2">Vegan</td><td>{product.Vegan ? 'Yes' : 'No'}</td></tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//         </div>
//         <SimpleDynamicRecommendations product={product} />
//       </main>

//       {/* Image Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Navigation Arrows */}
//             {product.galleryImg.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>
//               </>
//             )}

//             {/* Main Modal Image */}
//             <div className="relative w-full h-full flex items-center justify-center">
//               <Image
//                 src={product.galleryImg[selectedImageIndex] || product.thumbImg}
//                 alt={product.name}
//                 width={1200}
//                 height={1200}
//                 className="object-contain max-w-full max-h-full rounded-lg"
//               />
//             </div>

//             {/* Image Counter */}
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
//               {selectedImageIndex + 1} / {product.galleryImg.length}
//             </div>


//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }


// "use client";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import ReactCountryFlag from "react-country-flag";
// import { products } from "@/public/assets";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { LogIn, UserPlus, Globe, ZoomIn, ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Recommendations, SimpleDynamicRecommendations } from "../../components/Recommendations";
// import { useAuth } from "../../context/AuthContext";

// export default function ProductDetailPage() {
//   const { slug } = useParams();
//   const router = useRouter();
//   const { user, token } = useAuth();
//   const product = products.find((p) => p.slug === slug);

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showEnquiryForm, setShowEnquiryForm] = useState(false);
//   const [enquiryFormData, setEnquiryFormData] = useState({
//     productName: product?.name || "",
//     description: "",
//     quantity: "",
//     email: "",
//     phone: "",
//     Name: "",
//     companyName: ""
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isModalOpen]);

//   // Auto-fill form for logged-in users
//   useEffect(() => {
//     if (user && product) {
//       setEnquiryFormData(prev => ({
//         ...prev,
//         productName: product.name,
//         email: user.email || "",
//         phone: user.phone || "",
//         Name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
//         companyName: user.companyName || ""
//       }));
//     } else if (product) {
//       setEnquiryFormData(prev => ({
//         ...prev,
//         productName: product.name
//       }));
//     }
//   }, [user, product]);

//   if (!product)
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center p-8">
//           <div className="text-6xl mb-4">😔</div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
//           <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
//           <button
//             onClick={() => router.push('/')}
//             className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );

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

//   const nextImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === product.galleryImg.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === 0 ? product.galleryImg.length - 1 : prev - 1
//     );
//   };

//   const openModal = (index) => {
//     setSelectedImageIndex(index);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleEnquirySubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let response;

//       if (user) {
//         // For logged-in users
//         response = await fetch('https://devagroupon.onrender.com/api/productenquiry/enquiries', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             productName: enquiryFormData.productName,
//             description: enquiryFormData.description,
//             quantity: enquiryFormData.quantity
//           })
//         });
//       } else {
//         // For non-logged-in users
//         response = await fetch('https://devagroupon.onrender.com/api/products/enquiry/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(enquiryFormData)
//         });
//       }

//       const data = await response.json();

//       if (data.success) {
//         alert('Enquiry submitted successfully!');
//         setShowEnquiryForm(false);
//         setEnquiryFormData({
//           productName: product.name,
//           description: "",
//           quantity: "",
//           email: "",
//           phone: "",
//           Name: "",
//           companyName: ""
//         });
//       } else {
//         alert(data.message || 'Failed to submit enquiry');
//       }
//     } catch (error) {
//       console.error('Error submitting enquiry:', error);
//       alert('Failed to submit enquiry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEnquiryFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
//       <Navbar />

//       <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 lg:pt-32  py-8 lg:py-12">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
//           {/* LEFT SIDE - Product Images */}
//           <div className="space-y-6">
//             {/* Main Image */}
//             <div className="relative group">
//               <div
//                 className="relative w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 cursor-zoom-in transition-all duration-300 hover:shadow-2xl"
//                 onClick={() => openModal(selectedImageIndex)}
//               >
//                 <Image
//                   src={product.galleryImg[selectedImageIndex] || product.thumbImg}
//                   alt={product.name}
//                   fill
//                   className="object-contain p-8 transition-transform duration-500"
//                   priority
//                 />
//                 <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
//                   <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </div>

//               {/* Navigation Arrows */}
//               {product.galleryImg.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Image Gallery */}
//             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {product.galleryImg.map((img, index) => (
//                 <div
//                   key={index}
//                   className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${selectedImageIndex === index
//                       ? 'border-lime-500 shadow-md scale-105'
//                       : 'border-gray-200'
//                     }`}
//                   onClick={() => setSelectedImageIndex(index)}
//                 >
//                   <Image
//                     src={img}
//                     alt={`${product.name} - View ${index + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Image Counter */}
//             {product.galleryImg.length > 1 && (
//               <div className="text-center">
//                 <span className="inline-block bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
//                   {selectedImageIndex + 1} / {product.galleryImg.length}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* RIGHT SIDE - Product Details */}
//           <div className="flex flex-col pt-5 space-y-4">
//             {/* Header */}
//             <div className="space-y-2">
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
//                 {product.name}
//               </h1>
//             </div>
//             <div className="flex items-center gap-3">
//               <ReactCountryFlag
//                 countryCode={getCountryCode(product.country)}
//                 svg
//                 className="rounded-lg shadow-md"
//                 style={{ width: "2.5em", height: "2.5em" }}
//               />
//               <span className="text-gray-600 text-md font-medium bg-white px-3 py-1 rounded-lg shadow-sm">
//                 {product.country}
//               </span>
//             </div>

//             {/* Description */}
//             <p className="text-gray-600 text-sm leading-relaxed">
//               {product.shortDescription}
//             </p>

//             {/* Price Section */}
//             <div className="flex items-end gap-4">
//               <span className="text-2xl font-bold text-lime-600">
//                 ${product.discountPrice || product.price}
//               </span>
//               {product.discountPrice && (
//                 <>
//                   <span className="text-2xl text-gray-400 line-through">
//                     ${product.price}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Action Buttons Card */}
//             {user ? (
//               // Logged-in user - Only show the button without card background
//               <button
//                 onClick={() => setShowEnquiryForm(true)}
//                 className="flex items-center justify-center gap-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-lime-800 "
//               >
//                 <MessageCircle className="w-5 h-5" />
//                 <span>Product Enquiry</span>
//               </button>
//             ) : (
//               // Non-logged-in user - Show the complete card with background
//               <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-xl p-8 max-w-lg">
//                 {/* Online Badge */}
//                 <div className="absolute -top-4 -right-4 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl">
//                   <Globe className="w-5 h-5" />
//                 </div>

//                 <div className="text-center space-y-4">
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Access Real-time Information
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Log in to view live stock availability, current market prices, and place orders seamlessly.
//                   </p>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                   <button
//                     onClick={() => router.push('/login')}
//                     className="flex-1 flex items-center justify-center text-sm gap-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-lime-800 transition-all duration-200 transform hover:-translate-y-0.5"
//                   >
//                     <LogIn className="w-5 h-5" />
//                     <span>Sign In</span>
//                   </button>

//                   <button
//                     onClick={() => setShowEnquiryForm(true)}
//                     className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-300 bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl hover:border-lime-500 hover:bg-lime-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
//                   >
//                     <MessageCircle className="w-5 h-5 text-lime-600" />
//                     <span>Product Enquiry</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="mt-10">
//             <h2 className="text-2xl font-bold mb-4">General Specifications</h2>
//             <div className="border border-gray-200 rounded-md p-4 overflow-x-auto">
//               <table className="table-auto w-full text-sm">
//                 <tbody>
//                   <tr><td className="font-semibold py-2">Product code</td><td>#{product.id}</td></tr>
//                   <tr><td className="font-semibold py-2">Product EAN</td><td>{product.ProductEan}</td></tr>
//                   <tr><td className="font-semibold py-2">Country of origin</td><td>{product.country}</td></tr>
//                   <tr><td className="font-semibold py-2">Frozen</td><td>{product.Frozen ? 'Yes' : 'No'}</td></tr>
//                   <tr><td className="font-semibold py-2">Halal</td><td>{product.Halal ? 'Yes' : 'No'}</td></tr>
//                   <tr><td className="font-semibold py-2">Languages on the Label</td><td>{product.languageoflabels}</td></tr>
//                   <tr><td className="font-semibold py-2">New product</td><td>{product.NewProduct ? 'Yes' : 'No'}</td></tr>
//                   <tr><td className="font-semibold py-2">Packaging composition</td><td>{product.PackingComposition}</td></tr>
//                   <tr><td className="font-semibold py-2">Volume (ml)</td><td>{product.ml || '-'}</td></tr>
//                   <tr><td className="font-semibold py-2">Weight (kg)</td><td>{product.kg || product.weight}</td></tr>
//                   <tr><td className="font-semibold py-2">Variant</td><td>{product.variant}</td></tr>
//                   <tr><td className="font-semibold py-2">Vegan</td><td>{product.Vegan ? 'Yes' : 'No'}</td></tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <SimpleDynamicRecommendations product={product} />
//       </main>

//       {/* Image Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {product.galleryImg.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>
//               </>
//             )}

//             <div className="relative w-full h-full flex items-center justify-center">
//               <Image
//                 src={product.galleryImg[selectedImageIndex] || product.thumbImg}
//                 alt={product.name}
//                 width={1200}
//                 height={1200}
//                 className="object-contain max-w-full max-h-full rounded-lg"
//               />
//             </div>

//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
//               {selectedImageIndex + 1} / {product.galleryImg.length}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enquiry Form Modal */}
//       {showEnquiryForm && (
//         <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-900">Product Enquiry</h3>
//                 <button
//                   onClick={() => setShowEnquiryForm(false)}
//                   className="text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   name="productName"
//                   value={enquiryFormData.productName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm bg-gray-50"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={enquiryFormData.description}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                   rows="3"
//                   placeholder="Enter your requirements, specifications, or any additional details..."
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="quantity"
//                   value={enquiryFormData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                   placeholder="e.g., 100 units, 50 kg, 25 boxes"
//                   required
//                 />
//               </div>

//               {/* Additional fields for non-logged-in users */}
//               {!user && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Your Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={enquiryFormData.Name}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={enquiryFormData.email}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={enquiryFormData.phone}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Company Name
//                     </label>
//                     <input
//                       type="text"
//                       name="companyName"
//                       value={enquiryFormData.companyName}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => setShowEnquiryForm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || !enquiryFormData.description || !enquiryFormData.quantity || (!user && (!enquiryFormData.Name || !enquiryFormData.email || !enquiryFormData.phone))}
//                   className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm flex items-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Submitting...
//                     </>
//                   ) : (
//                     'Submit Enquiry'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }




"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LogIn, UserPlus, Globe, ZoomIn, ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Recommendations, SimpleDynamicRecommendations } from "../../components/Recommendations";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../components/apiService";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  // State for product and loading
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryFormData, setEnquiryFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    email: "",
    phone: "",
    Name: "",
    companyName: ""
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all products and find the one with matching slug
        const productsData = await apiService.getProducts();
        const foundProduct = productsData.find((p) => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Initialize form with product data
          setEnquiryFormData(prev => ({
            ...prev,
            productName: foundProduct.name
          }));
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Auto-fill form for logged-in users
  useEffect(() => {
    if (user && product) {
      setEnquiryFormData(prev => ({
        ...prev,
        productName: product.name,
        email: user.email || "",
        phone: user.phone || "",
        Name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        companyName: user.companyName || ""
      }));
    } else if (product) {
      setEnquiryFormData(prev => ({
        ...prev,
        productName: product.name
      }));
    }
  }, [user, product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/products/product1.webp";
    if (imgPath.startsWith('http')) return imgPath;
    
    // Handle different path formats
    let cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
    
    return `http://localhost:5000/${cleanPath}`;
  };

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

  const nextImage = () => {
    const galleryImages = product.galleryImg || [product.thumbImg];
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const galleryImages = product.galleryImg || [product.thumbImg];
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);

    try {
      let response;

      if (user) {
        // For logged-in users
        response = await fetch('https://devagroupon.onrender.com/api/productenquiry/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productName: enquiryFormData.productName,
            description: enquiryFormData.description,
            quantity: enquiryFormData.quantity
          })
        });
      } else {
        // For non-logged-in users
        response = await fetch('https://devagroupon.onrender.com/api/products/enquiry/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(enquiryFormData)
        });
      }

      const data = await response.json();

      if (data.success) {
        alert('Enquiry submitted successfully!');
        setShowEnquiryForm(false);
        setEnquiryFormData({
          productName: product.name,
          description: "",
          quantity: "",
          email: "",
          phone: "",
          Name: "",
          companyName: ""
        });
      } else {
        alert(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get gallery images - fallback to thumbImg if no gallery
  const galleryImages = product.galleryImg && product.galleryImg.length > 0 
    ? product.galleryImg 
    : [product.thumbImg];

  // Extract country name
  const countryName = product.country?.name || product.country;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 lg:pt-32  mt-20 sm:mt-0 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT SIDE - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div
                className="relative w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 cursor-zoom-in transition-all duration-300 hover:shadow-2xl"
                onClick={() => openModal(selectedImageIndex)}
              >
                <img
                  src={getImageUrl(galleryImages[selectedImageIndex])}
                  alt={product.name}
                  className="object-contain p-8 transition-transform duration-500"
                
                />
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Image Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${selectedImageIndex === index
                      ? 'border-lime-500 shadow-md scale-105'
                      : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.name} - View ${index + 1}`}
                    
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="text-center">
                <span className="inline-block bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Product Details */}
          <div className="flex flex-col pt-5 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ReactCountryFlag
                countryCode={getCountryCode(countryName)}
                svg
                className="rounded-lg shadow-md"
                style={{ width: "2.5em", height: "2.5em" }}
              />
              <span className="text-gray-600 text-md font-medium bg-white px-3 py-1 rounded-lg shadow-sm">
                {countryName}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.shortDescription || product.description || "No description available."}
            </p>

            {/* Price Section */}
            <div className="flex items-end gap-4">
              <span className="text-2xl font-bold text-lime-600">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.price}
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons Card */}
            {user ? (
              // Logged-in user - Only show the button without card background
              <button
                onClick={() => setShowEnquiryForm(true)}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-lime-800 "
              >
                <MessageCircle className="w-5 h-5" />
                <span>Product Enquiry</span>
              </button>
            ) : (
              // Non-logged-in user - Show the complete card with background
              <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-xl p-8 max-w-lg">
                {/* Online Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl">
                  <Globe className="w-5 h-5" />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Access Real-time Information
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Log in to view live stock availability, current market prices, and place orders seamlessly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => router.push('/login')}
                    className="flex-1 flex items-center justify-center text-sm gap-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-lime-800 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-300 bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl hover:border-lime-500 hover:bg-lime-50 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5 text-lime-600" />
                    <span>Product Enquiry</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">General Specifications</h2>
            <div className="border border-gray-200 rounded-md p-4 overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <tbody>
                  <tr><td className="font-semibold py-2">Product code</td><td>#{product._id?.$oid || product._id || product.id}</td></tr>
                  <tr><td className="font-semibold py-2">Product EAN</td><td>{product.ProductEan || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">Country of origin</td><td>{countryName}</td></tr>
                  <tr><td className="font-semibold py-2">Frozen</td><td>{product.Frozen ? 'Yes' : 'No'}</td></tr>
                  <tr><td className="font-semibold py-2">Halal</td><td>{product.Halal ? 'Yes' : 'No'}</td></tr>
                  <tr><td className="font-semibold py-2">Languages on the Label</td><td>{product.languageoflabels || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">New product</td><td>{product.NewProduct ? 'Yes' : 'No'}</td></tr>
                  <tr><td className="font-semibold py-2">Packaging composition</td><td>{product.PackingComposition || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">Volume (ml)</td><td>{product.ml || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">Weight (kg)</td><td>{product.kg || product.weight || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">Variant</td><td>{product.variant || '-'}</td></tr>
                  <tr><td className="font-semibold py-2">Vegan</td><td>{product.Vegan ? 'Yes' : 'No'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <SimpleDynamicRecommendations product={product} />
      </main>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={getImageUrl(galleryImages[selectedImageIndex])}
                alt={product.name}
                width={1200}
                height={1200}
                className="object-contain max-w-full max-h-full rounded-lg"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Product Enquiry</h3>
                <button
                  onClick={() => setShowEnquiryForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={enquiryFormData.productName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={enquiryFormData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                  rows="3"
                  placeholder="Enter your requirements, specifications, or any additional details..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={enquiryFormData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                  placeholder="e.g., 100 units, 50 kg, 25 boxes"
                  required
                />
              </div>

              {/* Additional fields for non-logged-in users */}
              {!user && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={enquiryFormData.Name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={enquiryFormData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={enquiryFormData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={enquiryFormData.companyName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEnquiryForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enquiryLoading || !enquiryFormData.description || !enquiryFormData.quantity || (!user && (!enquiryFormData.Name || !enquiryFormData.email || !enquiryFormData.phone))}
                  className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm flex items-center gap-2"
                >
                  {enquiryLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Enquiry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}