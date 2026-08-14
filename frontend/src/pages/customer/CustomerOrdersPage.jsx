import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Truck, Calendar, AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import orderService from '../../services/orderService';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getCustomerOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
      setError('Could not load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading your farm orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your direct-from-farm produce deliveries
          </p>
        </div>
        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-2 rounded-xl transition text-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Browse More Produce
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Placed Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">
            You haven't bought directly from our local farmers yet. Fresh, chemical-free produce is waiting for you!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            Start Shopping Fresh
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const shortId = order.id.substring(0, 8).toUpperCase();
            const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">#{shortId}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> Placed on {dateFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-500">Order Total</div>
                    <div className="text-lg font-extrabold text-emerald-600">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="py-4 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.productTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-700 bg-emerald-50">
                              {item.productTitle?.charAt(0) || 'P'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.productTitle}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ₹{item.unitPrice} / {item.unit}
                            {item.farmerName && ` • Farm: ${item.farmerName}`}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-gray-800">
                        ₹{Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Delivery: <span className="font-medium text-gray-700">{order.delivery?.status?.replace(/_/g, ' ') || 'Processing'}</span>
                  </div>

                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    View Details & Tracking <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
