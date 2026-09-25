import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const serviceFee = 0; // Canteen student discount
  const grandTotal = subtotal + serviceFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-200">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Looks like you haven't added anything to your tray yet. Choose from our delicious canteen menu!
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Food Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Your Food Tray
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {totalItems} item{totalItems > 1 ? 's' : ''} in cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.foodId} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                {/* Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    ₹{item.price} each
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[60px]">
                  <p className="text-sm sm:text-base font-extrabold text-slate-900">
                    ₹{item.subtotal || item.price * item.quantity}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.foodId)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Canteen Service & Tray Fee</span>
                <span className="font-semibold text-emerald-600">₹0 (Free)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Priority Pickup</span>
                <span className="font-semibold text-emerald-600">Included</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-600 font-mono text-xl">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Direct pre-order token verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
