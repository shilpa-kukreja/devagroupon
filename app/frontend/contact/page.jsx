// components/ContactSection.jsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Truck, Building2, Warehouse, Send, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactSection = () => {
    const [activeTab, setActiveTab] = useState('head-office');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear any previous submit status when user starts typing
        if (submitStatus) setSubmitStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);

        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message
        };

        try {
            const res = await fetch('https://devagroupon.onrender.com/api/contact/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                // Auto-hide success message after 5 seconds
                setTimeout(() => setSubmitStatus(null), 5000);
            } else {
                setSubmitStatus('error');
                console.error('Server response not OK:', res.status);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    const offices = [
        {
            id: 'head-office',
            title: 'Head Office',
            icon: Building2,
            address: 'Steenwycklaan 2',
            city: '1424 NL, De Kwakel',
            country: 'The Netherlands',
            phone: '(+31) 888 880 288',
            hours: 'Mon-Fri: 6:30 AM - 6:00 PM',
            color: 'from-blue-500 to-cyan-500',
            mapQuery: 'Steenwycklaan+2+De+Kwakel+Netherlands'
        },
        {
            id: 'warehouse',
            title: 'Warehouse',
            icon: Warehouse,
            address: 'Boerhaaveweg 4',
            city: '2408 AD, Alphen aan den Rijn',
            country: 'The Netherlands',
            phone: '(+31) 888 880 288',
            hours: 'Mon-Fri: 6:30 AM - 6:00 PM',
            note: 'Pickup and delivery at warehouse only',
            color: 'from-emerald-500 to-green-500',
            mapQuery: 'Boerhaaveweg+4+Alphen+aan+den+Rijn+Netherlands'
        },
        {
            id: 'poland-office',
            title: 'Poland Office',
            icon: Building2,
            address: 'Ul. Grzecznarowskiego 2',
            city: '26-600 Radom',
            country: 'Poland',
            phone: '(+48) 483 850 100',
            hours: 'Mon-Fri: 6:30 AM - 6:00 PM',
            color: 'from-red-500 to-orange-500',
            mapQuery: 'Ul.+Grzecznarowskiego+2+Radom+Poland'
        }
    ];

    const contactMethods = [
        {
            icon: Phone,
            title: 'Call Us',
            description: '(+31) 888 880 288',
            subtitle: '6:30 AM - 6:00 PM CET',
            color: 'from-purple-500 to-indigo-500',
            href: 'tel:+31888880288'
        },
        {
            icon: Mail,
            title: 'Email Us',
            description: 'sales@beagleycopperman.com',
            subtitle: 'We respond within 24 hours',
            color: 'from-blue-500 to-cyan-500',
            href: 'mailto:sales@beagleycopperman.com'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            description: 'Monday - Friday',
            subtitle: '6:30 AM - 6:00 PM CET',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: Truck,
            title: 'Logistics Support',
            description: 'Distribution Network',
            subtitle: 'Across Europe',
            color: 'from-orange-500 to-amber-500'
        }
    ];

    const currentOffice = offices.find(office => office.id === activeTab);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
                <div className="absolute inset-0 bg-black/40"></div>
                <img 
                    src="/about/aboutus-hero1.webp" 
                    alt="Beagley Copperman Headquarters" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                            Get in touch with Europe's leading Asian food importer
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Contact Methods & Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Contact Methods Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactMethods.map((method, index) => (
                                    <motion.div
                                        key={method.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <method.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                                            {method.href ? (
                                                <a 
                                                    href={method.href}
                                                    className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors block mb-1"
                                                >
                                                    {method.description}
                                                </a>
                                            ) : (
                                                <p className="text-base font-medium text-gray-800 mb-1">{method.description}</p>
                                            )}
                                            <p className="text-sm text-gray-600">{method.subtitle}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
                                        <p className="text-gray-600">We'll get back to you within 24 hours</p>
                                    </div>
                                </div>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-emerald-800">Message sent successfully!</p>
                                            <p className="text-sm text-emerald-700">We'll get back to you soon.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {submitStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                                    >
                                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm font-bold">!</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-800">Failed to send message</p>
                                            <p className="text-sm text-red-700">Please try again or contact us directly.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="Your full name"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="your.email@example.com"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="+31 123 456 789"
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                required
                                                disabled={submitting}
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Product Information">Product Information</option>
                                                <option value="Wholesale Pricing">Wholesale Pricing</option>
                                                <option value="Distribution">Distribution</option>
                                                <option value="Technical Support">Technical Support</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                                            placeholder="Please describe your inquiry in detail..."
                                            required
                                            disabled={submitting}
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Office Locations */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Office Tabs */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="border-b border-gray-200">
                                    <div className="flex overflow-x-auto">
                                        {offices.map((office) => (
                                            <button
                                                key={office.id}
                                                onClick={() => setActiveTab(office.id)}
                                                className={`flex-1 min-w-0 px-6 py-4 text-center font-semibold transition-all duration-300 whitespace-nowrap ${
                                                    activeTab === office.id
                                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                            >
                                                {office.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Office Details */}
                                <div className="p-6">
                                    {currentOffice && (
                                        <motion.div
                                            key={currentOffice.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${currentOffice.color} rounded-xl flex items-center justify-center shadow-md`}>
                                                    <currentOffice.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{currentOffice.title}</h3>
                                                    <p className="text-gray-600 text-sm">Beagley Copperman BV</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{currentOffice.address}</p>
                                                        <p className="text-gray-600">{currentOffice.city}</p>
                                                        <p className="text-gray-600">{currentOffice.country}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <a 
                                                            href={`tel:${currentOffice.phone.replace(/[^\d+]/g, '')}`}
                                                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                                        >
                                                            {currentOffice.phone}
                                                        </a>
                                                        <p className="text-gray-600 text-sm">{currentOffice.hours}</p>
                                                    </div>
                                                </div>

                                                {currentOffice.note && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                                        <p className="text-amber-800 text-sm font-medium">
                                                            📝 {currentOffice.note}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Map */}
                                            <div className="rounded-xl overflow-hidden h-64 border border-gray-200">
                                                <iframe
                                                    title={`${currentOffice.title} Location`}
                                                    width="100%"
                                                    height="100%"
                                                    loading="lazy"
                                                    allowFullScreen
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${currentOffice.mapQuery}`}
                                                    className="border-0"
                                                ></iframe>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Company Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl"
                            >
                                <h3 className="text-2xl font-bold mb-6">Why Choose Beagley Copperman?</h3>
                                <div className="space-y-4">
                                    {[
                                        "Europe's leading Asian food importer with 20+ years experience",
                                        "Strategic distribution centers across Europe",
                                        "Dedicated multilingual customer support team",
                                        "Quality guaranteed products with full traceability",
                                        "Competitive wholesale pricing for businesses",
                                        "Fast and reliable logistics network"
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-blue-100">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactSection;