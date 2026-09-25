import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  QrCode,
  Printer,
  ArrowRight,
  Home,
  Clock,
  Banknote,
  CreditCard,
  ChefHat
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { BillModal } from '../components/BillModal';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';

export const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [billModalOpen, setBillModalOpen] = useState(false);

  useEffect(() => {
    // Fire confetti for celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.getOrderById(id);
          if (res.success && res.order) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-700">Loading Order Confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-24">
      {/* Success Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Order Placed Successfully!</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
          Your canteen pre-order has been registered with the kitchen. Save your QR token below.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Order Details Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
              Unique Order Token ID
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              {order.orderNumber || order.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600" />
            Express Pick-up Verification QR
          </span>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md inline-block">
            {order.qrCodeImage ? (
              <img src={order.qrCodeImage} alt="Order QR" className="w-44 h-44 object-contain" />
            ) : (
              <QRCodeSVG
                value={order.qrData || order.orderNumber || order.id}
                size={176}
                level="M"
                includeMargin={false}
              />
            )}
          </div>

          <p className="text-xs font-semibold text-slate-700 mt-3">
            Present this QR code to the canteen staff at the counter.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Encrypted with Order ID: <span className="font-mono">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Summary Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Student</span>
            <span className="font-semibold text-slate-800">{order.studentName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">College ID</span>
            <span className="font-mono font-semibold text-slate-800">{order.studentCollegeId}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Payment Mode</span>
            <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Amount</span>
            <span className="font-mono font-black text-emerald-600 text-sm">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Items in This Order ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="text-slate-400 text-[11px] ml-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-slate-700">₹{item.subtotal || item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to={`/tracking/${order.id}`}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-md"
          >
            <Clock className="w-4 h-4" />
            Track Live Order Status
          </Link>

          <button
            onClick={() => setBillModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            Download Bill / Print Receipt
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-slate-500 hover:text-slate-900 text-xs font-semibold"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>

      {/* Printable Bill Modal */}
      <BillModal order={order} isOpen={billModalOpen} onClose={() => setBillModalOpen(false)} />
    </div>
  );
};
