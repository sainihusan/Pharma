import { useState, useMemo, useRef, useEffect } from 'react';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  XCircle,
  Clock,
  Calendar,
  CheckCircle,
  User as UserIcon,
  Search,
  Filter,
  IndianRupee,
  ShoppingBag,
  ArrowRight,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  MapPin,
  CreditCard
} from 'lucide-react';
import LoadingButton from '../components/LoadingButton';
import OrderRowSkeleton from '../components/skeletons/OrderRowSkeleton';

export default function OrderHistory() {
  const { orders, isLoading, cancelOrder, updateOrderStatus, acceptOrder, processingOrder } = useOrders();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayOrders = useMemo(() => {
    let filtered = isAdmin
      ? orders
      : orders.filter((o) => o.userEmail === user?.email);

    if (activeTab !== 'All') {
      filtered = filtered.filter(o => o.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.id.toString().includes(searchTerm) ||
        o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
  }, [orders, isAdmin, user, activeTab, searchTerm]);

  const stats = useMemo(() => {
    const baseOrders = isAdmin ? orders : orders.filter(o => o.userEmail === user?.email);
    return {
      total: baseOrders.length,
      pending: baseOrders.filter(o => o.status === 'Pending').length,
      delivered: baseOrders.filter(o => o.status === 'Delivered').length,
      revenue: baseOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }, [orders, isAdmin, user]);

  const isOrderProcessing = (orderId, action) => {
    return processingOrder?.id === orderId && (action ? processingOrder?.action === action : true);
  };

  const tabs = ['All', 'Pending', 'Accepted', 'Delivered', 'Cancelled'];

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <Clock size={16} />,
      Accepted: <Package size={16} />,
      Delivered: <CheckCircle size={16} />,
      Cancelled: <XCircle size={16} />,
      All: <Filter size={16} />
    };
    return icons[status] || <Filter size={16} />;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton width="40%" height={60} sx={{ mb: 4 }} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={100} sx={{ borderRadius: 4 }} />)}
          </div>
          {[...Array(3)].map((_, i) => <OrderRowSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Responsive Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
              {isAdmin ? 'Orders Hub' : 'My Orders'}
            </h1>
            <p className="text-slate-500 font-medium text-base sm:text-lg">
              {isAdmin ? 'Monitor all pharmacy transactions' : 'Track your health essentials'}
            </p>
          </motion.div>

          {/* Desktop Tabs / Custom Mobile Dropdown */}
          <div className="w-full lg:w-auto relative z-40">
            {/* Custom Mobile Dropdown */}
            <div className="lg:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full bg-white border border-slate-200 px-5 py-3.5 rounded-2xl font-bold text-slate-700 flex items-center justify-between shadow-sm focus:ring-4 focus:ring-blue-50 transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">{getStatusIcon(activeTab)}</span>
                  <span>{activeTab} Orders</span>
                </div>
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ChevronDown size={20} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-2 overflow-hidden"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <span className={activeTab === tab ? 'text-white' : 'text-slate-400'}>
                          {getStatusIcon(tab)}
                        </span>
                        {tab}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 gap-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Improved Stats Grid - Compact on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
          <StatCard title="Total" value={stats.total} icon={<ShoppingBag size={18} />} color="blue" />
          <StatCard title="Pending" value={stats.pending} icon={<Clock size={18} />} color="amber" />
          <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle size={18} />} color="emerald" />
          <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee size={18} />} color="indigo" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 sm:mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={isAdmin ? "Search ID, Email..." : "Search Order ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 sm:py-4 bg-white rounded-[24px] sm:rounded-3xl text-slate-900 font-medium border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all placeholder:text-slate-400 text-sm sm:text-base"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {displayOrders.length > 0 ? (
              displayOrders.map((order, idx) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isAdmin={isAdmin}
                  isProcessing={(action) => isOrderProcessing(order.id, action)}
                  onAccept={() => acceptOrder(order.id)}
                  onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                  onCancel={() => cancelOrder(order.id)}
                  onCancelPrompt={() => setCancelModalOrder(order)}
                  index={idx}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[32px] sm:rounded-[40px] p-12 sm:p-16 text-center border border-slate-100 shadow-sm"
              >
                <div className="bg-slate-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm sm:text-base">
                  We couldn't find any orders matching your filters.
                </p>
                <button
                  onClick={() => { setActiveTab('All'); setSearchTerm(''); }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm sm:text-base"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {cancelModalOrder && (
          <CancelModal
            onClose={() => setCancelModalOrder(null)}
            onConfirm={() => {
              cancelOrder(cancelModalOrder.id);
              setCancelModalOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderCard({ order, isAdmin, isProcessing, onAccept, onUpdateStatus, onCancel, onCancelPrompt, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCancelClick = () => {
    const isCOD = !order.paymentMethod || order.paymentMethod.toUpperCase() === 'COD';
    if (order.status === 'Accepted' && !isCOD) {
      if (onCancelPrompt) {
        onCancelPrompt();
        return;
      }
    }
    onCancel();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all"
    >
      {/* Responsive Header */}
      <div className="p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
            <Package size={20} className="sm:hidden" strokeWidth={2.5} />
            <Package size={28} className="hidden sm:block" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order ID</span>
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-none">#{order.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1"><Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> {new Date(order.createdAt || order.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-blue-600 font-bold"><IndianRupee size={12} className="sm:w-3.5 sm:h-3.5" /> {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-slate-50">
          <StatusBadge status={order.status} />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <span className="sm:hidden">{isExpanded ? 'Hide' : 'Details'}</span>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-7 pb-6 sm:pb-7 space-y-6 sm:space-y-8">
              {/* Items Grid */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Order Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-100 group">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg sm:text-xl font-black text-slate-200">{item.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <h5 className="font-bold text-slate-900 text-sm sm:text-base truncate pr-2">{item.name}</h5>
                          <span className="font-black text-slate-900 text-sm">₹{item.price}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info Bar - Optimized for Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
                <div className="hidden lg:block absolute top-0 right-0 p-8 opacity-10">
                  <ShoppingBag size={120} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 text-slate-400">
                    <UserIcon size={14} />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Customer</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm truncate">{order.userEmail}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 text-slate-400">
                    <CreditCard size={14} />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Payment</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm uppercase">{order.paymentMethod || 'COD'}</p>
                </div>

                <div className="pt-4 sm:pt-0 border-t border-slate-800 lg:border-none">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 text-slate-400">
                    <MapPin size={14} />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Summary</span>
                  </div>
                  <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                    <p className="text-2xl sm:text-3xl font-black">₹{order.total}</p>
                    <span className="text-emerald-400 text-[10px] font-black uppercase">Delivered Free</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {isAdmin && order.status === 'Pending' && (
                  <>
                    <LoadingButton
                      onClick={onAccept}
                      loading={isProcessing('accept')}
                      className="!w-full sm:!w-auto !px-8 !py-3 !bg-blue-600 !text-white !rounded-2xl !font-bold !shadow-xl !shadow-blue-200 hover:!bg-blue-700 !transition-all"
                    >
                      Accept Order
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => onUpdateStatus('Delivered')}
                      loading={isProcessing('delivered')}
                      className="!w-full sm:!w-auto !px-8 !py-3 !bg-emerald-600 !text-white !rounded-2xl !font-bold !shadow-xl !shadow-emerald-200 hover:!bg-emerald-700 !transition-all"
                    >
                      Mark Delivered
                    </LoadingButton>
                  </>
                )}
                {isAdmin && order.status === 'Accepted' && (
                  <LoadingButton
                    onClick={() => onUpdateStatus('Delivered')}
                    loading={isProcessing('delivered')}
                    className="!w-full sm:!w-auto !px-8 !py-3 !bg-emerald-600 !text-white !rounded-2xl !font-bold !shadow-xl !shadow-emerald-200 hover:!bg-emerald-700 !transition-all"
                  >
                    Mark Delivered
                  </LoadingButton>
                )}
                {(order.status === 'Pending' || order.status === 'Accepted') && (
                  <LoadingButton
                    onClick={handleCancelClick}
                    loading={isProcessing('cancel')}
                    className="!w-full sm:!w-auto !px-8 !py-3 !bg-white !text-rose-600 !border-2 !border-rose-100 !rounded-2xl !font-bold hover:!bg-rose-50 !transition-all"
                  >
                    Cancel Order
                  </LoadingButton>
                )}
                {order.status === 'Delivered' && (
                  <div className="w-full sm:w-auto px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-100">
                    <CheckCircle size={18} /> Delivered
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };

  return (
    <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 sm:gap-4">
      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h4 className="text-sm sm:text-xl font-black text-slate-900 leading-none truncate">{value}</h4>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
    Accepted: 'bg-blue-50 text-blue-600 border-blue-100',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const Icon = {
    Pending: Clock,
    Accepted: Package,
    Delivered: CheckCircle,
    Cancelled: XCircle,
  }[status] || Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${statusStyles[status] || statusStyles.Pending}`}>
      <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
      {status}
    </span>
  );
}

function CancelModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500">
           <XCircle size={32} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Cancel Order?</h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Since this order is already accepted and paid for, canceling now will result in a <strong className="text-slate-800">50% refund</strong>. Are you absolutely sure you want to proceed?
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-colors"
          >
            Keep Order
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

