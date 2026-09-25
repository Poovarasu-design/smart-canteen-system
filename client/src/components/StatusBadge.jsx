import React from 'react';
import { Clock, ChefHat, CheckCircle2, AlertCircle, Check, CreditCard, Banknote } from 'lucide-react';

export const OrderStatusBadge = ({ status }) => {
  switch (status) {
    case 'Order Placed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5" />
          Order Placed
        </span>
      );
    case 'Payment Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Check className="w-3.5 h-3.5" />
          Payment Confirmed
        </span>
      );
    case 'Preparing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <ChefHat className="w-3.5 h-3.5" />
          Preparing
        </span>
      );
    case 'Ready for Pickup':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 ring-2 ring-emerald-400/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Ready for Pickup
        </span>
      );
    case 'Collected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          Collected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
};

export const PaymentStatusBadge = ({ status, method }) => {
  const isCash = method === 'Cash at Counter';
  if (status === 'PAID') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
        <Check className="w-3 h-3 text-emerald-600" />
        PAID
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
      {isCash ? <Banknote className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
      CASH PENDING
    </span>
  );
};
