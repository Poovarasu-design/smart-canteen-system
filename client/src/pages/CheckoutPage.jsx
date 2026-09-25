import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Hash,
  Phone,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CheckoutPage = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentCollegeId, setStudentCollegeId] = useState(user?.collegeId || '');
  const [studentPhone, setStudentPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('GPay / UPI'); // or 'Cash at Counter'

  // UPI Simulation state
  const [isSimulatingUPI, setIsSimulatingUPI] = useState(false);
  const [upiStage, setUpiStage] = useState('idle'); // 'idle' | 'processing' | 'success' | 'failed'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add items to proceed to checkout.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim() || !studentCollegeId.trim()) {
      setErrorMsg('Please enter Student Name and College ID.');
      return;
    }

    if (paymentMethod === 'GPay / UPI') {
      // Open simulated UPI payment modal
      setIsSimulatingUPI(true);
      setUpiStage('ready');
    } else {
      // Cash at counter: create order immediately
      handlePlaceOrderDirect('Cash at Counter', null);
    }
  };

  const handlePlaceOrderDirect = async (method, txnId) => {
    setLoading(true);
    try {
      const orderPayload = {
        items: cart,
        paymentMethod: method,
        studentName,
        studentCollegeId,
        studentPhone,
        transactionId: txnId
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate(`/confirmation/${res.order.id}`, { state: { order: res.order } });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setIsSimulatingUPI(false);
    } finally {
      setLoading(false);
    }
  };

  // Safe Simulated UPI Process
  const handleProcessUPI = async () => {
    setUpiStage('processing');
    setErrorMsg('');

    try {
      // Simulate backend payment verification
      const payRes = await api.simulatePayment({
        amount: subtotal,
        method: `${selectedUpiApp} (UPI)`,
        shouldFail: simulateFailure
      });

      // Show processing animation for 1.2s for realism
      setTimeout(async () => {
        setUpiStage('success');
        setTimeout(async () => {
          await handlePlaceOrderDirect('GPay / UPI', payRes.transactionId);
        }, 1000);
      }, 1200);
    } catch (err) {
      setTimeout(() => {
        setUpiStage('failed');
        setErrorMsg(err.message || 'Simulated UPI payment failed.');
      }, 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2">
        <Link
          to="/cart"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tray
        </Link>
      </div>

      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout & Token Generation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Confirm student identification and select your preferred payment mode
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Student Verification */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">1. Student Identification</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College ID / Roll No.
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={studentCollegeId}
                    onChange={(e) => setStudentCollegeId(e.target.value)}
                    placeholder="2023CS0101"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number (for SMS & Pick-up Alerts)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">2. Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: GPay / UPI */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'GPay / UPI'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      GPay / UPI
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="GPay / UPI"
                      checked={paymentMethod === 'GPay / UPI'}
                      onChange={() => setPaymentMethod('GPay / UPI')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Pay instantly via Google Pay, PhonePe, or UPI. Order confirmed immediately.
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded">Instant Digital Token</span>
                </div>
              </label>

              {/* Option 2: Cash at Counter */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'Cash at Counter'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      Cash at Counter
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash at Counter"
                      checked={paymentMethod === 'Cash at Counter'}
                      onChange={() => setPaymentMethod('Cash at Counter')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Pay at the canteen counter when collecting your order. Order generated with "Payment Pending".
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  <span className="px-2 py-0.5 bg-amber-100 rounded">Pay at Counter</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'Cash at Counter' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Banknote className="w-4 h-4 shrink-0" />
                <span>
                  Please show your QR code and pay <strong>₹{subtotal}</strong> in cash at the express pick-up counter.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Items & Pay Button */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Selected Items</h3>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
              {cart.map((item) => (
                <div key={item.foodId} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-slate-800">₹{item.subtotal || item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tray & Handling</span>
                <span className="text-emerald-600 font-semibold">₹0</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-emerald-600 font-mono text-xl">₹{subtotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Order...
                </>
              ) : paymentMethod === 'GPay / UPI' ? (
                <>
                  Proceed to UPI Payment (₹{subtotal})
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Place Order & Get QR Token
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Simulated UPI Payment Modal (Requirement 6) */}
      {isSimulatingUPI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 relative">
            {/* Modal Header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Simulated UPI Gateway</h3>
              <p className="text-xs text-slate-500">Safe Prototype Demo (No Real Money Charged)</p>
            </div>

            {/* Total Display */}
            <div className="py-4 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Order Total
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">₹{subtotal}</span>
            </div>

            {/* UPI App Selector */}
            {upiStage === 'ready' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Choose UPI App:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedUpiApp === app
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error simulation toggle for testing */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Test Failure Flow:</span>
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleProcessUPI}
                    className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    Pay ₹{subtotal} Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSimulatingUPI(false)}
                    className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                  >
                    Cancel Payment
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {upiStage === 'processing' && (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Processing Payment...</h4>
                <p className="text-xs text-slate-500">Contacting {selectedUpiApp} simulation gateway...</p>
              </div>
            )}

            {/* Success State */}
            {upiStage === 'success' && (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-emerald-800">Payment Successful!</h4>
                <p className="text-xs text-slate-500">Generating your unique Order QR token...</p>
              </div>
            )}

            {/* Failed State */}
            {upiStage === 'failed' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-rose-700">Payment Failed</h4>
                <p className="text-xs text-slate-500">
                  {errorMsg || 'Bank simulation declined or user cancelled.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateFailure(false);
                    setUpiStage('ready');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
