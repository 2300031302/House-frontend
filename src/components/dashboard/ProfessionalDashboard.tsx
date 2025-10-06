import React from 'react';
import { Calendar, DollarSign, Star, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfessionalDashboard() {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();

  const professionalBookings = state.bookings.filter(booking => 
    booking.professionalId === authState.user?.id
  );

  const stats = {
    totalBookings: professionalBookings.length,
    completedBookings: professionalBookings.filter(b => b.status === 'completed').length,
    pendingBookings: professionalBookings.filter(b => b.status === 'pending').length,
    totalEarnings: professionalBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + booking.price, 0),
    averageRating: professionalBookings
      .filter(b => b.rating)
      .reduce((sum, booking, _, arr) => sum + (booking.rating || 0) / arr.length, 0) || 0,
  };

  // Sample data for charts
  const monthlyEarnings = [
    { month: 'Jan', earnings: 2400 },
    { month: 'Feb', earnings: 1398 },
    { month: 'Mar', earnings: 3800 },
    { month: 'Apr', earnings: 3908 },
    { month: 'May', earnings: 4800 },
    { month: 'Jun', earnings: 3800 },
  ];

  const weeklyBookings = [
    { day: 'Mon', bookings: 4 },
    { day: 'Tue', bookings: 3 },
    { day: 'Wed', bookings: 6 },
    { day: 'Thu', bookings: 8 },
    { day: 'Fri', bookings: 5 },
    { day: 'Sat', bookings: 7 },
    { day: 'Sun', bookings: 2 },
  ];

  const handleCompleteBooking = (bookingId: string) => {
    dispatch({
      type: 'UPDATE_BOOKING',
      payload: {
        id: bookingId,
        updates: { status: 'completed' }
      }
    });

    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: 'completion' as const,
      message: 'Service marked as completed',
      timestamp: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const getService = (serviceId: string) => 
    state.services.find(s => s.id === serviceId);

  const getUser = (userId: string) => 
    state.users.find(u => u.id === userId);

  const upcomingBookings = professionalBookings
    .filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={authState.user?.image}
              alt={authState.user?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {authState.user?.name}
              </h1>
              <p className="text-gray-600">{(authState.user as any)?.specialty} Professional</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">${stats.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Earnings Chart */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Earnings
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Bookings Chart */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Weekly Bookings
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar 
                  dataKey="bookings" 
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Bookings
            </h3>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h4>
              <p className="text-gray-600">New bookings will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {upcomingBookings.map((booking) => {
                const service = getService(booking.serviceId);
                const user = getUser(booking.userId);
                
                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {service?.name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            booking.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : booking.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-purple-100 text-purple-800 border-purple-200'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {booking.time}
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="font-medium">Customer: {user?.name}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">
                          <strong>Address:</strong> {booking.address}
                        </p>

                        {booking.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <span className="text-lg font-semibold text-green-600">
                          ${booking.price}
                        </span>
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => {
                              dispatch({
                                type: 'UPDATE_BOOKING',
                                payload: {
                                  id: booking.id,
                                  updates: { status: 'confirmed' }
                                }
                              });
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                          >
                            Accept
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
      </div>
    </div>
  );
}