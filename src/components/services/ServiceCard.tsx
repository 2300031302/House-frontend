import React from 'react';
import { Clock, DollarSign, Star, CheckCircle } from 'lucide-react';
import { Service } from '../../context/AppContext';

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
}

export default function ServiceCard({ service, onBookNow }: ServiceCardProps) {
  return (
    <div className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {service.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {service.features.slice(0, 2).map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Price & Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{service.duration}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">{service.price}</span>
          </div>
        </div>

        {/* Rating & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8 (120+ reviews)</span>
          </div>
          
          <button
            onClick={() => onBookNow(service)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}