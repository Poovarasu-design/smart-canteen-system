import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Camera,
  Check,
  RefreshCw,
  Banknote
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';

export const QRScannerPage = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeOrders, setActiveOrders] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const res = await api.getAllOrders();
      if (res.success) {
        // Show orders that need pickup or verification
        setActiveOrders(res.orders.slice(0, 6));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Setup camera scanner when tab is active
  useEffect(() => {
    let scanner = null;
    if (scannerActive) {
      try {
        scanner = new Html5QrcodeScanner(
          'qr-reader-container',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (decodedText) => {
            scanner.clear();
            setScannerActive(false);
            verifyCode(decodedText);
          },
          (error) => {
            // normal scanning frames
          }
        );
      } catch (err) {
        console.error('Camera scanner init error:', err);
      }
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scannerActive]);

  const verifyCode = async (codeToVerify) => {
    if (!codeToVerify.trim()) return;
    setVerifying(true);
    setErrorMsg('');
    setVerificationResult(null);

    try {
      const res = await api.verifyOrderQR({ orderId: codeToVerify.trim(), qrData: codeToVerify.trim() });
      if (res.success && res.order) {
        setVerificationResult({
          valid: true,
          isAlreadyCollected: res.isAlreadyCollected,
          message: res.message,
          order: res.order
        });
      } else {
        setErrorMsg('Invalid or Expired Order.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or Expired Order. Token not found in canteen database.');
    } finally {
      setVerifying(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    verifyCode(orderIdInput);
  };

  const handleMarkCollected = async () => {
    if (!verificationResult?.order?.id) return;
    setVerifying(true);
    try {
      const res = await api.markOrderCollected(verificationResult.order.id, {
        markPaid: verificationResult.order.paymentMethod === 'Cash at Counter'
      });
      if (res.success && res.order) {
        setVerificationResult({
          valid: true,
          isAlreadyCollected: true,
          message: 'ORDER COLLECTED & DISPATCHED SUCCESSFULLY! ✅',
          order: res.order
        });
        fetchActiveOrders();
      }
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Counter Dispatch Terminal
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Staff QR Code Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Scan student order QR code or enter Order ID to verify payment, prepare tray, and mark collected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Scanner & Input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Manual Input Search */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              Manual Order ID Lookup
            </h3>

            <form onSubmit={handleManualSearch} className="space-y-3">
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter ORD-20260922-001..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={verifying || !orderIdInput.trim()}
                className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Verify Order ID'}
              </button>
            </form>
          </div>

          {/* Camera QR Scanner Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              Webcam QR Scanner
            </h3>

            {scannerActive ? (
              <div className="space-y-3">
                <div id="qr-reader-container" className="overflow-hidden rounded-2xl border" />
                <button
                  onClick={() => setScannerActive(false)}
                  className="px-4 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300"
                >
                  Stop Camera
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                <p className="text-xs text-slate-500">
                  Scan the dynamic QR code directly from student's phone screen.
                </p>
                <button
                  onClick={() => setScannerActive(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Activate Camera Scanner
                </button>
              </div>
            )}
          </div>

          {/* 1-Click Test Order Verifiers */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Quick Test Picker (Live Feed):
              </span>
              <button onClick={fetchActiveOrders} className="text-emerald-700 hover:text-emerald-900">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {activeOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOrderIdInput(o.orderNumber);
                    verifyCode(o.orderNumber);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-white border border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-100/50 transition-all text-xs flex items-center justify-between shadow-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">{o.studentName}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700">{o.orderStatus}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Verification Result (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-300 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-rose-900">Invalid or Expired Order</h3>
              <p className="text-xs text-rose-700 max-w-sm mx-auto">{errorMsg}</p>
            </div>
          )}

          {!verificationResult && !errorMsg && (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <QrCode className="w-16 h-16 mx-auto text-slate-300 stroke-1" />
              <h3 className="text-base font-bold text-slate-700">Awaiting QR Scan or Input</h3>
              <p className="text-xs max-w-sm mx-auto">
                Scan student's QR code or select one of the test orders on the left to verify authenticity.
              </p>
            </div>
          )}

          {verificationResult && verificationResult.order && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden animate-in fade-in">
              {/* Top Banner Status */}
              <div
                className={`p-4 text-center text-white font-extrabold text-sm flex items-center justify-center gap-2 ${
                  verificationResult.isAlreadyCollected ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                {verificationResult.isAlreadyCollected
                  ? 'ORDER PREVIOUSLY COLLECTED'
                  : 'ORDER VERIFIED: READY FOR COLLECTION'}
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Token ID</span>
                    <span className="font-mono text-xl font-black text-slate-900">
                      {verificationResult.order.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={verificationResult.order.orderStatus} />
                    <PaymentStatusBadge
                      status={verificationResult.order.paymentStatus}
                      method={verificationResult.order.paymentMethod}
                    />
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Student</span>
                    <span className="font-bold text-slate-900">{verificationResult.order.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">College ID</span>
                    <span className="font-mono font-bold text-slate-900">{verificationResult.order.studentCollegeId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                    <span className="font-semibold text-slate-700">
                      {verificationResult.order.studentPhone || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Food Items Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Items to Hand Over
                  </h4>
                  <div className="space-y-2">
                    {verificationResult.order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 px-2 py-0.5 bg-white rounded-lg border border-slate-200">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-800">Total Order Amount</p>
                    <p className="text-lg font-black font-mono text-emerald-900">
                      ₹{verificationResult.order.totalAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-emerald-800">Payment Status</p>
                    <p className="font-bold text-xs text-emerald-900">
                      {verificationResult.order.paymentStatus === 'PAID'
                        ? 'PAID ONLINE (GPay/UPI)'
                        : 'COLLECT CASH AT COUNTER'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {!verificationResult.isAlreadyCollected ? (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleMarkCollected}
                      disabled={verifying}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      {verificationResult.order.paymentMethod === 'Cash at Counter' &&
                      verificationResult.order.paymentStatus !== 'PAID'
                        ? `Collect ₹${verificationResult.order.totalAmount} Cash & Mark Collected`
                        : 'Mark as Collected'}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-semibold">
                    ✓ This token has already been fulfilled and closed.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
