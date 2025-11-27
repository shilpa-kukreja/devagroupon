// components/VisionMission.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const VisionMission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 80, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const stats = [
    { number: '50+', label: 'Asian Products', icon: '🥢', color: 'from-orange-500 to-red-500' },
    { number: '15+', label: 'European Countries', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
    { number: '1000+', label: 'Happy Customers', icon: '😊', color: 'from-green-500 to-emerald-500' },
    { number: '2020', label: 'Year Established', icon: '🚀', color: 'from-purple-500 to-pink-500' }
  ];

  const values = [
    {
      icon: '🌏',
      title: 'Authenticity',
      description: 'Preserving the genuine character and taste of authentic Asian cuisine through traditional methods and premium ingredients',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously evolving with cutting-edge solutions to meet the dynamic needs of modern European markets',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      icon: '🤝',
      title: 'Partnership',
      description: 'Building lasting relationships with trusted local partners across Europe for mutual growth and success',
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: '❤️',
      title: 'Passion',
      description: 'Driven by an unwavering love for authentic Asian food culture and culinary excellence',
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-50 to-red-50',
      borderColor: 'border-rose-200'
    }
  ];

  return (
    <div ref={ref} className="min-h-screen  relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-25 animate-pulse animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="inline-block mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/25">
                <span className="text-4xl">🥢</span>
              </div>
            </motion.div>
            
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-6xl font-black bg-gray-900 bg-clip-text text-transparent mb-8 tracking-tight">
                DEAGLEY
                <span className="block text-5xl md:text-6xl bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mt-2">
                  COPPERMANS
                </span>
              </h1>
              
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg shadow-orange-500/50"></div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-80"></div>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mt-12 leading-relaxed font-light"
            >
              Bridging continents through <span className="font-semibold text-orange-400">culinary excellence</span>, we bring the authentic soul of Asian cuisine to European tables with innovation, passion, and uncompromising quality.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-400 font-medium text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Vision & Mission Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-24"
          >
            {/* Vision Card */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-12 bg-cyan-400 rounded-full mr-4 shadow-lg shadow-cyan-500/50"></div>
                        <h2 className="text-4xl font-bold text-white">Our Vision</h2>
                      </div>
                      <motion.div
                        variants={floatingVariants}
                        animate="float"
                        className="text-5xl opacity-90"
                      >
                        🌟
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                    <p className="text-xl text-cyan-100 font-light">
                      In an era of unprecedented global connectivity, the world is embracing the rich tapestry of Asian culinary traditions like never before.
                    </p>
                    <p>
                      As borders blur and cultures intertwine, there's a growing desire to experience the authentic flavors of the East from the comfort of home. Asian cuisine stands out for its <span className="highlight-cyan">health-conscious approach</span> and <span className="highlight-blue">sustainable practices</span>, offering a world of taste experiences that nourish both body and soul.
                    </p>
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-400 rounded-r-xl p-6 mt-8">
                      <p className="text-cyan-100 font-semibold text-lg">
                        At Deagley Coppermans, we're not just importing products – we're curating experiences. We transform the authentic passion for Asian food into accessible, inspiring culinary journeys for every European household.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
                {/* Header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full -translate-y-16 -translate-x-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/20 rounded-full translate-y-12 translate-x-12"></div>
                  
                  <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-12 bg-red-400 rounded-full mr-4 shadow-lg shadow-red-500/50"></div>
                        <h2 className="text-4xl font-bold text-white">Our Mission</h2>
                      </div>
                      <motion.div
                        variants={floatingVariants}
                        animate="float"
                        className="text-5xl opacity-90"
                      >
                        🎯
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                    <p>
                      As Europe's premier innovator in Asian food distribution, we serve a diverse network including specialty Asian markets, mainstream retailers, and food service leaders.
                    </p>
                    <p>
                      Through strategic partnerships and meticulous sourcing, we ensure every product maintains its <span className="highlight-orange">authentic character</span> while meeting the highest standards of <span className="highlight-emerald">European compliance</span>.
                    </p>
                    <p className="text-red-100 font-light">
                      Our passion fuels excellence in every aspect – from product selection to customer relationships and team development. We're not just suppliers; we're cultural ambassadors.
                    </p>
                    
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 mt-8">
                      <p className="text-xl font-bold text-center text-white">
                        Our ambition is clear: to become the <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">undisputed leader</span> in bringing authentic Asian culinary excellence to Europe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-5xl md:text-6xl font-black bg-gray-800 bg-clip-text text-transparent mb-6"
              >
                Our Core Values
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto font-light"
              >
                The guiding principles that shape our journey and define our legacy of excellence
              </motion.p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  onHoverStart={() => setActiveValue(index)}
                  className={`group cursor-pointer relative ${
                    activeValue === index ? 'z-10' : 'z-0'
                  }`}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${value.gradient} rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500`}></div>
                  <div className={`relative bg-slate-800 rounded-2xl p-8 h-full border ${value.borderColor} border-opacity-20 group-hover:border-opacity-40 transition-all duration-500 backdrop-blur-sm`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-3xl">{value.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center mb-4">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-center">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active Value Spotlight */}
            {/* <motion.div
              key={activeValue}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 border border-white/10">
                <div className={`w-3 h-3 bg-gradient-to-br ${values[activeValue].gradient} rounded-full animate-pulse`}></div>
                <span className="text-gray-400 text-sm font-medium">
                  Currently viewing: <span className="text-white">{values[activeValue].title}</span>
                </span>
              </div>
            </motion.div> */}
          </motion.div>

          {/* CTA Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 border border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-cyan-500/5"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience Authentic Asian Excellence?
                </h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join us in our mission to bring the finest Asian culinary experiences to Europe. Let's create something extraordinary together.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
                >
                  Start Your Journey
                </motion.button>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>

      <style jsx>{`
        .highlight-cyan {
          background: linear-gradient(120deg, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0) 70%);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .highlight-blue {
          background: linear-gradient(120deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .highlight-orange {
          background: linear-gradient(120deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0) 70%);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .highlight-emerald {
          background: linear-gradient(120deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default VisionMission;