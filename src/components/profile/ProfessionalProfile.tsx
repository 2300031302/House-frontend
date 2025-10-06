import React, { useState } from 'react';
import { User, Phone, Wrench, Mail, Lock, CreditCard as Edit2, Save, X, Eye, EyeOff, Star, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function ProfessionalProfile() {
  const { state, updateProfile } = useAuth();
  const { state: appState } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: (state.user as any)?.phone || '',
    serviceIds: (state.user as any)?.serviceIds || [],
    specialty: (state.user as any)?.specialty || '',
    password: '••••••••', // Masked password
    bio: (state.user as any)?.bio || '',
    hourlyRate: (state.user as any)?.hourlyRate || 0,
    customPricing: (state.user as any)?.customPricing || {},
  });
  const [originalData, setOriginalData] = useState(formData);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData(formData);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleSave = () => {
    // In a real app, this would update the backend
    // For demo purposes, we'll just update the local state
    if (updateProfile) {
      // Update specialty based on selected services
      const selectedServices = appState.services.filter(s => formData.serviceIds.includes(s.id));
      const specialty = selectedServices.length > 0 ? selectedServices[0].category : formData.specialty;
      
      updateProfile({
        ...state.user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceIds: formData.serviceIds,
        specialty: specialty,
        bio: formData.bio,
        hourlyRate: formData.hourlyRate,
        customPricing: formData.customPricing,
      });
    }
    setIsEditing(false);
    setShowPassword(false);
    alert('Profile updated successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: checked 
        ? [...prev.serviceIds, serviceId]
        : prev.serviceIds.filter(id => id !== serviceId)
    }));
  };

  const handlePricingChange = (serviceId: string, price: number) => {
    setFormData(prev => ({
      ...prev,
      customPricing: {
        ...prev.customPricing,
        [serviceId]: price
      }
    }));
  };

  const professional = state.user as any;
  const selectedServices = appState.services.filter(s => formData.serviceIds.includes(s.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Profile</h1>
          <p className="text-gray-600">Manage your professional information and service details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-12 text-white relative">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={state.user?.image || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <Wrench className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{state.user?.name}</h2>
                <p className="text-green-100">{professional?.specialty} Professional</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-300 fill-current mr-1" />
                    <span className="text-green-100">{professional?.rating || 4.8} ({professional?.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-100">{professional?.experience || '5+ years'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <button
              onClick={isEditing ? handleCancel : handleEdit}
              className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              {isEditing ? <X className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
            </button>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {formData.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {formData.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {formData.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wrench className="h-4 w-4 inline mr-2" />
                  Primary Specialty
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {selectedServices.length > 0 ? selectedServices[0].category : formData.specialty}
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Hourly Rate
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    step="5"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    ${formData.hourlyRate}/hour
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      ••••••••
                    </div>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Services Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Wrench className="h-4 w-4 inline mr-2" />
                  Services You Provide
                </label>
                {isEditing ? (
                  <div className="space-y-4">
                    {appState.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-white/80 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`service-${service.id}`}
                            checked={formData.serviceIds.includes(service.id)}
                            onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <label htmlFor={`service-${service.id}`} className="flex-1">
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.category} • Default: ${service.price}</div>
                          </label>
                        </div>
                        {formData.serviceIds.includes(service.id) && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Your Price:</span>
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="number"
                                min="0"
                                step="5"
                                value={formData.customPricing[service.id] || service.price}
                                onChange={(e) => handlePricingChange(service.id, parseFloat(e.target.value) || 0)}
                                className="w-24 pl-6 pr-2 py-1 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedServices.length > 0 ? (
                      selectedServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              ${formData.customPricing[service.id] || service.price}
                            </div>
                            <div className="text-xs text-gray-500">Your Rate</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-center">
                        No services selected
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Professional Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell customers about your experience and expertise..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium min-h-[80px]">
                    {formData.bio || 'No bio provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Professional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-green-600">{professional?.reviewCount || 45}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{professional?.rating || 4.8}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-600">$12,450</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">$2,180</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}