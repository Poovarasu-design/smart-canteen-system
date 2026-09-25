import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Clock, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!food.availability) return;
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        food.availability
          ? 'border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1'
          : 'border-slate-200 opacity-75 bg-slate-50/50'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            food.availability ? 'group-hover:scale-105' : 'grayscale'
          }`}
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {food.category}
        </span>

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
            food.availability
              ? 'bg-emerald-500/90 backdrop-blur-md text-white'
              : 'bg-rose-500/90 backdrop-blur-md text-white'
          }`}
        >
          {food.availability ? 'Available' : 'Sold Out'}
        </span>

        {/* Prep Time pill */}
        {food.prepTime && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3 text-emerald-600" />
            {food.prepTime}
          </div>
        )}

        {/* Rating */}
        {food.rating && (
          <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-slate-950" />
            {food.rating}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
              {food.name}
            </h3>
            <span className="text-base sm:text-lg font-extrabold text-emerald-600 shrink-0">
              ₹{food.price}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {food.description || 'Delicious freshly prepared canteen item.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={!food.availability}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-xs font-bold text-slate-800 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={!food.availability}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!food.availability}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
              !food.availability
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
