import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye,
  Database,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Cookie,
  Globe,
  Mail,
  Key
} from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const lastUpdated = "January 6, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: `We collect information to provide better services to our users. Here's what we collect:

PERSONAL INFORMATION:
• Name and contact details (email, phone number)
• Profile information (photo, bio)
• Property details (for landlords)
• Rental preferences (for tenants)
• Payment information (if applicable)
• Government-issued ID (for verification)
• Physical address

USAGE INFORMATION:
• Device information (browser, OS, IP address)
• Log data (access times, pages viewed)
• Location data (with your permission)
• Cookies and similar technologies
• Search queries and interactions
• Property views and favorites

COMMUNICATIONS:
• Messages between users
• Support inquiries
• Email communications
• Phone call records (for quality assurance)

SOCIAL MEDIA:
• Information from social login (if used)
• Publicly available profile data`
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: `We use collected information for the following purposes:

SERVICE DELIVERY:
• Create and manage your account
• Process bookings and inquiries
• Connect tenants with landlords
• Send notifications about bookings and messages
• Provide customer support
• Verify property listings

PLATFORM IMPROVEMENT:
• Analyze usage patterns
• Improve search functionality
• Develop new features
• Personalize your experience
• Generate analytics and insights

COMMUNICATION:
• Send service updates
• Share marketing materials (with consent)
• Respond to inquiries
• Send important notices
• Notify about policy changes

SAFETY & SECURITY:
• Prevent fraud and abuse
• Verify user identity
• Protect against security threats
• Investigate suspicious activity
• Comply with legal obligations

LEGAL COMPLIANCE:
• Meet regulatory requirements
• Respond to legal requests
• Enforce our Terms of Service
• Protect our rights and property`
    },
    {
      title: "3. How We Share Your Information",
      icon: Users,
      content: `We respect your privacy and only share information when necessary:

WITH OTHER USERS:
• Your profile is visible to other users
• Landlords see tenant inquiries
• Tenants see property owner information
• Reviews and ratings are public
• Messages are shared between parties

WITH SERVICE PROVIDERS:
• Payment processors
• Cloud hosting services
• Email service providers
• SMS/notification services
• Analytics platforms
• Customer support tools

These providers are bound by confidentiality agreements.

WITH LEGAL AUTHORITIES:
• When required by law
• To comply with legal processes
• To protect rights and safety
• To prevent fraud or illegal activity

BUSINESS TRANSFERS:
• In case of merger or acquisition
• During business restructuring
• To potential buyers (with protections)

WITH YOUR CONSENT:
• When you explicitly agree
• For purposes you authorize
• As disclosed at collection time

WE NEVER:
• Sell your personal information
• Share data for third-party marketing
• Rent or trade user lists`
    },
    {
      title: "4. Data Security",
      icon: Shield,
      content: `We take security seriously and implement multiple protection measures:

TECHNICAL SAFEGUARDS:
• Encryption in transit (HTTPS/SSL)
• Encryption at rest for sensitive data
• Secure database infrastructure
• Regular security audits
• Firewall protection
• Access controls and authentication

ORGANIZATIONAL MEASURES:
• Employee training on data protection
• Limited access to personal data
• Confidentiality agreements
• Regular security reviews
• Incident response procedures

ACCOUNT SECURITY:
• Password encryption
• Secure login processes
• Two-factor authentication (optional)
• Session management
• Account recovery procedures

However, no method is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our protections.

YOUR RESPONSIBILITIES:
• Choose strong passwords
• Keep credentials confidential
• Log out from shared devices
• Report suspicious activity
• Keep contact information updated`
    },
    {
      title: "5. Your Privacy Rights",
      icon: Key,
      content: `You have control over your personal information:

ACCESS & PORTABILITY:
• Request a copy of your data
• Download your information
• View what we have collected
• Receive data in a portable format

CORRECTION & UPDATES:
• Update your profile information
• Correct inaccurate data
• Modify your preferences
• Change communication settings

DELETION:
• Request account deletion
• Remove specific data
• Withdraw consent
• Close your account permanently

OBJECTION & RESTRICTION:
• Object to data processing
• Restrict how we use your data
• Opt-out of marketing communications
• Limit data sharing (where applicable)

AUTOMATED DECISIONS:
• Request human review
• Challenge automated decisions
• Understand decision-making logic

TO EXERCISE RIGHTS:
Contact us at privacy@propertyhub.co.ke

We will respond within 30 days and may need to verify your identity.`
    },
    {
      title: "6. Cookies and Tracking",
      icon: Cookie,
      content: `We use cookies and similar technologies to improve your experience:

WHAT ARE COOKIES?
Small text files stored on your device that help us:
• Remember your preferences
• Keep you logged in
• Analyze site usage
• Personalize content

TYPES OF COOKIES WE USE:

Essential Cookies (Required):
• Authentication and security
• Basic site functionality
• Load balancing

Functional Cookies:
• Remember preferences
• Store language settings
• Save search filters

Analytics Cookies:
• Track usage patterns
• Measure performance
• Identify issues

Advertising Cookies (With Consent):
• Show relevant ads
• Measure ad effectiveness
• Retargeting campaigns

THIRD-PARTY COOKIES:
• Google Analytics
• Social media platforms
• Payment processors

MANAGING COOKIES:
• Browser settings to block cookies
• Opt-out of analytics tracking
• Clear cookies anytime
• Use privacy mode

Note: Blocking essential cookies may affect functionality.`
    },
    {
      title: "7. Data Retention",
      icon: Database,
      content: `We retain data only as long as necessary:

ACTIVE ACCOUNTS:
• Profile data: Until account deletion
• Property listings: Until removed/deleted
• Messages: Until deleted by users
• Booking history: For legal compliance

DELETED ACCOUNTS:
• Most data deleted within 30 days
• Some data retained for legal reasons
• Anonymized data for analytics
• Backup copies deleted within 90 days

LEGAL RETENTION:
• Financial records: 7 years (tax law)
• Legal disputes: Until resolved
• Regulatory requirements: As mandated
• Safety/security logs: 2 years

YOU CAN REQUEST:
• Immediate account deletion
• Data export before deletion
• Confirmation of deletion
• Details on retained data`
    },
    {
      title: "8. Children's Privacy",
      icon: Users,
      content: `PropertyHub is not intended for children under 18.

OUR POLICY:
• We do not knowingly collect data from children under 18
• Users must confirm they are 18+ during registration
• We do not target children with marketing
• We verify age where possible

IF WE DISCOVER:
We have collected information from a child under 18:
• We will delete it immediately
• We will notify parents/guardians
• We will block the account
• We will take corrective measures

PARENTAL RIGHTS:
If you believe we have information about your child:
• Contact us immediately
• Request data deletion
• Verify the account
• Report the incident

We are committed to protecting children's privacy online.`
    },
    {
      title: "9. International Data Transfers",
      icon: Globe,
      content: `Your information may be transferred internationally:

DATA LOCATION:
• Primary servers in Kenya
• Cloud services may be international
• Backup servers in secure locations

TRANSFER PROTECTIONS:
• Adequate data protection agreements
• Compliance with Kenya Data Protection Act
• Standard contractual clauses
• Secure transmission protocols

YOUR RIGHTS:
• Right to know where data is stored
• Right to object to transfers
• Right to adequate protection
• Right to data security

We ensure all transfers comply with applicable data protection laws.`
    },
    {
      title: "10. Third-Party Links",
      icon: Globe,
      content: `Our platform may contain links to external websites:

NOT RESPONSIBLE FOR:
• Third-party privacy practices
• External website content
• Security of linked sites
• Data collection by others

YOUR PROTECTION:
• Review privacy policies of linked sites
• Be cautious with personal information
• Report suspicious links
• Use secure connections

EMBEDDED CONTENT:
• Social media widgets
• Payment processors
• Google Maps
• Analytics tools

These may collect information independently.`
    },
    {
      title: "11. Marketing Communications",
      icon: Mail,
      content: `How we communicate with you:

TYPES OF COMMUNICATIONS:

Transactional (Cannot opt-out):
• Booking confirmations
• Account notifications
• Security alerts
• Legal notices

Marketing (Can opt-out):
• New property alerts
• Promotional offers
• Newsletter updates
• Feature announcements

HOW TO OPT-OUT:
• Click "unsubscribe" in emails
• Update preferences in settings
• Email optout@propertyhub.co.ke
• Contact support

WE RESPECT:
• Opt-out requests immediately
• Communication preferences
• Frequency limits
• Spam regulations

You'll still receive essential service emails.`
    },
    {
      title: "12. Changes to Privacy Policy",
      icon: FileText,
      content: `We may update this policy periodically:

HOW WE NOTIFY YOU:
• Email notification for major changes
• Banner on website
• App notification
• Updated "Last Modified" date

WHAT CONSTITUTES CHANGE:
• New data collection practices
• Changes in data usage
• Modified sharing practices
• Updated security measures

YOUR OPTIONS:
• Review changes carefully
• Accept to continue using service
• Object to changes
• Close account if you disagree

EFFECTIVE DATE:
Changes take effect 30 days after notification unless immediate action is required for security or legal reasons.

We encourage you to review this policy regularly.`
    },
    {
      title: "13. Contact & Complaints",
      icon: AlertCircle,
      content: `Questions or concerns about privacy?

CONTACT US:

Email: privacy@propertyhub.co.ke
Phone: +254 712 345 678
Address: Nairobi, Kenya

Data Protection Officer:
dpo@propertyhub.co.ke

Response Time: Within 48 hours

FILING COMPLAINTS:

With Us:
• Send detailed complaint
• Include relevant information
• Provide contact details

With Authorities:
Office of the Data Protection Commissioner
Kenya
Website: www.odpc.go.ke

RESOLUTION PROCESS:
1. We investigate your complaint
2. We respond with findings
3. We take corrective action
4. We follow up on resolution

Your privacy matters to us. We take all concerns seriously.`
    }
  ];

  const keyPoints = [
    {
      icon: Shield,
      title: "We Protect Your Data",
      description: "Industry-standard encryption and security measures"
    },
    {
      icon: Lock,
      title: "You Control Your Info",
      description: "Access, correct, or delete your data anytime"
    },
    {
      icon: Eye,
      title: "Transparent Use",
      description: "Clear explanation of how we use your information"
    },
    {
      icon: Users,
      title: "Limited Sharing",
      description: "We never sell your data to third parties"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur"
            >
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
              <p className="text-lg opacity-90 mt-2">Last Updated: {lastUpdated}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-3xl">
            <p className="text-lg leading-relaxed">
              At PropertyHub, we respect your privacy and are committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#047857' }}>
          Your Privacy at a Glance
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#047857' }}>
                  {point.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div 
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200"
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
                  <span>We collect information to provide and improve our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>We use industry-standard security to protect your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>We never sell your personal information to third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You can access, correct, or delete your data anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>We comply with Kenya Data Protection Act, 2019</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === index;
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#0284c7' }}>
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

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
            <Mail size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Questions About Your Privacy?
            </h3>
            <p className="text-white/90 text-lg mb-6">
              We're here to help. Contact our Data Protection Officer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:privacy@propertyhub.co.ke"
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Email Privacy Team
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

export default PrivacyPolicy;