import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

export default function UserDashboard() {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [ratingModal, setRatingModal] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const userBookings = state.bookings.filter(booking => 
    booking.userId === authState.user?.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch({ type: 'CANCEL_BOOKING', payload: bookingId });
      setSelectedBooking(null);
    }
  };

  const handleRateService = (booking: any) => {
    setRatingModal(booking);
    setRating(5);
    setReview('');
  };

  const submitRating = () => {
    if (ratingModal) {
      dispatch({
        type: 'UPDATE_BOOKING',
        payload: {
          id: ratingModal.id,
          updates: { rating, review }
        }
      });
      setRatingModal(null);
      alert('Thank you for your feedback!');
    }
  };

  const getService = (serviceId: string) => 
    state.services.find(s => s.id === serviceId);
  
  const getProfessional = (professionalId: string) => 
    state.professionals.find(p => p.id === professionalId);

  const stats = {
    total: userBookings.length,
    completed: userBookings.filter(b => b.status === 'completed').length,
    pending: userBookings.filter(b => b.status === 'pending').length,
    cancelled: userBookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and service history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
          </div>

          {userBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Start by booking a service from our services page</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {userBookings.map((booking) => {
                const service = getService(booking.serviceId);
                const professional = getProfessional(booking.professionalId);
                
                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service?.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {booking.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.address.substring(0, 50)}...
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">${booking.price}</span>
                          </div>
                        </div>

                        {professional && (
                          <div className="flex items-center mt-3">
                            <img
                              src={professional.image}
                              alt={professional.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                            <span className="text-sm text-gray-600">
                              with {professional.name}
                            </span>
                          </div>
                        )}

                        {booking.rating && (
                          <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">Your Rating</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                        
                        {booking.status === 'completed' && !booking.rating && (
                          <button
                            onClick={() => handleRateService(booking)}
                            className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            Rate Service
                          </button>
                        )}
                        
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <Modal
            isOpen={!!selectedBooking}
            onClose={() => setSelectedBooking(null)}
            title="Booking Details"
          >
            {(() => {
              const service = getService(selectedBooking.serviceId);
              const professional = getProfessional(selectedBooking.professionalId);
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-600 mb-1">Service</label>
                      <p className="font-medium">{service?.name}</p>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Professional</label>
                      <p className="font-medium">{professional?.name}</p>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Date</label>
                      <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Time</label>
                      <p className="font-medium">{selectedBooking.time}</p>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Status</label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Price</label>
                      <p className="font-medium">${selectedBooking.price}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 mb-1">Address</label>
                    <p className="font-medium">{selectedBooking.address}</p>
                  </div>
                  
                  {selectedBooking.notes && (
                    <div>
                      <label className="block text-gray-600 mb-1">Notes</label>
                      <p className="font-medium">{selectedBooking.notes}</p>
                    </div>
                  )}

                  {selectedBooking.review && (
                    <div>
                      <label className="block text-gray-600 mb-1">Your Review</label>
                      <p className="font-medium">{selectedBooking.review}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </Modal>
        )}

        {/* Rating Modal */}
        {ratingModal && (
          <Modal
            isOpen={!!ratingModal}
            onClose={() => setRatingModal(null)}
            title="Rate Your Service"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  How was your experience?
                </h3>
                <p className="text-gray-600">
                  Rate your experience with {getProfessional(ratingModal.professionalId)?.name}
                </p>
              </div>

              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave a review (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell others about your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRatingModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}