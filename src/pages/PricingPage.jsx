import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Crown, 
  TrendingUp,
  Shield,
  Camera,
  Sparkles,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import Footer from '../components/Footer';

export default function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      icon: Star,
      commission: '15%',
      description: 'Start for free, pay only when you succeed',
      color: 'from-blue-500 to-cyan-500',
      popular: true,
      features: [
        { text: 'List unlimited properties FREE', included: true },
        { text: 'Unlimited photos per property', included: true },
        { text: 'Basic analytics (views & inquiries)', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Tenant inquiries & messaging', included: true },
        { text: 'Standard search placement', included: true },
        { text: 'Pay only 15% when tenant books', included: true, highlight: true },
        { text: 'No monthly fees ever', included: true, highlight: true },
        { text: 'Featured placement', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false },
        { text: 'Tenant screening tools', included: false }
      ],
      cta: 'Get Started Free',
      ctaColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
    },
    {
      name: 'Premium',
      icon: Crown,
      price: 1000,
      commission: '5%',
      description: 'Save 10% on commission + premium features',
      color: 'from-purple-500 to-pink-500',
      popular: false,
      features: [
        { text: 'Everything in Free, PLUS:', included: true, bold: true },
        { text: 'Pay only 5% commission (save 10%!)', included: true, highlight: true },
        { text: 'Featured placement - Top of search', included: true },
        { text: '⭐ Premium badge - Stand out', included: true },
        { text: 'Advanced analytics & insights', included: true },
        { text: 'Tenant screening tools', included: true },
        { text: 'Priority support (24/7)', included: true },
        { text: 'Verified landlord badge', included: true },
        { text: 'Virtual tour support', included: true },
        { text: 'Find tenants 3x faster', included: true, highlight: true }
      ],
      cta: 'Upgrade to Premium',
      ctaColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    }
  ];

  const addOns = [
    {
      name: 'Professional Photography',
      price: 'From KES 5,000',
      icon: Camera,
      description: 'High-quality photos that attract tenants'
    },
    {
      name: 'Featured Listing (30 days)',
      price: 'KES 1,499',
      icon: Star,
      description: 'Top placement without subscription'
    },
    {
      name: 'Tenant Background Check',
      price: 'KES 1,500',
      icon: Shield,
      description: 'Comprehensive tenant screening'
    },
    {
      name: 'Virtual Tour Package',
      price: 'KES 7,999',
      icon: Sparkles,
      description: '360° property tour creation'
    }
  ];

  const formatPrice = (price) => {
    return price.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Honest Pricing
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4">
              Start FREE. Only pay when you find a tenant.
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              No hidden fees. No complex plans. Just straightforward pricing that works for you.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={index}
                className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-blue-500' : 'ring-2 ring-purple-300'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-4 bg-gradient-to-br ${plan.color} rounded-2xl mb-6`}>
                    <Icon size={40} className="text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6 text-lg">{plan.description}</p>

                  {/* Price/Commission */}
                  <div className="mb-6 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6">
                    {plan.price ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-5xl font-bold text-slate-900">
                            KES {formatPrice(plan.price)}
                          </span>
                          <span className="text-slate-600 text-lg">/month</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 font-bold text-xl">
                          <DollarSign size={24} />
                          <span>{plan.commission} commission on bookings</span>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-semibold">
                            💰 Save KES 5,000 per booking vs FREE plan!
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <span className="text-6xl font-bold text-slate-900">FREE</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                          <TrendingUp size={24} />
                          <span>{plan.commission} commission only on booking</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-3">
                          No tenant found? Pay nothing. Zero risk!
                        </p>
                      </>
                    )}
                  </div>

                  {/* ROI Calculation for Premium */}
                  {plan.price && (
                    <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <p className="text-sm font-semibold text-purple-900 mb-2">💡 Quick Math:</p>
                      <div className="text-sm text-purple-800 space-y-1">
                        <p>Property: KES 50,000/month</p>
                        <p>FREE commission (15%): <span className="font-bold">KES 7,500</span></p>
                        <p>Premium (KES 1,000 + 5%): <span className="font-bold">KES 3,500</span></p>
                        <p className="text-green-700 font-bold text-base mt-2">
                          ✅ Save KES 4,000 per booking!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full py-4 ${plan.ctaColor} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-8`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-700 mb-4">What's included:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className={`flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-green-600' : 'text-blue-500'}`} size={20} />
                        <span className={`${feature.bold ? 'font-bold text-slate-800' : ''} ${feature.highlight ? 'font-semibold text-green-700' : 'text-slate-700'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why PropertyHub Beats Traditional Agents
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-red-600 font-bold mb-2 text-sm">Traditional Agent</div>
                <div className="text-4xl font-bold text-slate-800 mb-2">100%</div>
                <div className="text-sm text-slate-600">One month's rent</div>
                <div className="mt-4 text-xl font-bold text-red-600">KES 50,000</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-4 ring-blue-500">
                <div className="text-blue-600 font-bold mb-2 text-sm">PropertyHub FREE</div>
                <div className="text-4xl font-bold text-slate-800 mb-2">15%</div>
                <div className="text-sm text-slate-600">First month only</div>
                <div className="mt-4 text-xl font-bold text-blue-600">KES 7,500</div>
                <div className="mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save KES 42,500!
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg ring-4 ring-purple-500">
                <div className="text-purple-600 font-bold mb-2 text-sm">PropertyHub PREMIUM</div>
                <div className="text-4xl font-bold text-slate-800 mb-2">5%</div>
                <div className="text-sm text-slate-600">+ KES 1,000/mo</div>
                <div className="mt-4 text-xl font-bold text-purple-600">KES 3,500</div>
                <div className="mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save KES 46,500!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Optional Add-On Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Boost your listings with professional services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => {
              const Icon = addon.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 hover:border-purple-500"
                >
                  <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{addon.name}</h4>
                  <p className="text-slate-600 text-sm mb-4">{addon.description}</p>
                  <p className="text-purple-600 font-bold text-lg">{addon.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'When do I pay the commission?',
                a: 'You only pay commission when a tenant successfully books your property through our platform. No booking = no fee!'
              },
              {
                q: 'Can I switch between FREE and Premium?',
                a: 'Absolutely! Upgrade or downgrade anytime. Premium benefits start immediately when you upgrade.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept M-Pesa, credit/debit cards, and bank transfers for Premium subscriptions.'
              },
              {
                q: 'How does the 15% commission work?',
                a: 'When a tenant books your property, we deduct 15% from the first month\'s rent. All future rent goes directly to you with zero fees.'
              },
              {
                q: 'Is Premium worth it?',
                a: 'If you rent even once, Premium saves you KES 4,000-5,000 on commission alone! Plus you get featured placement and find tenants 3x faster.'
              },
              {
                q: 'Can I cancel Premium anytime?',
                a: 'Yes! Cancel anytime, no questions asked. You\'ll revert to the FREE plan automatically.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ChevronRight className="text-purple-500" size={20} />
                  {faq.q}
                </h4>
                <p className="text-slate-600 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Tenant?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of landlords who trust PropertyHub. Start FREE today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started FREE
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all hover:scale-105"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}