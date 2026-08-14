import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home, Clock } from 'lucide-react';
import orderService from '../../services/orderService';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      loadOrder();
    }
  }, [id, order]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getCustomerOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const shortId = id ? id.substring(0, 8).toUpperCase() : 'UNKNOWN';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      {/* Animated Check Icon */}
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50 animate-bounce">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
        Order Placed Successfully
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
        Thank You for Supporting Local Farmers!
      </h1>

      <p className="text-gray-600 max-w-lg mx-auto mb-8 text-sm sm:text-base">
        Your order <span className="font-bold text-gray-900">#{shortId}</span> has been confirmed. The farmers have been notified to harvest and prepare your fresh produce for delivery.
      </p>

      {/* Order Summary Card */}
      {order && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-lg mx-auto mb-8 text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono font-bold text-gray-900">#{shortId}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-bold text-emerald-600 text-base">₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-sm">
            <span className="text-gray-500">Payment Status:</span>
            <span className="font-semibold text-gray-900">
              {order.payment?.paymentMethod?.replace(/_/g, ' ')} ({order.payment?.status})
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" /> 1 - 2 Business Days
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={`/customer/orders/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          <Truck className="w-5 h-5" />
          Track Order & Delivery
        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3.5 rounded-xl transition"
        >
          <Home className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
