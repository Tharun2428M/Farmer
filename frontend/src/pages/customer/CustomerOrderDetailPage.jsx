import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Star,
  XCircle,
  HelpCircle
} from 'lucide-react';
import orderService from '../../services/orderService';

const STATUS_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Order received & accepted by farmers' },
  { key: 'PROCESSING', label: 'Harvesting & Packing', desc: 'Farmers are preparing fresh produce' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'On its way directly to your door' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Produce received fresh' }
];

const CustomerOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getCustomerOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError('Could not load order details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored to the farmers.')) {
      return;
    }

    try {
      setCancelling(true);
      setError('');
      const updated = await orderService.cancelOrder(id);
      setOrder(updated);
      setSuccessMsg('Order has been cancelled successfully.');
    } catch (err) {
      console.error('Failed to cancel order:', err);
      setError(err.response?.data?.message || 'Could not cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return -1;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The requested order does not exist or you do not have permission.</p>
        <Link
          to="/customer/orders"
          className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const shortId = order.id.substring(0, 8).toUpperCase();
  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const canCancel = order.status === 'CONFIRMED' || order.status === 'PENDING';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/customer/orders"
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{shortId}</h1>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                  isCancelled
                    ? 'bg-red-100 text-red-700'
                    : order.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition flex items-center gap-2"
          >
            {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Cancel Order
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Visual Tracking Progress Bar */}
      {!isCancelled ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            Live Delivery Tracking
          </h2>

          <div className="relative">
            {/* Desktop Timeline */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-4 relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100))}%`
                  }}
                />
              </div>

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="relative text-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs transition ${
                        isPassed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-emerald-700' : isPassed ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-[140px] mx-auto">{step.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Timeline */}
            <div className="sm:hidden space-y-6">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                        isPassed ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-emerald-700' : isPassed ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-8 flex items-center gap-4 text-red-800">
          <XCircle className="w-8 h-8 shrink-0 text-red-600" />
          <div>
            <h3 className="font-bold">This order was cancelled</h3>
            <p className="text-sm text-red-700">Stock quantities have been restored to the farmers.</p>
          </div>
        </div>
      )}

      {/* Grid: Produce Items & Delivery Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Produce Items ({order.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-emerald-600 bg-emerald-50">
                          {item.productTitle?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-bold text-gray-900 hover:text-emerald-600 transition text-sm sm:text-base block"
                      >
                        {item.productTitle}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {item.quantity} {item.unit} × ₹{item.unitPrice}
                      </p>
                      {item.farmerName && (
                        <p className="text-xs text-emerald-700 font-medium mt-0.5">
                          Farmer: {item.farmerName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-gray-900">
                      ₹{Number(item.subtotal).toFixed(2)}
                    </div>
                    {order.status === 'DELIVERED' && (
                      <Link
                        to={`/products/${item.productId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Write Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-6 mt-6 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Direct Farmer Commission</span>
                <span className="text-emerald-600 font-medium">0% (Zero Fee)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                <span>Total Amount Paid/Due</span>
                <span className="text-xl text-emerald-600">₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Delivery Address
            </h3>
            {order.address ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">
                  {order.address.city}, {order.address.state}
                </p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p className="text-xs text-gray-500 pt-1">
                  PIN: {order.address.postalCode} {order.address.landmark && `• ${order.address.landmark}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Address details unavailable.</p>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Payment Information
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-semibold text-gray-900">
                  {order.payment?.paymentMethod?.replace(/_/g, ' ') || 'Cash On Delivery'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`font-bold ${
                    order.payment?.status === 'SUCCESS' || order.paymentStatus === 'PAID'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {order.payment?.status || order.paymentStatus}
                </span>
              </div>
              {order.payment?.transactionReference && (
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>Txn Ref:</span>
                  <span className="font-mono">{order.payment.transactionReference}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetailPage;
