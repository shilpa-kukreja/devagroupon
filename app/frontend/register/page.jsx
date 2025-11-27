"use client";
import { useState } from 'react';
import { BuildingOffice2Icon, UserIcon, TruckIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BusinessRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    vatNumber: '',
    chamberOfCommerce: '',
    eoriNumber: '',
    annualTurnover: '',
    openingHours: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    role: '',
    email: '',
    password: '',
    phone: '',
    preferredLanguage: '',
    street: '',
    postalCode: '',
    city: '',
    country: '',
    hasForklift: '',
    reachableByTruck: '',
    hasTailLift: '',
    needsTailLift: ''
  });

  const steps = [
    { number: 1, title: 'Company Details', icon: BuildingOffice2Icon },
    { number: 2, title: 'Personal Details', icon: UserIcon },
    { number: 3, title: 'Delivery Details', icon: TruckIcon }
  ];

  const businessTypes = [
    'Restaurant',
    'Supermarket',
    'Wholesaler',
    'Retail Store',
    'Hotel',
    'Catering Service',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate required fields before moving to next step
  const validateStep = () => {
    if (currentStep === 1) {
      const requiredFields = ['companyName', 'businessType', 'vatNumber'];
      return requiredFields.every((field) => formData[field].trim() !== '');
    } else if (currentStep === 2) {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'street', 'postalCode', 'city', 'country'];
      return requiredFields.every((field) => formData[field].trim() !== '');
    } else if (currentStep === 3) {
      // All fields in step 3 are optional, so no validation needed
      return true;
    }
    return false;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      alert('Please fill all required fields before proceeding to the next step.');
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted from step:', currentStep);
    
    // Only allow submission from step 3 and only when Submit button is clicked
    if (currentStep !== 3) {
      console.log('Submission blocked - not on step 3');
      return;
    }

    // Final validation before submission
    if (!validateStep()) {
      alert('Please fill all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/businessregistration/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Business registered successfully!");
        // Reset form
        setFormData({
          companyName: '',
          businessType: '',
          vatNumber: '',
          chamberOfCommerce: '',
          eoriNumber: '',
          annualTurnover: '',
          openingHours: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: '',
          role: '',
          email: '',
          password: '',
          phone: '',
          preferredLanguage: '',
          street: '',
          postalCode: '',
          city: '',
          country: '',
          hasForklift: '',
          reachableByTruck: '',
          hasTailLift: '',
          needsTailLift: ''
        });
        setCurrentStep(1);
      } else {
        alert(data.message || "Failed to register business");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission prevention
  const handleFormSubmit = (e) => {
    // Only allow submission when on step 3 and Submit button is explicitly clicked
    if (currentStep !== 3) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Form submission prevented - not on final step');
      return false;
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <img src="/banner/newsletterbanner.webp" alt="" />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Register Your Business with Beagley Copperman
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Gain access to our range of over 3,500 authentic Asian food and non-food products.
                Request your account and enjoy personal service, exclusive offers, and your own online ordering platform.
              </p>
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
                <p className="text-amber-800 font-medium">
                  Minimum order value: €1000 (UK £2500)
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${currentStep >= step.number
                            ? 'bg-lime-500 border-lime-500 text-white'
                            : 'border-gray-300 text-gray-300'
                          } transition-colors duration-200`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircleIcon className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-lime-600' : 'text-gray-400'
                          }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${currentStep > step.number ? 'bg-lime-500' : 'bg-gray-200'
                          } transition-colors duration-200`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Remove form tag and use div instead to prevent auto-submission */}
            <div className="bg-white rounded-md border border-gray-300 shadow-md overflow-hidden">

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Details</h2>
                    <p className="text-gray-600">Tell us about your business</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type of Business *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                        required
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VAT Number *
                      </label>
                      <input
                        type="text"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chamber of Commerce Number
                      </label>
                      <input
                        type="text"
                        name="chamberOfCommerce"
                        value={formData.chamberOfCommerce}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EORI Number
                      </label>
                      <input
                        type="text"
                        name="eoriNumber"
                        value={formData.eoriNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Turnover
                      </label>
                      <select
                        name="annualTurnover"
                        value={formData.annualTurnover}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                      >
                        <option value="">Select range</option>
                        <option value="0-100k">€0 - €100,000</option>
                        <option value="100k-500k">€100,000 - €500,000</option>
                        <option value="500k-1m">€500,000 - €1,000,000</option>
                        <option value="1m+">€1,000,000+</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hours for Delivery
                      </label>
                      <input
                        type="text"
                        name="openingHours"
                        value={formData.openingHours}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon-Fri 9:00-17:00, Sat 10:00-14:00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal & Contact Information</h2>
                    <p className="text-gray-600">Tell us about yourself and how to reach you</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                          </label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                          >
                            <option value="">Select role</option>
                            <option value="sales">Sales</option>
                            <option value="purchase">Purchase</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200 pr-12"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Language
                        </label>
                        <select
                          name="preferredLanguage"
                          value={formData.preferredLanguage}
                          onChange={handleInputChange}
                          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                        >
                          <option value="">Select language</option>
                          <option value="en">English</option>
                          <option value="nl">Dutch</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street + Number *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zip / Postal Code *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                            required
                          >
                            <option value="">Select country</option>
                            <option value="netherlands">Netherlands</option>
                            <option value="belgium">Belgium</option>
                            <option value="germany">Germany</option>
                            <option value="france">France</option>
                            <option value="uk">United Kingdom</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery Details */}
              {currentStep === 3 && (
                <div className="p-8">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Details</h2>
                    <p className="text-gray-600">Help us plan your deliveries efficiently</p>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Do you have a "Fork Lift" to unload the pallets from the truck?
                      </label>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="hasForklift"
                              value={option.toLowerCase()}
                              checked={formData.hasForklift === option.toLowerCase()}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-lime-500 focus:ring-lime-500"
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Is the delivery address reachable with an "Articulated Truck" (Big truck)?
                      </label>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="reachableByTruck"
                              value={option.toLowerCase()}
                              checked={formData.reachableByTruck === option.toLowerCase()}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-lime-500 focus:ring-lime-500"
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Does the delivery address have a "Tail Lift" to unload the pallets?
                      </label>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="hasTailLift"
                              value={option.toLowerCase()}
                              checked={formData.hasTailLift === option.toLowerCase()}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-lime-500 focus:ring-lime-500"
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Do we need a "Tail Lift" to unload the pallets?
                      </label>
                      <div className="flex space-x-6">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="needsTailLift"
                              value={option.toLowerCase()}
                              checked={formData.needsTailLift === option.toLowerCase()}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-lime-500 focus:ring-lime-500"
                            />
                            <span className="text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200 ${currentStep === 1 ? 'invisible' : ''
                    }`}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-lime-500 text-white rounded-lg font-medium hover:bg-lime-600 transition-colors duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-lime-500 text-white rounded-lg font-medium hover:bg-lime-600 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
              <p className="mt-2">Need help? Contact us at registration@beagleycopperman.com</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessRegistration;