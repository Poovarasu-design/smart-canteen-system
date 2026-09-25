import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  QrCode,
  Printer,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';
import { BillModal } from '../components/BillModal';

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Active' | 'Completed'

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'Active') {
      return o.orderStatus !== 'Collected' && o.orderStatus !== 'Cancelled';
    }
    if (filter === 'Completed') {
      return o.orderStatus === 'Collected';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Student Account History
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Orders & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View token status, digital receipts, and pickup QR codes for your meals
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl shadow-sm text-xs">
          {['All', 'Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filter === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {filter === 'All'
              ? "You haven't placed any canteen orders yet."
              : `You have no ${filter.toLowerCase()} orders.`}
          </p>
          <Link
            to="/menu"
            className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700"
          >
            Order Food Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900">
                    {order.orderNumber}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Total: <strong className="text-emerald-700 text-sm font-mono">₹{order.totalAmount}</strong>
                  </span>
                  <span>Payment: {order.paymentMethod}</span>
                  {order.transactionId && <span className="font-mono text-[11px]">Txn: {order.transactionId}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setBillModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Bill
                </button>

                <Link
                  to={`/tracking/${order.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  View Details & Track <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <BillModal
          order={selectedOrder}
          isOpen={billModalOpen}
          onClose={() => {
            setBillModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};
