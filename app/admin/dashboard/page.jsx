"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes, overviewRes] = await Promise.all([
        fetch('https://devagroupon-1.onrender.com/api/dashboard/stats'),
        fetch('https://devagroupon-1.onrender.com/api/dashboard/charts'),
        fetch('https://devagroupon-1.onrender.com/api/dashboard/overview')
      ]);

      if (!statsRes.ok || !chartsRes.ok || !overviewRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, chartsData, overviewData] = await Promise.all([
        statsRes.json(),
        chartsRes.json(),
        overviewRes.json()
      ]);

      if (statsData.success && chartsData.success && overviewData.success) {
        setStats(statsData.data);
        setChartData(chartsData.data);
        setOverview(overviewData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const StatCard = ({ title, value, icon, color, growth, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 ${color.replace('border-', 'bg-').replace('-500', '-100')} rounded-lg`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
          </div>
        </div>
        {growth !== undefined && (
          <div className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {growth > 0 ? '↑' : growth < 0 ? '↓' : ''} {growth !== 0 ? `${Math.abs(growth)}%` : '0%'}
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 text-left group w-full"
    >
      <div className={`${color} mb-4 p-3 rounded-lg inline-block group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );

  // Format month labels for charts
  const formatMonthLabel = (item) => {
    if (!item?._id) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[item._id.month - 1]} ${item._id.year}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Admin Dashboard | Analytics Overview</title>
          <meta name="description" content="Comprehensive admin dashboard with analytics and insights" />
        </Head>

        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={overview?.totals?.products}
              growth={overview?.growth?.products}
              color="border-blue-500"
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4m4 8v1m-4-1v1m4-4v1m-4-1v1" />
                </svg>
              }
              onClick={() => router.push('/admin/products')}
            />

            <StatCard
              title="Total Enquiries"
              value={overview?.totals?.enquiries}
              growth={overview?.growth?.enquiries}
              color="border-purple-500"
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              onClick={() => router.push('/admin/enquiries')}
            />

            <StatCard
              title="Contact Messages"
              value={overview?.totals?.contacts}
              growth={overview?.growth?.contacts}
              color="border-green-500"
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              onClick={() => router.push('/admin/contacts')}
            />

            <StatCard
              title="Newsletter Subscribers"
              value={overview?.totals?.subscribers}
              growth={overview?.growth?.subscribers}
              color="border-orange-500"
              icon={
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              }
              onClick={() => router.push('/admin/subscribers')}
            />
          </div>

          {/* Pending Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Pending Actions</h3>
                  <p className="text-yellow-600">Require your attention</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-700">{stats?.breakdown?.pendingEnquiries || 0}</div>
                  <div className="text-sm text-yellow-600">Pending Enquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-700">{stats?.breakdown?.unreadContacts || 0}</div>
                  <div className="text-sm text-yellow-600">Unread Messages</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Quick Stats</h3>
                  <p className="text-blue-600">System overview</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{stats?.totals?.categories || 0}</div>
                  <div className="text-sm text-blue-600">Total Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{stats?.breakdown?.activeSubscribers || 0}</div>
                  <div className="text-sm text-blue-600">Active Subscribers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Products by Category */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
              {chartData?.productsByCategory && chartData.productsByCategory.length > 0 ? (
                <Bar
                  options={barOptions}
                  data={{
                    labels: chartData.productsByCategory.map(item => item.name),
                    datasets: [
                      {
                        label: 'Products',
                        data: chartData.productsByCategory.map(item => item.count),
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No product category data available
                </div>
              )}
            </div>

            {/* Activity Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trends (Last 6 Months)</h3>
              {chartData?.enquiriesByMonth && chartData.enquiriesByMonth.length > 0 ? (
                <Line
                  options={lineOptions}
                  data={{
                    labels: chartData.enquiriesByMonth.map(formatMonthLabel),
                    datasets: [
                      {
                        label: 'Enquiries',
                        data: chartData.enquiriesByMonth.map(item => item.count),
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                      },
                      {
                        label: 'Contacts',
                        data: chartData.contactsByMonth?.map(item => item.count) || [],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                      },
                    ],
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activity data available
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enquiries Status</h3>
              {stats?.charts?.enquiriesByStatus && stats.charts.enquiriesByStatus.length > 0 ? (
                <Doughnut
                  options={doughnutOptions}
                  data={{
                    labels: stats.charts.enquiriesByStatus.map(item => item._id),
                    datasets: [
                      {
                        data: stats.charts.enquiriesByStatus.map(item => item.count),
                        backgroundColor: [
                          'rgba(245, 158, 11, 0.8)',
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                        ],
                        borderColor: [
                          'rgb(245, 158, 11)',
                          'rgb(16, 185, 129)',
                          'rgb(59, 130, 246)',
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No enquiry status data available
                </div>
              )}
            </div>

            {/* Recent Enquiries */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Enquiries</h3>
                <button 
                  onClick={() => router.push('/admin/enquiries')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.recentEnquiries?.map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {enquiry.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{enquiry.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              enquiry.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : enquiry.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!stats?.recentEnquiries || stats.recentEnquiries.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No recent enquiries found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="Manage Products"
                description="Add, edit, or remove products from your catalog"
                icon={
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4m4 8v1m-4-1v1m4-4v1m-4-1v1" />
                  </svg>
                }
                color="bg-blue-100"
                onClick={() => router.push('/admin/add-product')}
              />

              <QuickActionCard
                title="View Enquiries"
                description="Manage and respond to customer enquiries"
                icon={
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                color="bg-purple-100"
                onClick={() => router.push('/admin/all-enquiries')}
              />

              <QuickActionCard
                title="Contact Messages"
                description="Review and respond to contact form submissions"
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
                color="bg-green-100"
                onClick={() => router.push('/admin/admin-contact')}
              />

              <QuickActionCard
                title="Subscribers"
                description="Manage newsletter subscribers and campaigns"
                icon={
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                }
                color="bg-orange-100"
                onClick={() => router.push('/admin/admin-subscriber')}
              />
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;