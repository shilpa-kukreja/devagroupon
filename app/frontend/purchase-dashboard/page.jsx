// // components/PurchaseDashboard.jsx
// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/AuthContext';

// export default function PurchaseDashboard() {
//   const { user, token, logout } = useAuth();
//   const router = useRouter();
//   const [enquiries, setEnquiries] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showEnquiryForm, setShowEnquiryForm] = useState(false);
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // New state for products
//   const [products, setProducts] = useState([]);
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
  
//   const [formData, setFormData] = useState({
//     productId: '',
//     productName: '',
//     description: '',
//     quantity: ''
//   });
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   useEffect(() => {
//     if (!user || user.role !== 'purchase') {
//       router.push('/');
//       return;
//     }
//     fetchDashboardData();
//   }, [user, router]);

//   const fetchDashboardData = async () => {
//     try {
//       const [enquiriesRes, statsRes] = await Promise.all([
//         fetch('https://devagroupon.onrender.com/api/productenquiry/my', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch('https://devagroupon.onrender.com/api/productenquiry/stats', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       const enquiriesData = await enquiriesRes.json();
//       const statsData = await statsRes.json();

//       if (enquiriesData.success) setEnquiries(enquiriesData.data);
//       if (statsData.success) setStats(statsData.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch products from sales API
//   const fetchProducts = async (search = '') => {
//     setProductsLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: '1',
//         limit: '100',
//         search: search,
//         status: 'active'
//       }).toString();

//       const response = await fetch(`https://devagroupon.onrender.com/api/product/products?${queryParams}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (data.success) {
//         setProducts(data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   // Open enquiry form and load products
//   const handleOpenEnquiryForm = () => {
//     setShowEnquiryForm(true);
//     fetchProducts(); // Load initial products
//   };

//   // Handle product selection from dropdown
//   const handleProductSelect = (product) => {
//     setFormData({
//       ...formData,
//       productId: product._id,
//       productName: product.name
//       // Description is NOT auto-filled
//     });
//     setShowProductDropdown(false);
//   };

//   // Handle product search for dropdown
//   const handleProductSearch = (searchValue) => {
//     fetchProducts(searchValue);
//   };

//   // Toggle product dropdown
//   const toggleProductDropdown = () => {
//     if (!showProductDropdown) {
//       fetchProducts(); // Load products when opening dropdown
//     }
//     setShowProductDropdown(!showProductDropdown);
//   };

//   const handleGoHome = () => {
//     router.push('/');
//   };

//   const handleSubmitEnquiry = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('https://devagroupon.onrender.com/api/productenquiry/enquiries', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           productName: formData.productName,
//           description: formData.description,
//           quantity: formData.quantity,
//           productId: formData.productId
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         setShowEnquiryForm(false);
//         setFormData({
//           productId: '',
//           productName: '',
//           description: '',
//           quantity: ''
//         });
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('Error submitting enquiry:', error);
//     }
//   };

//   const handleDeleteEnquiry = async (id) => {
//     if (confirm('Are you sure you want to delete this enquiry?')) {
//       try {
//         const response = await fetch(`https://devagroupon.onrender.com/api/productenquiry/${id}`, {
//           method: 'DELETE',
//           headers: { 'Authorization': `Bearer ${token}` }
//         });

//         const data = await response.json();
//         if (data.success) {
//           fetchDashboardData();
//         }
//       } catch (error) {
//         console.error('Error deleting enquiry:', error);
//       }
//     }
//   };

//   // Filter enquiries based on search and tab
//   const filteredEnquiries = enquiries.filter(enquiry => {
//     const matchesSearch = enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          enquiry.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesTab = activeTab === 'all' || enquiry.status === activeTab;
//     return matchesSearch && matchesTab;
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentEnquiries = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': 
//         return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       case 'processing': 
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'cancelled': 
//         return 'bg-red-100 text-red-800 border-red-200';
//       default: 
//         return 'bg-amber-100 text-amber-800 border-amber-200';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'completed': return '✅';
//       case 'processing': return '🔄';
//       case 'cancelled': return '❌';
//       default: return '⏳';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="text-gray-600 font-medium">Loading procurement dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-lg">🏢</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Procurement Management System</h1>
//                 <p className="text-gray-600 text-sm">
//                   Welcome back, {user?.firstName} {user?.lastName}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="text-right hidden sm:block">
//                 <p className="text-sm font-medium text-gray-900">{user?.companyName}</p>
//                 <p className="text-xs text-gray-500">Procurement Manager</p>
//               </div>
              
//               {/* Home Button */}
//               <button
//                 onClick={handleGoHome}
//                 className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow-sm flex items-center gap-2 border border-gray-300"
//               >
//                 <span>🏠</span>
//                 Home
//               </button>
              
//               <button
//                 onClick={logout}
//                 className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium shadow-sm border border-red-200 flex items-center gap-2"
//               >
//                 <span>🚪</span>
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           {[
//             { label: 'Total Enquiries', value: stats.total || 0, color: 'blue', icon: '📊' },
//             { label: 'Pending', value: stats.pending || 0, color: 'amber', icon: '⏳' },
//             { label: 'Processing', value: stats.processing || 0, color: 'blue', icon: '🔄' },
//             { label: 'Completed', value: stats.completed || 0, color: 'emerald', icon: '✅' },
//             { label: 'Cancelled', value: stats.cancelled || 0, color: 'red', icon: '❌' }
//           ].map((stat, index) => (
//             <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
//                   <div className={`text-2xl font-bold text-${stat.color}-600 mt-2`}>
//                     {stat.value}
//                   </div>
//                 </div>
//                 <div className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center shadow-sm`}>
//                   <span className="text-xl">{stat.icon}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Actions Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">Product Enquiry Management</h2>
//               <p className="text-gray-600 text-sm mt-1">Track and manage procurement requests</p>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search enquiries..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-64 text-sm"
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   🔍
//                 </div>
//               </div>
//               <button
//                 onClick={handleOpenEnquiryForm}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
//               >
//                 <span className="text-lg">+</span>
//                 Create Enquiry
//               </button>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 mt-6 border-b border-gray-200 overflow-x-auto">
//             {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap ${
//                   activeTab === tab
//                     ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)} 
//                 {tab !== 'all' && ` (${stats[tab] || 0})`}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Enquiry Form Modal */}
//         {showEnquiryForm && (
//           <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-900">New Product Enquiry</h3>
//                   <button
//                     onClick={() => {
//                       setShowEnquiryForm(false);
//                       setFormData({
//                         productId: '',
//                         productName: '',
//                         description: '',
//                         quantity: ''
//                       });
//                       setShowProductDropdown(false);
//                     }}
//                     className="text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//               <form onSubmit={handleSubmitEnquiry} className="p-6 space-y-4">
//                 {/* Product Selection Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Product <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={toggleProductDropdown}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white text-left flex justify-between items-center"
//                     >
//                       <span className={formData.productName ? "text-gray-900" : "text-gray-500"}>
//                         {formData.productName || "Choose a product..."}
//                       </span>
//                       <span className="text-gray-400 transform transition-transform">
//                         {showProductDropdown ? '▲' : '▼'}
//                       </span>
//                     </button>

//                     {/* Product Dropdown */}
//                     {showProductDropdown && (
//                       <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
//                         {/* Search Box inside Dropdown */}
//                         <div className="p-2 border-b border-gray-200">
//                           <input
//                             type="text"
//                             placeholder="Search products..."
//                             onChange={(e) => handleProductSearch(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           />
//                         </div>

//                         {productsLoading ? (
//                           <div className="p-4 text-center text-gray-500 text-sm">
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
//                             <p className="mt-1">Loading products...</p>
//                           </div>
//                         ) : products.length === 0 ? (
//                           <div className="p-4 text-center text-gray-500 text-sm">
//                             No products found
//                           </div>
//                         ) : (
//                           products.map((product) => (
//                             <div
//                               key={product._id}
//                               onClick={() => handleProductSelect(product)}
//                               className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
//                             >
//                               <div className="font-medium text-sm text-gray-900">{product.name}</div>
//                               {product.sku && (
//                                 <div className="text-xs text-gray-500 mt-1">SKU: {product.sku}</div>
//                               )}
//                               {product.category?.name && (
//                                 <div className="text-xs text-gray-500">Category: {product.category.name}</div>
//                               )}
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Selected Product Display */}
//                   {formData.productName && (
//                     <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <div className="font-medium text-sm text-blue-800">
//                             Selected Product: {formData.productName}
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setFormData(prev => ({
//                               ...prev,
//                               productId: '',
//                               productName: ''
//                             }));
//                           }}
//                           className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                         >
//                           Change
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                     rows="3"
//                     placeholder="Enter product specifications, requirements, or additional details..."
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Quantity <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.quantity}
//                     onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                     placeholder="e.g., 100 units, 50 kg, 25 boxes"
//                   />
//                 </div>

//                 <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowEnquiryForm(false);
//                       setFormData({
//                         productId: '',
//                         productName: '',
//                         description: '',
//                         quantity: ''
//                       });
//                       setShowProductDropdown(false);
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={!formData.productName || !formData.quantity || !formData.description}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm"
//                   >
//                     Submit Enquiry
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Enquiries Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {filteredEnquiries.length === 0 ? (
//             <div className="p-12 text-center text-gray-500">
//               <div className="text-4xl mb-4">📋</div>
//               <p className="text-lg font-medium mb-2">No enquiries found</p>
//               <p className="text-sm mb-4">Create your first product enquiry to get started</p>
//               <button
//                 onClick={handleOpenEnquiryForm}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
//               >
//                 Create Enquiry
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 bg-white">
//                     {currentEnquiries.map((enquiry) => (
//                       <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="px-6 py-4">
//                           <div className="font-medium text-gray-900 text-sm">{enquiry.productName}</div>
//                           <div className="text-xs text-gray-500 mt-1 line-clamp-2">{enquiry.description}</div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900 font-medium">{enquiry.quantity}</td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-sm">{getStatusIcon(enquiry.status)}</span>
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)}`}>
//                               {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </td>
//                         <td className="px-6 py-4">
//                           <button
//                             onClick={() => handleDeleteEnquiry(enquiry._id)}
//                             className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 px-3 py-1 rounded hover:bg-red-50"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="flex items-center gap-4 text-sm text-gray-700">
//                   <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEnquiries.length)} of {filteredEnquiries.length} entries</span>
                  
//                   <div className="flex items-center gap-2">
//                     <span>Rows per page:</span>
//                     <select
//                       value={itemsPerPage}
//                       onChange={handleItemsPerPageChange}
//                       className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="5">5</option>
//                       <option value="10">10</option>
//                       <option value="25">25</option>
//                       <option value="50">50</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                   >
//                     Previous
//                   </button>
                  
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1 border text-sm rounded transition-colors ${
//                         currentPage === page
//                           ? 'bg-blue-600 text-white border-blue-600'
//                           : 'border-gray-300 text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Quick Actions Footer */}
//         <div className="mt-6 flex justify-between items-center">
//           <button
//             onClick={handleGoHome}
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-2"
//           >
//             <span>←</span>
//             Back to Home
//           </button>
          
//           <div className="text-sm text-gray-500">
//             Need help? Contact support
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// components/PurchaseDashboard.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function PurchaseDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New state for products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    description: '',
    quantity: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'purchase') {
      router.push('/');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const [enquiriesRes, statsRes] = await Promise.all([
        fetch('https://devagroupon.onrender.com/api/productenquiry/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://devagroupon.onrender.com/api/productenquiry/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const enquiriesData = await enquiriesRes.json();
      const statsData = await statsRes.json();

      if (enquiriesData.success) setEnquiries(enquiriesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from sales API
  const fetchProducts = async (search = '') => {
    setProductsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '100',
        search: search,
        status: 'active'
      }).toString();

      const response = await fetch(`https://devagroupon.onrender.com/api/product/products?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Open enquiry form and load products
  const handleOpenEnquiryForm = () => {
    setShowEnquiryForm(true);
    fetchProducts(); // Load initial products
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product) => {
    setFormData({
      ...formData,
      productId: product._id,
      productName: product.name
      // Description is NOT auto-filled
    });
    setShowProductDropdown(false);
  };

  // Handle product search for dropdown
  const handleProductSearch = (searchValue) => {
    fetchProducts(searchValue);
  };

  // Toggle product dropdown
  const toggleProductDropdown = () => {
    if (!showProductDropdown) {
      fetchProducts(); // Load products when opening dropdown
    }
    setShowProductDropdown(!showProductDropdown);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://devagroupon.onrender.com/api/productenquiry/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productName: formData.productName,
          description: formData.description,
          quantity: formData.quantity,
          productId: formData.productId
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowEnquiryForm(false);
        setFormData({
          productId: '',
          productName: '',
          description: '',
          quantity: ''
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await fetch(`https://devagroupon.onrender.com/api/productenquiry/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  // Filter enquiries based on search and tab
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || enquiry.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': 
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'processing': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '🔄';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading procurement dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm sm:text-lg">🏢</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Procurement Management</h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Welcome, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg">☰</span>
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.companyName}</p>
                <p className="text-xs text-gray-500">Procurement Manager</p>
              </div>
              
              {/* Home Button */}
              <button
                onClick={handleGoHome}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow-sm flex items-center gap-2 border border-gray-300"
              >
                <span>🏠</span>
                Home
              </button>
              
              <button
                onClick={logout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium shadow-sm border border-red-200 flex items-center gap-2"
              >
                <span>🚪</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 pt-4 pb-2">
              <div className="flex flex-col space-y-3">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{user?.companyName}</p>
                  <p className="text-xs text-gray-500">Procurement Manager</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGoHome}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2 border border-gray-300"
                  >
                    <span>🏠</span>
                    Home
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2 border border-red-200"
                  >
                    <span>🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {[
            { label: 'Total', value: stats.total || 0, color: 'blue', icon: '📊' },
            { label: 'Pending', value: stats.pending || 0, color: 'amber', icon: '⏳' },
            { label: 'Processing', value: stats.processing || 0, color: 'blue', icon: '🔄' },
            { label: 'Completed', value: stats.completed || 0, color: 'emerald', icon: '✅' },
            { label: 'Cancelled', value: stats.cancelled || 0, color: 'red', icon: '❌' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">{stat.label}</p>
                  <div className={`text-lg sm:text-xl lg:text-2xl font-bold text-${stat.color}-600 mt-1 sm:mt-2`}>
                    {stat.value}
                  </div>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center shadow-sm`}>
                  <span className="text-sm sm:text-base lg:text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Product Enquiry Management</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Track and manage procurement requests</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              <button
                onClick={handleOpenEnquiryForm}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md text-sm sm:text-base justify-center"
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Create Enquiry</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Tabs - Mobile Scrollable */}
          <div className="flex space-x-1 mt-4 sm:mt-6 border-b border-gray-200 overflow-x-auto">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                {tab !== 'all' && ` (${stats[tab] || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiry Form Modal - Mobile Responsive */}
        {showEnquiryForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">New Product Enquiry</h3>
                  <button
                    onClick={() => {
                      setShowEnquiryForm(false);
                      setFormData({
                        productId: '',
                        productName: '',
                        description: '',
                        quantity: ''
                      });
                      setShowProductDropdown(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmitEnquiry} className="p-4 sm:p-6 space-y-4">
                {/* Product Selection Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={toggleProductDropdown}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white text-left flex justify-between items-center"
                    >
                      <span className={formData.productName ? "text-gray-900" : "text-gray-500 truncate"}>
                        {formData.productName || "Choose a product..."}
                      </span>
                      <span className="text-gray-400 transform transition-transform flex-shrink-0 ml-2">
                        {showProductDropdown ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Product Dropdown */}
                    {showProductDropdown && (
                      <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                        {/* Search Box inside Dropdown */}
                        <div className="p-2 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search products..."
                            onChange={(e) => handleProductSearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {productsLoading ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-1">Loading products...</p>
                          </div>
                        ) : products.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No products found
                          </div>
                        ) : (
                          products.map((product) => (
                            <div
                              key={product._id}
                              onClick={() => handleProductSelect(product)}
                              className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                            >
                              <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                              {product.sku && (
                                <div className="text-xs text-gray-500 mt-1">SKU: {product.sku}</div>
                              )}
                              {product.category?.name && (
                                <div className="text-xs text-gray-500 truncate">Category: {product.category.name}</div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Product Display */}
                  {formData.productName && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-blue-800 truncate">
                            Selected: {formData.productName}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              productId: '',
                              productName: ''
                            }));
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex-shrink-0 ml-2"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    rows="3"
                    placeholder="Enter product specifications, requirements, or additional details..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    placeholder="e.g., 100 units, 50 kg, 25 boxes"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnquiryForm(false);
                      setFormData({
                        productId: '',
                        productName: '',
                        description: '',
                        quantity: ''
                      });
                      setShowProductDropdown(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.productName || !formData.quantity || !formData.description}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enquiries Table - Mobile Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredEnquiries.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-base sm:text-lg font-medium mb-2">No enquiries found</p>
              <p className="text-xs sm:text-sm mb-4">Create your first product enquiry to get started</p>
              <button
                onClick={handleOpenEnquiryForm}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
              >
                Create Enquiry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {currentEnquiries.map((enquiry) => (
                    <div key={enquiry._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">Product Details</h3>
                          <div className="font-medium text-gray-900 text-sm">{enquiry.productName}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{enquiry.description}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <div className="font-medium text-gray-900">{enquiry.quantity}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm">{getStatusIcon(enquiry.status)}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)}`}>
                                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <div className="text-gray-500">
                              {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => handleDeleteEnquiry(enquiry._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 px-3 py-1 rounded hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden lg:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentEnquiries.map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 text-sm">{enquiry.productName}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{enquiry.description}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{enquiry.quantity}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getStatusIcon(enquiry.status)}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(enquiry.status)}`}>
                              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteEnquiry(enquiry._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 px-3 py-1 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls - Mobile Responsive */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 flex-wrap">
                  <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEnquiries.length)} of {filteredEnquiries.length}</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Rows:</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Prev
                  </button>
                  
                  {/* Simplified pagination for mobile */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-2 sm:px-3 py-1 border text-xs sm:text-sm rounded transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={handleGoHome}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>←</span>
            Back to Home
          </button>
          
          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
            Need help? Contact support
          </div>
        </div>
      </div>
    </div>
  );
}