import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown,
  ChevronUp,
  Scale,
  Lock,
  Users,
  Home
} from 'lucide-react';
import Footer from '../components/Footer';

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const lastUpdated = "January 6, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: `By accessing and using PropertyHub, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.

These terms constitute a legally binding agreement. We reserve the right to modify these terms at any time.`
    },
    {
      title: "2. Eligibility",
      icon: Users,
      content: `To use PropertyHub, you must:
• Be at least 18 years of age
• Have legal capacity to enter contracts
• Provide accurate information
• Comply with all applicable laws in Kenya`
    },
    {
      title: "3. User Accounts",
      icon: Lock,
      content: `You are responsible for:
• Maintaining confidentiality of credentials
• All activities under your account
• Notifying us of unauthorized access
• Providing accurate registration information`
    },
    {
      title: "4. Property Listings",
      icon: Home,
      content: `Landlords must:
• Provide accurate property information
• Use current, representative photos
• Clearly state rental terms and prices
• Have legal authority to rent the property
• Comply with local housing laws

We reserve the right to remove listings that violate these terms.`
    },
    {
      title: "5. User Conduct",
      icon: Shield,
      content: `You agree NOT to:
• Post false or misleading information
• Harass or discriminate against users
• Use the platform for illegal purposes
• Attempt to circumvent security
• Create fake reviews or ratings
• Send spam or unsolicited messages`
    },
    {
      title: "6. Payments and Bookings",
      icon: Scale,
      content: `• All rental agreements are between tenants and landlords
• PropertyHub is not party to rental contracts
• Payment arrangements are between users
• Cancellation policies are set by landlords
• We may assist in disputes but are not liable`
    },
    {
      title: "7. Reviews and Ratings",
      icon: CheckCircle,
      content: `Reviews must be:
• Based on actual experiences
• Honest and respectful
• Free of profanity or hate speech
• Not promotional or spam

We reserve the right to remove reviews that violate guidelines.`
    },
    {
      title: "8. Intellectual Property",
      icon: Lock,
      content: `• Platform content is owned by PropertyHub
• You retain ownership of your submitted content
• You grant us license to use your content
• You may not copy or distribute platform content`
    },
    {
      title: "9. Disclaimers",
      icon: AlertCircle,
      content: `PropertyHub is provided "AS IS" without warranties.

We do NOT:
• Guarantee property condition or legality
• Verify all user information
• Guarantee results (finding properties/tenants)
• Take responsibility for user disputes

TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.`
    },
    {
      title: "10. Dispute Resolution",
      icon: Scale,
      content: `• Disputes between users should be resolved directly
• Disputes with PropertyHub will be resolved through arbitration in Nairobi
• Governed by laws of Kenya
• You waive class action rights`
    },
    {
      title: "11. Termination",
      icon: AlertCircle,
      content: `• You may terminate your account anytime
• We may suspend accounts for violations
• Upon termination, access ceases immediately
• Some provisions survive termination`
    },
    {
      title: "12. Contact Us",
      icon: Users,
      content: `Questions? Contact us:

Email: legal@propertyhub.co.ke
Phone: +254 712 345 678
Address: Nairobi, Kenya

We respond within 48 hours.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
              <p className="text-lg opacity-90 mt-2">Last Updated: {lastUpdated}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-3xl">
            <p className="text-lg leading-relaxed">
              Please read these Terms carefully. By using PropertyHub, you agree to these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div 
          className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border-2"
          style={{ borderColor: '#10b981' }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle size={32} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#047857' }}>
                Quick Summary
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You must be 18+ to use PropertyHub</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Provide accurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Respect other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>PropertyHub is a platform only</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === index;
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-green-200 transition-all"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#047857' }}>
                      {section.title}
                    </h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={24} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pl-16 text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Acceptance */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
            <Scale size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              By Using PropertyHub, You Agree to These Terms
            </h3>
            <p className="text-white/90 text-lg mb-6">
              If you do not agree, please do not use our service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
              >
                I Understand & Accept
              </a>
              <a 
                href="/contact"
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;