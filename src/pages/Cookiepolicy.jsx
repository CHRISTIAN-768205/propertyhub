import React, { useState } from 'react';
import { 
  Cookie, 
  Shield, 
  Settings,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import Footer from '../components/Footer';

const CookiePolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const lastUpdated = "January 7, 2026";

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. What Are Cookies?",
      icon: Cookie,
      content: `Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit our website. They help us provide you with a better experience by:

• Remembering your preferences and settings
• Keeping you logged in
• Understanding how you use our website
• Improving our services
• Showing you relevant content

Cookies contain information that is transferred to your device's hard drive. They are widely used to make websites work more efficiently and provide a better user experience.`
    },
    {
      title: "2. How We Use Cookies",
      icon: Eye,
      content: `PropertyHub uses cookies for several important purposes:

ESSENTIAL FUNCTIONALITY:
• Maintain your login session
• Remember your language preferences
• Store items in your favorites
• Secure your account and transactions
• Enable core website features

PERFORMANCE & ANALYTICS:
• Understand how visitors use our website
• Track which pages are most popular
• Identify technical issues
• Measure website performance
• Improve user experience

PERSONALIZATION:
• Remember your property search filters
• Display relevant property recommendations
• Save your recent searches
• Customize content based on your interests

SECURITY:
• Detect and prevent fraud
• Protect against spam and abuse
• Secure user authentication
• Monitor suspicious activity`
    },
    {
      title: "3. Types of Cookies We Use",
      icon: Settings,
      content: `We use different types of cookies, each serving a specific purpose:

STRICTLY NECESSARY COOKIES (Cannot be disabled)
These cookies are essential for the website to function properly. Without them, services you have requested cannot be provided.

Examples:
• Authentication cookies - Keep you logged in
• Security cookies - Protect your account
• Session cookies - Remember your actions
• Load balancing cookies - Distribute traffic

FUNCTIONAL COOKIES (Optional)
These cookies enable enhanced functionality and personalization.

Examples:
• Preference cookies - Remember your settings
• Language cookies - Store language choice
• Location cookies - Remember your location
• Search cookies - Save recent searches

ANALYTICAL/PERFORMANCE COOKIES (Optional)
These cookies help us understand how visitors interact with our website.

Examples:
• Google Analytics - Track website usage
• Hotjar - Record user sessions
• Custom analytics - Track feature usage
• Error tracking - Monitor technical issues

ADVERTISING COOKIES (Optional)
These cookies are used to deliver relevant advertisements.

Examples:
• Facebook Pixel - Show relevant ads
• Google Ads - Track ad performance
• Retargeting cookies - Show ads on other sites
• Conversion tracking - Measure ad success`
    },
    {
      title: "4. Third-Party Cookies",
      icon: Shield,
      content: `Some cookies on our website are set by third-party services:

GOOGLE SERVICES:
• Google Analytics - Website analytics
• Google Maps - Property location maps
• Google Tag Manager - Tag management
• Google Ads - Advertising services

SOCIAL MEDIA:
• Facebook - Social login, sharing, ads
• Twitter - Social sharing
• Instagram - Social integration
• LinkedIn - Professional networking

PAYMENT PROCESSORS:
• M-Pesa - Payment processing
• Stripe - Card payments (if applicable)
• PayPal - Payment gateway (if applicable)

OTHER SERVICES:
• Email service providers - Communication
• Chat widgets - Customer support
• Content delivery networks - Fast loading
• Error monitoring tools - Bug tracking

These third parties may use cookies to:
• Provide their services
• Collect analytics data
• Show relevant advertisements
• Improve their products

We carefully select our third-party partners and ensure they comply with data protection laws. However, we do not control their cookies or practices.`
    },
    {
      title: "5. Cookie Duration",
      icon: Info,
      content: `Cookies can be either session-based or persistent:

SESSION COOKIES:
• Temporary cookies that expire when you close your browser
• Used for essential functions like maintaining login
• Deleted automatically when you end your session
• Examples: Shopping cart, login session

PERSISTENT COOKIES:
• Remain on your device for a set period or until manually deleted
• Used for preferences and analytics
• Duration varies by purpose (days to years)

OUR COOKIE DURATIONS:

Essential Cookies: Session or 1 year
• Login session: Until browser closes
• Security tokens: 24 hours
• Authentication: 30 days

Functional Cookies: 30 days to 1 year
• Language preference: 1 year
• Location settings: 90 days
• Search history: 30 days

Analytics Cookies: 2 years
• Google Analytics: 2 years
• Usage tracking: 1 year
• Performance data: 90 days

Advertising Cookies: 90 days to 1 year
• Ad preferences: 90 days
• Retargeting: 180 days
• Conversion tracking: 1 year`
    },
    {
      title: "6. Managing Your Cookie Preferences",
      icon: Settings,
      content: `You have control over which cookies you accept:

BROWSER SETTINGS:
All modern browsers allow you to:
• Block all cookies
• Block third-party cookies only
• Delete existing cookies
• Set cookie preferences per website
• Receive notifications before cookies are set

HOW TO MANAGE COOKIES BY BROWSER:

Google Chrome:
Settings → Privacy and security → Cookies and other site data

Mozilla Firefox:
Settings → Privacy & Security → Cookies and Site Data

Safari:
Preferences → Privacy → Manage Website Data

Microsoft Edge:
Settings → Cookies and site permissions → Manage and delete cookies

OUR COOKIE CONSENT TOOL:
When you first visit PropertyHub, you'll see a cookie banner where you can:
• Accept all cookies
• Reject non-essential cookies
• Customize your preferences
• Learn more about each cookie type

You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.

PLEASE NOTE:
Blocking or deleting cookies may affect your experience on our website. Some features may not work properly without certain cookies.`
    },
    {
      title: "7. Do Not Track (DNT)",
      icon: Shield,
      content: `WHAT IS DO NOT TRACK?
Do Not Track (DNT) is a browser setting that signals to websites that you don't want to be tracked.

OUR APPROACH:
Currently, there is no industry standard for how websites should respond to DNT signals. Different browsers implement DNT differently, and there's no consensus on what actions websites should take.

PropertyHub's stance:
• We respect user privacy preferences
• We minimize tracking where possible
• We provide clear cookie controls
• We comply with applicable privacy laws

ALTERNATIVE OPTIONS:
Instead of relying solely on DNT, you can:
• Use our cookie preference center
• Configure browser cookie settings
• Use browser privacy modes
• Install privacy extensions
• Opt out of third-party tracking

We continuously monitor developments in privacy standards and will update our practices accordingly.`
    },
    {
      title: "8. Cookies and Personal Data",
      icon: Shield,
      content: `HOW COOKIES RELATE TO YOUR PRIVACY:

PERSONAL DATA IN COOKIES:
Most cookies contain:
• Random identifiers (not personal data)
• Technical information (browser type, device)
• Behavioral data (pages visited, clicks)

Some cookies may contain:
• User ID (linked to your account)
• Email address (for authentication)
• Location data (for personalization)

DATA PROTECTION:
• Cookie data is protected under our Privacy Policy
• We use encryption for sensitive data
• We limit cookie data retention
• We don't sell cookie data to third parties
• We comply with GDPR, CCPA, and Kenya Data Protection Act

YOUR RIGHTS:
You have the right to:
• Know what data is collected via cookies
• Access cookie data linked to your account
• Delete cookie data
• Opt out of non-essential cookies
• Withdraw consent at any time

For more details on how we handle personal data, please see our Privacy Policy.`
    },
    {
      title: "9. Updates to This Policy",
      icon: Info,
      content: `POLICY CHANGES:
We may update this Cookie Policy from time to time to reflect:
• Changes in cookie usage
• New cookies or technologies
• Legal or regulatory requirements
• User feedback and requests
• Changes in our services

HOW WE NOTIFY YOU:
When we make significant changes:
• Update the "Last Updated" date
• Display a notice on our website
• Send email notification (for major changes)
• Request renewed consent if required

EFFECTIVE DATE:
Changes take effect immediately upon posting unless otherwise stated. Your continued use of PropertyHub after changes indicates acceptance of the updated policy.

REVIEW REGULARLY:
We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.`
    },
    {
      title: "10. Contact Us About Cookies",
      icon: Info,
      content: `QUESTIONS OR CONCERNS?
If you have questions about our use of cookies, please contact us:

EMAIL:
cookies@propertyhub.co.ke
privacy@propertyhub.co.ke

PHONE:
+254 712 345 678

ADDRESS:
PropertyHub
Nairobi, Kenya
P.O. Box 12345

DATA PROTECTION OFFICER:
dpo@propertyhub.co.ke

RESPONSE TIME:
We aim to respond to all inquiries within 48 hours.

COMPLAINTS:
If you're not satisfied with our response, you can file a complaint with:

Office of the Data Protection Commissioner (Kenya)
Website: www.odpc.go.ke

We take your privacy seriously and will do our best to address your concerns.`
    }
  ];

  const cookieTypes = [
    {
      name: "Essential Cookies",
      required: true,
      description: "Necessary for the website to function. Cannot be disabled.",
      examples: ["Login session", "Security", "Load balancing"]
    },
    {
      name: "Functional Cookies",
      required: false,
      description: "Enable enhanced functionality and personalization.",
      examples: ["Language preference", "Recent searches", "Saved filters"]
    },
    {
      name: "Analytics Cookies",
      required: false,
      description: "Help us understand how you use our website.",
      examples: ["Google Analytics", "Usage tracking", "Performance monitoring"]
    },
    {
      name: "Advertising Cookies",
      required: false,
      description: "Used to show you relevant advertisements.",
      examples: ["Facebook Pixel", "Google Ads", "Retargeting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Cookie size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
              <p className="text-lg opacity-90 mt-2">Last Updated: {lastUpdated}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-3xl">
            <p className="text-lg leading-relaxed">
              This Cookie Policy explains how PropertyHub uses cookies and similar technologies 
              to recognize you when you visit our website. It explains what these technologies are, 
              why we use them, and your rights to control our use of them.
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Types Overview */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#047857' }}>
          Types of Cookies We Use
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {cookieTypes.map((type, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#047857' }}>
                  {type.name}
                </h3>
                {type.required ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    Required
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    Optional
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{type.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Examples:</p>
                {type.examples.map((example, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    {type.required ? (
                      <CheckCircle size={16} className="text-red-500" />
                    ) : (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#047857' }}>
            Quick Summary
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">We use cookies to improve your experience</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Some cookies are essential for the site to work</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">You can control non-essential cookies</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">We use third-party cookies for analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">You can change your preferences anytime</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Blocking cookies may affect functionality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === index;
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)' }}
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

      {/* Cookie Settings CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
            <Cookie size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Manage Your Cookie Preferences
            </h3>
            <p className="text-white/90 text-lg mb-6">
              You can change your cookie settings at any time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Cookie Settings
              </button>
              <a 
                href="/contact"
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;