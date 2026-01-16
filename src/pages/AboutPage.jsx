import React from 'react';
import { 
  Home, 
  Users, 
  Target, 
  Award, 
  Heart,
  Shield,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  Leaf,
  Phone,
  Mail
} from 'lucide-react';
import Footer from '../components/Footer';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Tenants', icon: Users },
    { number: '5,000+', label: 'Properties Listed', icon: Home },
    { number: '1,500+', label: 'Verified Landlords', icon: Shield },
    { number: '98%', label: 'Satisfaction Rate', icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We verify every landlord and property to ensure you get what you see.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your comfort and satisfaction are our top priorities in everything we do.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Using cutting-edge technology to make property rental simple and efficient.'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Promoting eco-friendly properties and responsible living for a better future.'
    }
  ];

  const team = [
    {
      name: 'Christian Barasa',
      role: 'Chief Executive Officer',
      bio: 'With 15 years in real estate, Christian leads PropertyHub\'s vision to revolutionize Kenya\'s rental market.'
    },
    {
      name: 'Solomon Suzui',
      role: 'Head of Operations',
      bio: 'Suzui ensures every property meets our high standards and every customer has a seamless experience.'
    },
    {
      name: 'Alex Kiptoo',
      role: 'Chief Technology Officer',
      bio: 'Alex builds the innovative platform that makes finding your perfect home effortless.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Home size={120} />
          </div>
          <div className="absolute bottom-10 right-10">
            <Leaf size={100} />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About PropertyHub
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Kenya's most trusted platform connecting tenants with their dream homes
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#047857' }}>
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Founded in 2026, PropertyHub was born from a simple observation: finding a rental property in Kenya was unnecessarily complicated, time-consuming, and often frustrating.
              </p>
              <p>
                We saw tenants spending weeks searching through unreliable listings, dealing with unresponsive landlords, and facing unexpected surprises during move-in. Meanwhile, landlords struggled to find quality tenants and manage their properties efficiently.
              </p>
              <p>
                We knew there had to be a better way. So we built PropertyHub – a platform that brings transparency, efficiency, and trust to Kenya's rental market.
              </p>
              <p className="font-semibold" style={{ color: '#10b981' }}>
                Today, we're proud to serve thousands of happy tenants and landlords across Kenya, making the rental process smooth, secure, and stress-free.
              </p>
            </div>
          </div>

          <div className="relative">
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ border: '4px solid #10b981' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                alt="Modern apartment"
                className="w-full h-96 object-cover"
              />
            </div>
            <div 
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl"
              style={{ border: '3px solid #10b981' }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: '#10b981' }}>
                  4+
                </div>
                <div className="text-gray-600 font-semibold">
                  Years of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon size={32} />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div 
            className="bg-white rounded-3xl p-8 shadow-xl"
            style={{ border: '3px solid #10b981' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold" style={{ color: '#047857' }}>
                Our Mission
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To revolutionize Kenya's rental market by providing a transparent, efficient, and trustworthy platform that connects quality tenants with verified landlords, making home-finding simple, secure, and stress-free.
            </p>
          </div>

          {/* Vision */}
          <div 
            className="bg-white rounded-3xl p-8 shadow-xl"
            style={{ border: '3px solid #0ea5e9' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
              >
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold" style={{ color: '#0284c7' }}>
                Our Vision
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              To become East Africa's leading property rental platform, known for innovation, trust, and customer satisfaction, where every person can easily find their perfect home.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#047857' }}>
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: '#047857' }}>
                    {value.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#047857' }}>
            Why Choose PropertyHub?
          </h2>
          <p className="text-xl text-gray-600">
            We're different, and here's why
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Verified Listings', description: 'Every property is verified to ensure authenticity' },
            { icon: Clock, title: 'Save Time', description: 'Find your perfect home in minutes, not weeks' },
            { icon: MapPin, title: 'Location-Based', description: 'Search properties near you with our smart filters' },
            { icon: CheckCircle, title: 'Transparent Process', description: 'No hidden fees or surprise costs' },
            { icon: Heart, title: '24/7 Support', description: 'Our team is always here to help you' },
            { icon: TrendingUp, title: 'Best Deals', description: 'Competitive prices and exclusive offers' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#047857' }}>
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#047857' }}>
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind PropertyHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl text-center transform hover:-translate-y-2 transition-all"
              >
                <div 
                  className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-2xl font-bold mb-2" style={{ color: '#047857' }}>
                  {member.name}
                </h4>
                <p className="text-green-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div 
          className="py-20"
          style={{
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Join thousands of happy tenants who found their dream homes with PropertyHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/"
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
              >
                Browse Properties
              </a>
              <a 
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all"
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

export default AboutPage;