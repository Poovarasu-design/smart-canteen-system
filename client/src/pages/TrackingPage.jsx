import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Sparkles,
  ArrowRight,
  Printer,
  QrCode,
  AlertCircle,
  Play
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { BillModal } from '../components/BillModal';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';

export const TrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);

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

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSimulateNext = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateNextStatus(order.id);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Order transmitted to canteen kitchen' },
    { label: 'Payment Confirmed', desc: 'Payment verified & order queued' },
    { label: 'Preparing', desc: 'Chef preparing fresh hot meal' },
    { label: 'Ready for Pickup', desc: 'Ready at express collection counter' },
    { label: 'Collected', desc: 'QR code verified and meal collected' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Payment Confirmed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Ready for Pickup':
        return 3;
      case 'Collected':
        return 4;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-700">Loading Order Tracker...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Live Tracker
            </span>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Order <span className="font-mono text-emerald-600">{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Prep Time Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center min-w-[180px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Estimated Kitchen Prep
          </span>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xl font-black text-emerald-700">
            <Clock className="w-5 h-5 text-emerald-600" />
            {order.orderStatus === 'Ready for Pickup' ? (
              <span className="text-emerald-600 font-extrabold text-sm">READY NOW!</span>
            ) : order.orderStatus === 'Collected' ? (
              <span className="text-slate-500 text-sm font-bold">COLLECTED</span>
            ) : (
              <span>~{order.estimatedPrepTime || 10} Mins</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Counter #2 (Express Pickup)</span>
        </div>
      </div>

      {/* Interactive Evaluation Simulation Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-950">Prototype Interactive Evaluator</p>
            <p className="text-[11px] text-indigo-700">
              Click to advance kitchen order status for live evaluation testing.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateNext}
          disabled={simulating || currentStep >= steps.length - 1}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {simulating ? 'Updating...' : currentStep >= steps.length - 1 ? 'Order Completed' : 'Simulate Next Status →'}
        </button>
      </div>

      {/* Progress Timeline (Requirement 10) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 mb-6">Kitchen Preparation Progress</h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {steps.map((st, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isFuture = idx > currentStep;

            return (
              <div key={st.label} className="relative flex items-start gap-4 group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-800 animate-pulse ring-4 ring-emerald-200'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm sm:text-base font-bold ${
                        isCurrent
                          ? 'text-emerald-700'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code and Actions Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
            {order.qrCodeImage ? (
              <img src={order.qrCodeImage} alt="Order QR" className="w-24 h-24 object-contain" />
            ) : (
              <QRCodeSVG value={order.qrData || order.orderNumber} size={96} />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Express Token QR
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">Show at Canteen Counter</p>
            <p className="text-xs text-slate-500 mt-1">
              Payment:{' '}
              <span className="font-semibold text-slate-800">{order.paymentMethod}</span> (
              <span
                className={order.paymentStatus === 'PAID' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}
              >
                {order.paymentStatus}
              </span>
              )
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setBillModalOpen(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Digital Bill
          </button>
          <Link
            to="/my-orders"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            All Orders
          </Link>
        </div>
      </div>

      <BillModal order={order} isOpen={billModalOpen} onClose={() => setBillModalOpen(false)} />
    </div>
  );
};
