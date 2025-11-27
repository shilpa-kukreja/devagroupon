import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const BlogSection = () => {
  const { blogs } = useAuth();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate read time based on content
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  // Get excerpt from blog detail
  const getExcerpt = (content, maxLength = 120) => {
    if (!content) return 'No description available';
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to get proper image URL
  const getImageUrl = (blogImg) => {
    if (!blogImg) return '/images/blog-placeholder.jpg';
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = blogImg.startsWith('/') ? blogImg.slice(1) : blogImg;
    
    return `http://localhost:5000/${cleanPath}`;
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-50 rounded-full opacity-40 -translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-50 rounded-full opacity-30 translate-x-48 translate-y-48"></div>
      
      <div className="w-full mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            BEAGLEY <span className="text-green-600">NEWS</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest trends, product launches, and industry insights from Beagley Copperman
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {blogs && blogs.length > 0 ? (
            blogs.slice(0, 4).map((post) => (
              <article
                key={post._id}
                className="group bg-white rounded-md shadow-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={getImageUrl(post.blogImg)}
                    alt={post.blogName || 'Blog post'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full border border-green-200">
                      {post.category || 'News'}
                    </span>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date and Read Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(post.blogDate || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {calculateReadTime(post.blogDetail)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                    {post.blogName}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {getExcerpt(post.blogDetail)}
                  </p>

                  {/* Read More Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link 
                      href={`/frontend/blog/${post.blogSlug || post._id}`}
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
                    >
                      Read More
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    
                    {/* Share Icon */}
                    <button 
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.blogName,
                            text: getExcerpt(post.blogDetail, 100),
                            url: `${window.location.origin}/blog/${post.blogSlug || post._id}`,
                          });
                        } else {
                          navigator.clipboard.writeText(`${window.location.origin}/blog/${post.blogSlug || post._id}`);
                          // You can add a toast notification here
                          console.log('Link copied to clipboard');
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </article>
            ))
          ) : (
            // Empty state when no blogs
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9v-2" />
                </svg>
                <p className="text-xl font-medium text-gray-500 mb-2">No articles yet</p>
                <p className="text-sm text-gray-400 max-w-sm">
                  Check back soon for the latest updates and news
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View All CTA - Only show if there are blogs */}
        {blogs && blogs.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <span>View All Articles</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;