import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  SlidersHorizontal,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export const MenuManagementPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    price: '',
    prepTime: '5-10 mins',
    description: '',
    image: '',
    availability: true
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.getFoods();
      if (res.success) setFoods(res.foods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      const res = await api.toggleFoodAvailability(food.id);
      if (res.success && res.food) {
        setFoods((prev) => prev.map((f) => (f.id === food.id ? res.food : f)));
      }
    } catch (err) {
      alert('Error changing availability: ' + err.message);
    }
  };

  const handleDelete = async (food) => {
    if (!window.confirm(`Are you sure you want to remove "${food.name}" from the menu?`)) return;
    try {
      const res = await api.deleteFood(food.id);
      if (res.success) {
        setFoods((prev) => prev.filter((f) => f.id !== food.id));
      }
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      category: 'Breakfast',
      price: '',
      prepTime: '5-10 mins',
      description: '',
      image: '',
      availability: true
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
      prepTime: food.prepTime || '5-10 mins',
      description: food.description || '',
      image: food.image || '',
      availability: food.availability
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.price) {
      setFormError('Name and Price are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingFood) {
        const res = await api.updateFood(editingFood.id, formData);
        if (res.success && res.food) {
          setFoods((prev) => prev.map((f) => (f.id === editingFood.id ? res.food : f)));
          setModalOpen(false);
        }
      } else {
        const res = await api.createFood(formData);
        if (res.success && res.food) {
          setFoods((prev) => [res.food, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving food item');
    } finally {
      setSaving(false);
    }
  };

  const filteredFoods = foods.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Canteen Menu Management
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu Catalog & Availability Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new canteen items, update pricing, and toggle instant item availability (In-Stock / Sold Out)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Food Item
        </button>
      </div>

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredFoods.length}</strong> items ({foods.filter((f) => f.availability).length}{' '}
          Available)
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Prep Time</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading menu items...
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No items found matching your search.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{food.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{food.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {food.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{food.price}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {food.prepTime || '5 mins'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          food.availability
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {food.availability ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Available
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Sold Out
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter item details to show in the college canteen menu
            </p>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Masala Dosa"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Meals">Meals</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="40"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Est. Prep Time
                  </label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="5-8 mins"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availability ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                  >
                    <option value="true">Available</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL (Unsplash or direct)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of dish ingredients..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
