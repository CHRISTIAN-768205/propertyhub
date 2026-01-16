import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Calendar, 
  Key, 
  MessageSquare, 
  CheckCircle, 
  Users, 
  Shield,
  TrendingUp,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react';
import Footer from '../components/Footer';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  const tenantSteps = [
    {
      icon: Search,
      title: 'Browse Properties',
      description: 'Search through our extensive database of verified properties. Filter by location, price, amenities, and more to find your perfect match.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Home,
      title: 'View Details',
      description: 'Explore detailed property information, high-quality photos, virtual tours, and neighborhood insights. See ratings and reviews from previous tenants.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Contact Landlord',
      description: 'Send inquiries directly to landlords through our platform. Schedule viewings and ask questions in real-time via our messaging system.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: 'Book Viewing',
      description: 'Schedule property viewings at your convenience. Get instant confirmation and reminders for your appointments.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: CheckCircle,
      title: 'Submit Application',
      description: 'Apply for your chosen property with our streamlined application process. Track your application status in real-time.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Key,
      title: 'Move In',
      description: 'Complete the rental agreement securely online. Get your keys and move into your new home with confidence!',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const landlordSteps = [
    {
      icon: Users,
      title: 'Create Account',
      description: 'Sign up as a landlord in minutes. Verify your identity and property ownership for added trust.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Home,
      title: 'List Property',
      description: 'Add your property with photos, descriptions, pricing, and amenities. Our smart system helps you create compelling listings.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Get Visibility',
      description: 'Your property gets instant exposure to thousands of potential tenants. Track views, inquiries, and engagement analytics.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: MessageSquare,
      title: 'Receive Inquiries',
      description: 'Get notified instantly when tenants are interested. Communicate directly through our secure messaging platform.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Calendar,
      title: 'Manage Viewings',
      description: 'Schedule and manage property viewings efficiently. Accept or decline viewing requests based on your availability.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: CheckCircle,
      title: 'Select Tenant',
      description: 'Review applications, verify tenant credentials, and select the best fit for your property. Complete agreements online.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'All properties and users are verified to ensure safety and authenticity.'
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Transparent reviews and ratings help you make informed decisions.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Landlords get detailed insights on property performance and market trends.'
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'Built-in messaging keeps all communication safe and organized.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mb-6">
              <Sparkles size={40} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How PropertyHub Works
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Your journey to finding the perfect rental or the ideal tenant starts here. 
              Simple, secure, and stress-free.
            </p>
          </div>
        </div>
      </div>

      {/* For Tenants Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              For Tenants
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Finding your dream home has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenantSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-transparent hover:scale-105"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for flow */}
                  {index < tenantSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="text-slate-300" size={32} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              Browse Properties Now
            </button>
          </div>
        </div>
      </div>

      {/* For Landlords Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              For Landlords
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              List your property and find quality tenants effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {landlordSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-transparent hover:scale-105"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for flow */}
                  {index < landlordSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="text-slate-300" size={32} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why Choose PropertyHub?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We make property rental simple, safe, and transparent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied users who have found their perfect match on PropertyHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              Find a Property
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all hover:scale-105"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}