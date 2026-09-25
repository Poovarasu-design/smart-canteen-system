import React from 'react';
import { X, Printer, CheckCircle, UtensilsCrossed, QrCode as QrIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const BillModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 relative flex flex-col max-h-[90vh]">
        {/* Header bar (Not visible in print) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Digital Order Bill</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Area */}
        <div id="printable-bill" className="p-6 overflow-y-auto flex-1 space-y-5 bg-white text-slate-900">
          {/* Canteen Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white mb-2 shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">CAMPUS SMART CANTEEN</h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
              Pre-Ordering Bill & Token
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Central Dining Block • Campus Dining Service</p>
          </div>

          {/* Meta details */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
              <span className="font-mono font-bold text-slate-800">{order.orderNumber || order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
              <span className="text-slate-700 font-medium">
                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-semibold text-slate-800">{order.studentName}</span>
            </div>
            <div className="text-right mt-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">College ID</span>
              <span className="font-mono font-semibold text-slate-800">{order.studentCollegeId}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Order Items Summary
            </span>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left pb-1 font-semibold">Item</th>
                  <th className="text-center pb-1 font-semibold">Qty</th>
                  <th className="text-right pb-1 font-semibold">Rate</th>
                  <th className="text-right pb-1 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-800 font-medium">{item.name}</td>
                    <td className="py-2 text-center text-slate-600 font-mono">{item.quantity}</td>
                    <td className="py-2 text-right text-slate-500">₹{item.price}</td>
                    <td className="py-2 text-right font-semibold text-slate-800">₹{item.subtotal || item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Canteen Service & Tray Charge</span>
              <span className="text-emerald-600 font-medium">₹0 (Waived)</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-emerald-600 font-mono text-base">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Payment Mode</p>
              <p className="font-semibold text-slate-800">{order.paymentMethod}</p>
              {order.transactionId && (
                <p className="text-[10px] font-mono text-slate-500">Ref: {order.transactionId}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Status</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                  order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus === 'PAID' ? 'PAID' : 'PAY AT COUNTER'}
              </span>
            </div>
          </div>

          {/* QR Code Verification Section */}
          <div className="text-center pt-2 flex flex-col items-center">
            <div className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm inline-block">
              {order.qrCodeImage ? (
                <img src={order.qrCodeImage} alt="Order QR Code" className="w-36 h-36 mx-auto" />
              ) : (
                <QRCodeSVG
                  value={order.qrData || order.orderNumber || order.id}
                  size={144}
                  level="M"
                  includeMargin={false}
                />
              )}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 mt-2">
              Present this QR at the Canteen Counter for Verification
            </p>
            <p className="text-[10px] text-slate-400">
              Order ID: <span className="font-mono">{order.orderNumber}</span>
            </p>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 italic">
            “Because Good Food Shouldn’t Keep You Waiting!” • Thank You!
          </div>
        </div>
      </div>
    </div>
  );
};
