import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Package, 
  DollarSign, 
  Layers, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import farmerService from '../../services/farmerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COMMON_SAMPLE_IMAGES = [
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&auto=format&fit=crop&q=80' },
  { label: 'Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80' },
  { label: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80' },
  { label: 'Rice / Grain', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80' }
];

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isForbidden, setIsForbidden] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    pricePerUnit: '',
    unit: 'kg',
    quantity: '0',
    lowStockThreshold: '5',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      setLoading(true);
      setError('');
      setIsForbidden(false);
      try {
        const [product, cats] = await Promise.all([
          farmerService.getProductById(id),
          farmerService.getCategories()
        ]);

        setCategories(cats);
        setFormData({
          title: product.title || '',
          description: product.description || '',
          categoryId: product.categoryId || (cats.length > 0 ? cats[0].id : ''),
          pricePerUnit: String(product.pricePerUnit || ''),
          unit: product.unit || 'kg',
          quantity: String(product.stockQuantity ?? '0'),
          lowStockThreshold: String(product.lowStockThreshold ?? '5'),
          imageUrl: product.imageUrl || '',
          isActive: Boolean(product.isActive)
        });
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        if (err.response?.status === 403) {
          setIsForbidden(true);
          setError('Security Violation (403 Forbidden): You do not own this agricultural product.');
        } else if (err.response?.status === 404) {
          setError('The requested agricultural produce item does not exist.');
        } else {
          setError(err.response?.data?.message || 'Could not load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndCategories();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Product title is required.');
      return;
    }
    const price = parseFloat(formData.pricePerUnit);
    if (isNaN(price) || price <= 0) {
      setError('Price per unit must be greater than 0.');
      return;
    }
    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Available quantity cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await farmerService.updateProduct(id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        categoryId: Number(formData.categoryId),
        pricePerUnit: price,
        unit: formData.unit.trim(),
        quantity: qty,
        lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
        imageUrl: formData.imageUrl.trim() || undefined,
        isActive: formData.isActive
      });

      navigate('/farmer/products');
    } catch (err) {
      console.error('Error updating product:', err);
      if (err.response?.status === 403) {
        setIsForbidden(true);
        setError('403 Forbidden: You do not have permission to modify this product.');
      } else {
        setError(err.response?.data?.message || 'Failed to update produce.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <LoadingSpinner text="Retrieving harvest produce data..." size="lg" />
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied (403)</h2>
          <p className="text-sm text-slate-600">
            You do not have permission to modify this produce item because it belongs to another registered grower.
          </p>
          <div className="pt-4">
            <Link
              to="/farmer/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <div>
          <Link
            to="/farmer/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Produce Catalog
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Edit Produce: {formData.title || 'Harvest Listing'}
                </h1>
                <p className="text-slate-500 text-sm">
                  Update pricing, description, stock inventory, or listing visibility.
                </p>
              </div>
            </div>

            {/* Active Status Badge */}
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {formData.isActive ? 'Active (Public)' : 'Inactive (Hidden)'}
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Produce Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Produce Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Price, Unit & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Price per Unit (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Unit of Measure <span className="text-rose-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="bundle">bundle (Bunch/Bundle)</option>
                  <option value="dozen">dozen (12 items)</option>
                  <option value="litre">litre (Liquid)</option>
                  <option value="pack">pack (Packaged)</option>
                  <option value="gram">gram (250g/500g)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Available Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  min="0"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Image URL & Quick Sample Pickers */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Produce Image URL
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Sample Quick Images */}
              <div className="pt-1">
                <span className="text-xs text-slate-400 block mb-1.5">Or choose a quick sample harvest photo:</span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: img.url }))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-medium rounded-lg transition-colors border border-slate-200/50"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/farmer/products"
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-emerald-700/20 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving Changes...' : 'Update Produce Listing'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
