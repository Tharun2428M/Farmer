import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldCheck, 
  Mail 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import farmerService from '../../services/farmerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function FarmerProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    farmName: '',
    farmAddress: '',
    farmDescription: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await farmerService.getProfile();
        setProfile(data);
        setFormData({
          farmName: data.farmName || '',
          farmAddress: data.farmAddress || '',
          farmDescription: data.farmDescription || '',
          phone: data.phone || user?.phone || ''
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err.response?.data?.message || 'Could not load your farm profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.farmName.trim()) {
      setError('Farm name is required.');
      return;
    }
    if (!formData.farmAddress.trim()) {
      setError('Farm address is required.');
      return;
    }

    setSaving(true);
    try {
      const updated = await farmerService.updateProfile({
        farmName: formData.farmName.trim(),
        farmAddress: formData.farmAddress.trim(),
        farmDescription: formData.farmDescription.trim() || undefined,
        phone: formData.phone.trim() || undefined
      });
      setProfile(updated);
      setSuccessMsg('Farm profile details updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update farm profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <LoadingSpinner text="Loading farm profile details..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <div>
          <Link
            to="/farmer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-md flex-shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {profile?.farmName || 'Your Farm Outlet'}
                </h1>
                <p className="text-slate-500 text-sm flex items-center gap-2 mt-0.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Grower: <strong className="text-slate-800">{profile?.farmerName || user?.name}</strong>
                </p>
              </div>
            </div>

            {/* Rating / Verification Badge */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{profile?.rating ? Number(profile.rating).toFixed(1) : '5.0'} Grower Rating</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Farmer</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Farm Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Farm / Outlet Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91-9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Farm Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Farm Address / Village / District <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  name="farmAddress"
                  rows={2}
                  value={formData.farmAddress}
                  onChange={handleChange}
                  required
                  placeholder="Plot number, village name, taluka, district, state, pin code..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Farm Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                About Your Farm & Organic Methods
              </label>
              <textarea
                name="farmDescription"
                rows={3}
                value={formData.farmDescription}
                onChange={handleChange}
                placeholder="Tell consumers about your pesticide-free methods, organic compost, fresh morning harvest cycles, or family farming heritage..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Registered Account Information Readonly Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Account Credentials (JWT)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email: <strong className="text-slate-800">{profile?.email || user?.email}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Role: <strong className="text-emerald-700">{user?.role || 'FARMER'}</strong></span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-emerald-700/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
