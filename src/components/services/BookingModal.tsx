import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, MessageSquare, CreditCard } from 'lucide-react';
import Modal from '../common/Modal';
import { Service, useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

export default function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    phone: (authState.user as any)?.phone || '',
    address: (authState.user as any)?.address || '',
    date: '',
    time: '',
    notes: '',
    professionalId: '',
  });

  // Get professionals for this service
  const availableProfessionals = state.professionals.filter(prof =>
    prof.serviceIds.includes(service.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.professionalId) {
      alert('Please fill in all required fields');
      return;
    }

    const professional = state.professionals.find(p => p.id === formData.professionalId);
    
    const booking = {
      id: Date.now().toString(),
      userId: authState.user?.id || '1',
      serviceId: service.id,
      professionalId: formData.professionalId,
      date: formData.date,
      time: formData.time,
      address: formData.address,
      notes: formData.notes,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      price: service.price,
    };

    dispatch({ type: 'ADD_BOOKING', payload: booking });

    // Add notification for professional
    const notification = {
      id: Date.now().toString(),
      type: 'booking' as const,
      message: `New booking for ${service.name} on ${formData.date} at ${formData.time}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    alert('Booking confirmed! The professional will contact you shortly.');
    onClose();
    
    // Reset form
    setFormData({
      name: authState.user?.name || '',
      phone: (authState.user as any)?.phone || '',
      address: (authState.user as any)?.address || '',
      date: '',
      time: '',
      notes: '',
      professionalId: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedProfessional = availableProfessionals.find(p => p.id === formData.professionalId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${service.name}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${service.price}</div>
              <div className="text-sm text-gray-500">{service.duration}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Service Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Preferred Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Professional *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {availableProfessionals.map((professional) => (
              <label
                key={professional.id}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.professionalId === professional.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="professionalId"
                  value={professional.id}
                  checked={formData.professionalId === professional.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{professional.name}</h4>
                  <p className="text-sm text-gray-600">
                    {professional.experience} • ${professional.hourlyRate}/hr
                    {professional.customPricing && professional.customPricing[service.id] && (
                      <span className="text-blue-600 font-medium"> • Service: ${professional.customPricing[service.id]}</span>
                    )}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {professional.rating} ({professional.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any specific requirements or details..."
            className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Price Summary */}
        {selectedProfessional && (
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
            {(() => {
              const professionalPrice = selectedProfessional.customPricing && selectedProfessional.customPricing[service.id];
              const finalPrice = professionalPrice || service.price;
              
              return (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional:</span>
                    <span>{selectedProfessional.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Duration:</span>
                    <span>{service.duration}</span>
                  </div>
                  {professionalPrice && professionalPrice !== service.price && (
                    <div className="flex justify-between text-blue-600">
                      <span>Professional Rate:</span>
                      <span>${professionalPrice} (was ${service.price})</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">${finalPrice}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <CreditCard className="h-4 w-4 inline mr-2" />
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}