import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  Clock,
  Award,
  Zap,
  RefreshCw,
  Database
} from 'lucide-react';
import { api } from '../services/api';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-700">Loading Canteen Sales Analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const trends = data?.trends || [];
  const popular = data?.popularItems || [];
  const peakHours = data?.peakHours || [];

  const maxRevenue = Math.max(...trends.map((t) => t.revenue), 100);
  const maxOrders = Math.max(...trends.map((t) => t.orders), 5);
  const maxPopularCount = Math.max(...popular.map((p) => p.count), 1);
  const maxPeakCount = Math.max(...peakHours.map((h) => h.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Performance Metrics & Trends
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Canteen Sales & Order Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Identify peak rushes, fast-moving food items, and daily canteen revenue trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>{stats.databaseMode || 'MongoDB'}</span>
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Sales</span>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">₹{stats.totalSales || 0}</h3>
            <span className="text-xs text-emerald-600 font-semibold">Across all completed orders</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Orders Today</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrdersToday || 0}</h3>
            <span className="text-xs text-slate-500 font-medium">Pre-orders processed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Popular Champion</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate max-w-[140px]">
              {popular[0]?.name || 'Veg Fried Rice'}
            </h3>
            <span className="text-xs text-amber-600 font-semibold">#1 Most ordered meal</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Queue Efficiency</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">85% Faster</h3>
            <span className="text-xs text-slate-500 font-medium">Over traditional counter line</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts: Revenue & Daily Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Revenue Trends</h3>
              <p className="text-xs text-slate-500">Revenue in ₹ across past 7 days</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              ₹{trends.reduce((s, t) => s + t.revenue, 0)} Total
            </span>
          </div>

          <div className="h-60 pt-6 flex items-end justify-between gap-2 border-b border-slate-100">
            {trends.map((t) => {
              const heightPercent = Math.max(12, Math.round((t.revenue / maxRevenue) * 100));
              return (
                <div key={t.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{t.revenue}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                  />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap mt-1">
                    {t.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Orders Count Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Orders Processed</h3>
              <p className="text-xs text-slate-500">Volume of student pre-orders</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {trends.reduce((s, t) => s + t.orders, 0)} Orders
            </span>
          </div>

          <div className="h-60 pt-6 flex items-end justify-between gap-2 border-b border-slate-100">
            {trends.map((t) => {
              const heightPercent = Math.max(15, Math.round((t.orders / maxOrders) * 100));
              return (
                <div key={t.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.orders}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                  />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap mt-1">
                    {t.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Most Popular Items & Peak Rush Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Ordered Items */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top 5 Most Ordered Items</h3>
            <p className="text-xs text-slate-500">Student favorites ranking by unit count</p>
          </div>

          <div className="space-y-3">
            {popular.map((item, idx) => {
              const pct = Math.round((item.count / maxPopularCount) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-mono">
                        #{idx + 1}
                      </span>
                      {item.name}
                    </span>
                    <span className="font-mono font-semibold text-slate-600">{item.count} orders</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Ordering Hours */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Peak Ordering Hours</h3>
            <p className="text-xs text-slate-500">Time distribution of daily counter orders</p>
          </div>

          <div className="space-y-3">
            {peakHours.map((slot) => {
              const pct = Math.round((slot.count / maxPeakCount) * 100);
              return (
                <div key={slot.hour} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {slot.hour} ({slot.label})
                    </span>
                    <span className="font-mono font-semibold text-slate-600">{slot.count} orders</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${
                        slot.label.includes('Peak')
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                          : 'bg-gradient-to-r from-indigo-500 to-blue-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
