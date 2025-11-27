'use client';

import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function BlogDetailPage({ params }) {
    const { blogs } = useAuth();
    const { slug } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const blogData = blogs.find((b) => b.blogSlug === slug);
    const latestBlogs = blogs.slice(0, 4);

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blogData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-md mx-4 border border-gray-100">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            The blog post you're looking for doesn't exist or may have been moved to a different location.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Blog
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Format date for better readability
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate read time
    const calculateReadTime = (content) => {
        if (!content) return '5 min read';
        const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        return `${readTime} min read`;
    };

    const getImageUrl = (blogImg) => {
        if (!blogImg) return '/images/blog-placeholder.jpg';
        const cleanPath = blogImg.startsWith('/') ? blogImg.slice(1) : blogImg;
        return `http://localhost:5000/${cleanPath}`;
    };

    const handleShare = async (platform) => {
        const url = `${window.location.origin}/blog/${blogData.blogSlug}`;
        const title = blogData.blogName;
        const text = blogData.blogDetail.substring(0, 100) + '...';

        switch (platform) {
            case 'copy':
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title, text, url });
                }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
            <Navbar />

            <main className="flex-grow pt-20 pb-20">
                {/* Enhanced Breadcrumb */}
                <div className="container mx-auto px-4 max-w-7xl mb-12">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href="/" className="hover:text-amber-700 transition-colors duration-200 font-medium">
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/blog" className="hover:text-amber-700 transition-colors duration-200 font-medium">
                            Blog
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-semibold truncate max-w-xs lg:max-w-md">
                            {blogData.blogName}
                        </span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Content */}
                        <article className="lg:w-2/3">
                            {/* Blog Header */}
                            <header className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                                        Featured
                                    </span>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {formatDate(blogData.blogDate)}
                                    </span>
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                                    {blogData.blogName}
                                </h1>

                                <div className="flex items-center justify-between py-6 border-y border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center shadow-md">
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Beagley Copperman</p>
                                            <p className="text-sm text-gray-600">Industry Insights</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Reading time</p>
                                        <p className="font-semibold text-gray-900">{calculateReadTime(blogData.blogDetail)}</p>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
                                <Image
                                    src={getImageUrl(blogData.blogImg)}
                                    alt={blogData.blogName}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            </div>

                            {/* Blog Content */}
                            <div className="prose prose-lg max-w-none mb-16">
                                <div className="text-gray-700 leading-relaxed space-y-8 text-lg">
                                    {blogData.blogDetail.split('\n').map((paragraph, index) => (
                                        <p key={index} className="leading-8 text-justify">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Social Sharing */}
                           <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-8 mb-12 border border-amber-200/50 shadow-sm">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
    {/* Text Content */}
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Found this article helpful?</h3>
      </div>
      {/* <p className="text-gray-600 text-lg leading-relaxed">
        Share valuable insights with your professional network and help others discover this content.
      </p> */}
    </div>

    {/* Social Sharing Buttons */}
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Platform Buttons */}
      <div className="flex items-center gap-3">
        {[
          {
            platform: 'twitter',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.033 10.033 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            ),
            color: 'hover:bg-blue-500 hover:text-white'
          },
          {
            platform: 'linkedin',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            ),
            color: 'hover:bg-blue-700 hover:text-white'
          },
          {
            platform: 'facebook',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            ),
            color: 'hover:bg-blue-600 hover:text-white'
          }
        ].map(({ platform, icon, color }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`
              w-12 h-12 flex items-center justify-center 
              bg-white text-gray-600 rounded-xl 
              border border-gray-200 shadow-sm
              transition-all duration-300 ease-out
              hover:shadow-lg hover:scale-105
              ${color}
              group relative
            `}
            aria-label={`Share on ${platform}`}
          >
            {icon}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Share on {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {/* Copy Link Button */}
      <div className="relative">
        <button
          onClick={() => handleShare('copy')}
          className={`
            flex items-center gap-3 px-6 py-3 
            font-semibold rounded-xl 
            transition-all duration-300 ease-out
            shadow-md hover:shadow-lg
            transform hover:scale-105
            min-w-[140px] justify-center
            ${copied 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
            }
          `}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Copy Link</span>
            </>
          )}
        </button>
        
        {/* Success Tooltip */}
        {copied && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg shadow-lg animate-bounce">
            <div className="relative">
              Link copied to clipboard!
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

 
</div>

                            {/* Back to Blog */}
                            <div className="text-center">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300"
                                >
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to All Articles
                                </Link>
                            </div>
                        </article>

                        {/* Enhanced Sidebar */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-24 space-y-8">
                                {/* Latest Posts */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                                        <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {latestBlogs.map((latestBlog) => (
                                            <Link
                                                href={`/blog/${latestBlog.blogSlug}`}
                                                key={latestBlog._id}
                                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group border border-transparent hover:border-amber-100"
                                            >
                                                <div className="relative w-20 h-20 flex-shrink-0">
                                                    <Image
                                                        src={getImageUrl(latestBlog.blogImg)}
                                                        alt={latestBlog.blogName}
                                                        fill
                                                        className="object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
                                                        {latestBlog.blogName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        {formatDate(latestBlog.blogDate)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Newsletter Subscription */}
                                {/* <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-8 text-white">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-amber-100 leading-relaxed">
                      Get the latest articles and industry insights delivered to your inbox.
                    </p>
                  </div>
                  <form className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-white text-amber-600 hover:bg-gray-100 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Subscribe Now
                    </button>
                  </form>
                </div> */}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}