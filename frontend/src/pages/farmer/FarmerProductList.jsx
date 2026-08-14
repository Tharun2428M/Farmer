import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Layers, 
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Eye,
  Boxes
} from 'lucide-react';
import farmerService from '../../services/farmerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function FarmerProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockQty, setNewStockQty] = useState('');
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodsData, catsData] = await Promise.all([
        farmerService.getProducts(),
        farmerService.getCategories()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.message || 'Could not load your products catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products locally for instant response
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'ALL' || String(product.categoryId) === String(selectedCategory);

    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') matchesStatus = product.isActive;
    if (statusFilter === 'INACTIVE') matchesStatus = !product.isActive;
    if (statusFilter === 'LOW_STOCK') matchesStatus = product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold || 5);
    if (statusFilter === 'OUT_OF_STOCK') matchesStatus = product.stockQuantity === 0;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Handle Delete / Deactivate
  const handleDeleteConfirm = async () => {
    if (!deleteModalProduct) return;
    setIsDeleting(true);
    setError('');
    try {
      await farmerService.deleteProduct(deleteModalProduct.id);
      setSuccessMsg(`"${deleteModalProduct.title}" was deactivated successfully.`);
      setDeleteModalProduct(null);
      // Reload products
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Quick Stock Update
  const handleStockUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    const qty = parseInt(newStockQty, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Please enter a valid non-negative number for stock.');
      return;
    }

    setIsUpdatingStock(true);
    setError('');
    try {
      await farmerService.updateInventory(stockModalProduct.id, { quantity: qty });
      setSuccessMsg(`Stock for "${stockModalProduct.title}" updated to ${qty} ${stockModalProduct.unit}.`);
      setStockModalProduct(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock.');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              Farmer Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Produce & Inventory
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your harvest listings, adjust daily stock availability, and update pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
              title="Refresh Listings"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              to="/farmer/products/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Produce
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search produce name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Category Filter */}
            <div className="w-full sm:w-auto flex-1 min-w-[160px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-auto flex-1 min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="ACTIVE">Active Listings</option>
                <option value="INACTIVE">Inactive Listings</option>
                <option value="LOW_STOCK">Low Stock Alert</option>
                <option value="OUT_OF_STOCK">Out of Stock (0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Produce Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <LoadingSpinner text="Loading farm inventory..." size="lg" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching produce found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                {products.length === 0 
                  ? "You haven't listed any farm crops yet. Click below to add your first harvest." 
                  : "Try adjusting your search query or status filter to see more items."}
              </p>
              {products.length === 0 && (
                <Link
                  to="/farmer/products/add"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add New Harvest Produce
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Stock Level</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = (p.stockQuantity || 0) === 0;
                    const isLowStock = !isOutOfStock && (p.stockQuantity || 0) <= (p.lowStockThreshold || 5);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=60'}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{p.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">{p.description || 'Farm-direct harvest'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800">
                            {p.categoryName || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900">
                          ₹{p.pricePerUnit} <span className="text-xs font-normal text-slate-400">/ {p.unit}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setStockModalProduct(p);
                                setNewStockQty(String(p.stockQuantity));
                              }}
                              className={`font-bold hover:underline cursor-pointer ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'}`}
                              title="Click to adjust stock"
                            >
                              {p.stockQuantity} {p.unit}
                            </button>
                            {isOutOfStock ? (
                              <Badge variant="error" text="Out of Stock" />
                            ) : isLowStock ? (
                              <Badge variant="warning" text="Low Stock" />
                            ) : (
                              <Badge variant="success" text="In Stock" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setStockModalProduct(p);
                                setNewStockQty(String(p.stockQuantity));
                              }}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Quick Stock Adjust"
                            >
                              <Boxes className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/farmer/products/edit/${p.id}`}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit Produce"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteModalProduct(p)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Deactivate / Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Delete / Deactivate Confirmation Modal */}
      {deleteModalProduct && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteModalProduct(null)}
          title="Deactivate Agricultural Produce"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to deactivate <strong className="text-slate-900">"{deleteModalProduct.title}"</strong>?
            </p>
            <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-xl">
              Deactivating this produce will safely hide it from public customers while preserving past order records. You can reactivate it anytime from the edit screen.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
              >
                {isDeleting ? 'Deactivating...' : 'Confirm Deactivate'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Stock Update Modal */}
      {stockModalProduct && (
        <Modal
          isOpen={true}
          onClose={() => setStockModalProduct(null)}
          title={`Adjust Inventory: ${stockModalProduct.title}`}
        >
          <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Available Stock Quantity ({stockModalProduct.unit})
              </label>
              <input
                type="number"
                min="0"
                value={newStockQty}
                onChange={(e) => setNewStockQty(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Current in stock: {stockModalProduct.stockQuantity} {stockModalProduct.unit}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                disabled={isUpdatingStock}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingStock}
                className="px-4 py-2 text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm"
              >
                {isUpdatingStock ? 'Updating Stock...' : 'Save Stock'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
