import React from 'react';
import { Shield, Clock, CreditCard, Award, Users, Smartphone } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Trusted Professionals',
      description: 'All service providers are background-checked, licensed, and insured for your peace of mind.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book services anytime with emergency support available around the clock.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Safe and encrypted payment processing with transparent pricing and no hidden fees.',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Satisfaction guaranteed with quality work standards and professional accountability.',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Users,
      title: 'Rated Professionals',
      description: 'Choose from highly-rated professionals with verified customer reviews and ratings.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: Smartphone,
      title: 'Easy Booking',
      description: 'Simple, intuitive booking process with real-time updates and communication.',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose HomeServices?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most comprehensive platform to connect you with trusted home service professionals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 rounded-2xl transition-all duration-300 -z-10" />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Verified Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Service Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
