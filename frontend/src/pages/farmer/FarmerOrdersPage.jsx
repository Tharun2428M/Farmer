import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import farmerOrderService from '../../services/farmerOrderService';

const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await farmerOrderService.getFarmerOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load farmer orders:', err);
      setError('Could not load orders containing your farm produce.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError('');
      setSuccessMsg('');
      const updated = await farmerOrderService.updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      setSuccessMsg(`Order #${orderId.substring(0, 8).toUpperCase()} updated to ${newStatus.replace(/_/g, ' ')}! Customer notified.`);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.response?.data?.message || 'Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'ALL') return true;
    return o.status === selectedFilter;
  });

  const getStatusBadge = (status) => {
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
        <p className="text-gray-600 font-medium">Loading customer farm orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Farmer Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fulfill and manage customer orders containing your produce
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm text-xs font-semibold">
          {['ALL', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders in this Status</h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            When customers order your fresh produce, you will see their orders and delivery destinations here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const shortId = order.id.substring(0, 8).toUpperCase();
            const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-gray-900">
                        Order #{shortId}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Placed on {dateFormatted}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status progression controls */}
                    {order.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                        Start Harvesting & Packing
                      </button>
                    )}

                    {order.status === 'PROCESSING' && (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, 'OUT_FOR_DELIVERY')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        Dispatch / Out for Delivery
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Mark Delivered & Settle Payment
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Completed & Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Items & Delivery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                  {/* Left: Ordered Items */}
                  <div className="md:col-span-7 space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Crop Items Ordered
                    </h4>
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{item.productTitle}</p>
                          <p className="text-xs text-gray-500">
                            Quantity: <span className="font-bold text-gray-800">{item.quantity} {item.unit}</span> (₹{item.unitPrice} / {item.unit})
                          </p>
                        </div>
                        <div className="font-bold text-gray-900">
                          ₹{Number(item.subtotal).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Customer Delivery Destination */}
                  <div className="md:col-span-5 bg-emerald-50/40 rounded-xl p-4 border border-emerald-100/60">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      Delivery Destination
                    </h4>
                    {order.address ? (
                      <div className="text-xs text-gray-700 space-y-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {order.address.city}, {order.address.state}
                        </p>
                        <p>{order.address.addressLine1}</p>
                        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                        <p className="text-gray-500">
                          PIN: {order.address.postalCode} {order.address.landmark && `• Landmark: ${order.address.landmark}`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Address not provided.</p>
                    )}

                    <div className="mt-3 pt-3 border-t border-emerald-100 text-xs flex justify-between items-center text-gray-600">
                      <span>Payment: <b>{order.payment?.paymentMethod?.replace(/_/g, ' ')}</b></span>
                      <span className="font-bold text-emerald-700">₹{Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;
