import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await api.getFoods();
        if (data.success) {
          setPopularFoods(data.foods.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Choose Your Meal',
      desc: 'Browse fresh breakfast, hearty meals, snacks & beverages. Select items and quantities with 1 click.',
      icon: UtensilsCrossed,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      num: '02',
      title: 'Pay Securely',
      desc: 'Pay instantly via simulated UPI / GPay or select Cash at Counter to settle when picking up.',
      icon: Zap,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '03',
      title: 'Get Dynamic QR',
      desc: 'Receive an instant digital order bill and an encrypted verification QR code right on your phone.',
      icon: QrCode,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      num: '04',
      title: 'Collect Food Quickly',
      desc: 'Walk straight to the express pickup counter, flash your QR code, collect your hot meal, and head to class!',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs sm:text-sm font-bold shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            “Because Good Food Shouldn’t Keep You Waiting!”
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            SMART CANTEEN <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              PRE-ORDERING SYSTEM
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Skip the agonizing peak-hour canteen queues. Order your favorite meals before class ends, receive your verified QR token, and pick up in seconds.
          </p>

          {/* Quick Flow Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 px-5 rounded-2xl bg-white border border-slate-200/80 shadow-md text-xs sm:text-sm font-semibold text-slate-700">
            <span className="text-emerald-600 font-bold">Order</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600 font-bold">Pay</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600 font-bold">Get QR</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600 font-bold">Collect Food</span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/menu' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/25"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-800 font-bold text-base border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              View Food Menu
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Zero Wait Time</p>
                <p className="text-[11px] text-slate-500">Pick up ready food</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Instant QR Pass</p>
                <p className="text-[11px] text-slate-500">Fast token scan</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">UPI & Cash</p>
                <p className="text-[11px] text-slate-500">Flexible payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            How It Works
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Four Simple Steps to Savor Your Meal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Engineered specifically for busy college students and staff between classes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300">{step.num}</span>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem / Solution Section (Requirement 21) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-navy-900 rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                Design Thinking & PBL Rationale
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
                Addressing the College Canteen Bottleneck
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Problem Card */}
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-rose-300">The Problem</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  During peak lunch and breakfast breaks, hundreds of students arrive at the canteen simultaneously. Long queues at the ordering counter and cash registers cause:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    Students wasting 20–30 minutes just standing in line.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    Delayed food preparation and disorganized token handing.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    Students arriving late to lectures or missing meals completely.
                  </li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-emerald-300">The Smart Canteen Solution</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A responsive web-based pre-ordering system where students browse live menu availability, order before reaching the canteen, and track preparation in real-time:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    Advance ordering straight from classroom or hostel.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    Encrypted QR token that staff verify in under 2 seconds.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    Kitchen staff gets orders ahead of time, smoothing the rush.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Campus Favorites
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Most Popular Canteen Delights
            </h2>
            <p className="text-sm text-slate-500 mt-1">Freshly prepared, hygiene-certified, and budget friendly.</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            Explore Full Menu <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-slate-200/70 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
