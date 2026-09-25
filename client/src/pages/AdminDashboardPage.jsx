import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Search,
  SlidersHorizontal,
  QrCode,
  Utensils,
  BarChart3,
  RefreshCw,
  Check,
  Play
} from 'lucide-react';
import { api } from '../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';
import { BillModal } from '../components/BillModal';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillOrder, setSelectedBillOrder] = useState(null);
  const [billModalOpen, setBillModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        api.getAnalytics(),
        api.getAllOrders()
      ]);

      if (analyticsRes.success) setStats(analyticsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o))
        );
        loadData();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkPaid = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const res = await api.updateOrderStatus(orderId, { paymentStatus: 'PAID' });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o))
        );
        loadData();
      }
    } catch (err) {
      alert('Error marking payment as paid: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        o.studentCollegeId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Canteen Staff Control Center
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Management & Live Kitchen Feed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incoming student food orders, kitchen dispatch, and counter collection
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
          >
            <QrCode className="w-4 h-4" />
            Staff QR Scanner
          </Link>
          <Link
            to="/admin/menu"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Utensils className="w-4 h-4 text-emerald-600" />
            Manage Menu
          </Link>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Sales Analytics
          </Link>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            title="Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (Requirement 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Today's Orders
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {stats?.totalOrdersToday ?? orders.length}
          </span>
          <span className="text-[10px] text-slate-500">All student requests</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">
            Pending Approval
          </span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">
            {stats?.pendingOrders ?? 0}
          </span>
          <span className="text-[10px] text-blue-500">Needs acceptance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">
            Preparing Now
          </span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">
            {stats?.preparingOrders ?? 0}
          </span>
          <span className="text-[10px] text-amber-500">In chef kitchen</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
            Ready for Pickup
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {stats?.readyOrders ?? 0}
          </span>
          <span className="text-[10px] text-emerald-500">At counter tray</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Completed / Collected
          </span>
          <span className="text-2xl font-black text-slate-700 mt-1 block">
            {stats?.completedOrders ?? 0}
          </span>
          <span className="text-[10px] text-slate-400">Tokens closed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
          <span className="text-[10px] uppercase font-bold text-emerald-100 block tracking-wider">
            Total Sales
          </span>
          <span className="text-2xl font-black font-mono mt-1 block">
            ₹{stats?.totalSales ?? 0}
          </span>
          <span className="text-[10px] text-emerald-100">Paid revenues</span>
        </div>
      </div>

      {/* Order Controls & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search order ID, student name, roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {['All', 'Order Placed', 'Preparing', 'Ready for Pickup', 'Collected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table (Requirement 13) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Ordered Food Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-right">Kitchen Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading incoming orders feed...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isBusy = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <button
                          onClick={() => {
                            setSelectedBillOrder(order);
                            setBillModalOpen(true);
                          }}
                          className="hover:underline text-emerald-700"
                          title="Click to view order bill"
                        >
                          {order.orderNumber}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{order.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{order.studentCollegeId}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="truncate text-slate-700 font-medium">
                          {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
                        {order.paymentStatus === 'PENDING' && (
                          <button
                            onClick={() => handleMarkPaid(order.id)}
                            disabled={isBusy}
                            className="block text-[10px] font-bold text-emerald-600 hover:underline"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={order.orderStatus} />
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {order.orderStatus === 'Order Placed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Accept & Prepare
                            </button>
                          )}

                          {order.orderStatus === 'Payment Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              Start Preparing
                            </button>
                          )}

                          {order.orderStatus === 'Preparing' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Ready for Pickup')}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Mark Ready
                            </button>
                          )}

                          {order.orderStatus === 'Ready for Pickup' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Collected')}
                              disabled={isBusy}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                              Mark Collected
                            </button>
                          )}

                          {order.orderStatus === 'Collected' && (
                            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" /> Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBillOrder && (
        <BillModal
          order={selectedBillOrder}
          isOpen={billModalOpen}
          onClose={() => {
            setBillModalOpen(false);
            setSelectedBillOrder(null);
          }}
        />
      )}
    </div>
  );
};
