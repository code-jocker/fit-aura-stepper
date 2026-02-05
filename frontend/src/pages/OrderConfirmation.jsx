import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../api';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container py-32 text-center">
        <div className="animate-spin text-4xl mb-4">👟</div>
        <p className="text-gray-500 font-bold uppercase tracking-widest">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-2">Thank you for your purchase</p>
        <p className="text-lg text-gray-500 mb-8">Order ID: <span className="font-mono font-bold">{orderId}</span></p>
        
        {order?.transactionId && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 inline-block mx-auto">
            <p className="text-green-800 text-sm font-bold uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="text-green-600 font-mono text-xl">{order.transactionId}</p>
          </div>
        )}

        <div className="card p-8 mb-8 text-left">
          <h3 className="font-black text-xl mb-4 border-b pb-2">Order Details</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-bold">{order?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-black">{order?.total?.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-bold uppercase">{order?.paymentMethod}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            Your order has been successfully placed! You will receive a confirmation email with tracking details.
          </p>
          <p className="text-gray-700">
            Our team will process your order shortly. Expected delivery: <b>2-3 business days</b> in Kigali.
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/products" className="block btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="block btn-outline">
            Back to Home
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="font-bold text-lg mb-4">📞 Need Help?</h3>
          <p className="text-gray-600 mb-4">Contact our 24/7 support team</p>
          <div className="space-y-2">
            <p>📧 support@fitaura.rw</p>
            <p>📞 +250 (0) 798 000 000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
