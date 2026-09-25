import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  ChefHat,
  Coffee,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { OrderStatusBadge } from '../components/StatusBadge';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, ordersRes] = await Promise.all([api.getFoods(), api.getMyOrders()]);

        if (foodsRes.success) {
          setFoods(foodsRes.foods);
        }

        if (ordersRes.success && ordersRes.orders) {
          // Find first order that is not collected or cancelled
          const active = ordersRes.orders.find(
            (o) => o.orderStatus !== 'Collected' && o.orderStatus !== 'Cancelled'
          );
          setActiveOrder(active || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const popularItems = foods.filter((f) => f.isPopular).slice(0, 4);
  const quickCategories = [
    { label: 'Breakfast', img: '🥞', filter: 'Breakfast' },
    { label: 'Lunch Meals', img: '🍛', filter: 'Meals' },
    { label: 'Quick Snacks', img: '🥪', filter: 'Snacks' },
    { label: 'Chai & Coffee', img: '☕', filter: 'Beverages' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Pre-Ordering Active
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-300 font-medium">
            “Skip the queue. Order before you reach the canteen.”
          </p>
          <p className="text-xs text-slate-400 mt-1">
            College ID: <span className="font-mono text-emerald-400 font-semibold">{user?.collegeId}</span>
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Full Menu
          </Link>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
          >
            My Past Bills
          </Link>
        </div>
      </div>

      {/* Current Active Order Alert (if any) */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Active Kitchen Order
                </span>
                <OrderStatusBadge status={activeOrder.orderStatus} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Order <span className="font-mono text-emerald-700">{activeOrder.orderNumber}</span>
              </h3>
              <p className="text-xs text-slate-600">
                {activeOrder.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')} • Total: ₹
                {activeOrder.totalAmount}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeOrder.orderStatus !== 'Ready for Pickup' && (
                <div className="bg-white px-3.5 py-2 rounded-2xl border border-emerald-200 shadow-sm text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Prep Time</span>
                  <span className="text-sm font-black text-emerald-700 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{activeOrder.estimatedPrepTime || 8} mins
                  </span>
                </div>
              )}
              <Link
                to={`/tracking/${activeOrder.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Track Live Status <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Category Jump */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Meal Jump</h2>
          <span className="text-xs text-slate-400">Order by craving</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickCategories.map((cat) => (
            <Link
              key={cat.label}
              to={`/menu?category=${cat.filter}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="text-2xl p-2 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                {cat.img}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{cat.label}</p>
                <p className="text-[10px] text-slate-400">Browse items →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Today section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Popular Today
            </h2>
            <p className="text-xs text-slate-500">Fastest-moving items in the canteen right now</p>
          </div>
          <Link to="/menu" className="text-xs font-bold text-emerald-600 hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
