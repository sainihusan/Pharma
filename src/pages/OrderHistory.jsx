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
  ChevronDown,
  ChevronRight,
  MapPin,
  CreditCard
} from 'lucide-react';

import LoadingButton from '../components/LoadingButton';
import OrderRowSkeleton from '../components/skeletons/OrderRowSkeleton';

export default function OrderHistory() {
  const {
    orders,
    isLoading,
    cancelOrder,
    updateOrderStatus,
    acceptOrder,
    processingOrder
  } = useOrders();

  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayOrders = useMemo(() => {
    let filtered = isAdmin
      ? orders
      : orders.filter((o) => o.userEmail === user?.email);

    if (activeTab !== 'All') {
      filtered = filtered.filter((o) => o.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(searchTerm) ||
          o.userEmail
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt || b.date) -
        new Date(a.createdAt || a.date)
    );
  }, [orders, isAdmin, user, activeTab, searchTerm]);

  const stats = useMemo(() => {
    const baseOrders = isAdmin
      ? orders
      : orders.filter((o) => o.userEmail === user?.email);

    return {
      total: baseOrders.length,
      pending: baseOrders.filter((o) => o.status === 'Pending').length,
      delivered: baseOrders.filter((o) => o.status === 'Delivered').length,
      revenue: baseOrders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }, [orders, isAdmin, user]);

  const isOrderProcessing = (orderId, action) => {
    return (
      processingOrder?.id === orderId &&
      (action
        ? processingOrder?.action === action
        : true)
    );
  };

  const tabs = [
    'All',
    'Pending',
    'Accepted',
    'Delivered',
    'Cancelled'
  ];

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
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                height={100}
                sx={{ borderRadius: 4 }}
              />
            ))}
          </div>

          {[...Array(3)].map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
              {isAdmin ? 'Orders Hub' : 'My Orders'}
            </h1>

            <p className="text-slate-500 font-medium text-base sm:text-lg">
              {isAdmin
                ? 'Monitor all pharmacy transactions'
                : 'Track your health essentials'}
            </p>
          </motion.div>

          <div className="w-full lg:w-auto relative z-40">

            <div className="lg:hidden" ref={mobileMenuRef}>

              <button
                onClick={() =>
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }
                className="w-full bg-white border border-slate-200 px-5 py-3.5 rounded-2xl font-bold text-slate-700 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">
                    {getStatusIcon(activeTab)}
                  </span>

                  <span>{activeTab} Orders</span>
                </div>

                <ChevronDown size={20} />
              </button>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 5,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-2"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === tab
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {getStatusIcon(tab)}
                        {tab}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
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

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {displayOrders.map((order, idx) => (
              <OrderCard
                key={order.id}
                order={order}
                isAdmin={isAdmin}
                isProcessing={(action) =>
                  isOrderProcessing(order.id, action)
                }
                onAccept={() => acceptOrder(order.id)}
                onUpdateStatus={(status) =>
                  updateOrderStatus(order.id, status)
                }
                onCancel={() => cancelOrder(order.id)}
                onCancelPrompt={() =>
                  setCancelModalOrder(order)
                }
                index={idx}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {cancelModalOrder && (
          <CancelModal
            onClose={() =>
              setCancelModalOrder(null)
            }
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

function StatusBadge({ status }) {
  const statusStyles = {
    Pending:
      'bg-amber-50 text-amber-600 border-amber-100',
    Accepted:
      'bg-blue-50 text-blue-600 border-blue-100',
    Delivered:
      'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled:
      'bg-rose-50 text-rose-600 border-rose-100'
  };

  const Icon =
    {
      Pending: Clock,
      Accepted: Package,
      Delivered: CheckCircle,
      Cancelled: XCircle
    }[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        statusStyles[status]
      }`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}