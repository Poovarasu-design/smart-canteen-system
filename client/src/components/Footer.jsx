import React from 'react';
import { UtensilsCrossed, Clock, MapPin, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              SMART CANTEEN
            </div>
            <p className="text-xs text-slate-400 italic">
              “Because Good Food Shouldn’t Keep You Waiting!”
            </p>
            <p className="text-xs text-slate-500">
              Skip the long queues. Order your favorite meals in advance, pay smoothly, and pick up in seconds.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-emerald-400 transition-colors">
                  Canteen Food Menu
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-emerald-400 transition-colors">
                  My Orders & Receipts
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Canteen Hours */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Canteen Timings</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 font-medium">Monday - Saturday</p>
                  <p className="text-slate-500">8:00 AM – 6:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-400">Campus Central Dining Block, Ground Floor</p>
              </div>
            </div>
          </div>

          {/* Col 4: Pre-Order Flow */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">4-Step Pre-Order Flow</h4>
            <ol className="text-xs space-y-1 text-slate-400">
              <li><span className="text-emerald-400 font-bold">01</span> Browse & Select Meal</li>
              <li><span className="text-emerald-400 font-bold">02</span> Pay via UPI / Cash Counter</li>
              <li><span className="text-emerald-400 font-bold">03</span> Receive Verified QR Code</li>
              <li><span className="text-emerald-400 font-bold">04</span> Scan & Collect with Zero Wait</li>
            </ol>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Canteen Pre-Ordering System. College Prototype Evaluation Build.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for College Students & Staff
          </p>
        </div>
      </div>
    </footer>
  );
};
