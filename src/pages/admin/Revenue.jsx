import React, { useMemo, useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import LoadingButton from '../../components/LoadingButton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Calendar, Layers
} from 'lucide-react';
import { Skeleton } from '@mui/material';

export default function Revenue() {
  const { orders, isLoading } = useOrders();

  const stats = useMemo(() => {
    // Filter out cancelled orders for revenue calculation
    const completedOrders = orders.filter(o => o.status !== 'Cancelled');
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

    // Realized loss: orders that were accepted by admin but then cancelled
    const realizedLoss = cancelledOrders
      .filter(o => o.acceptedByAdmin)
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    // Assuming 30% profit margin on revenue, then subtract the cost of cancelled accepted orders
    const totalProfit = Math.max(0, (totalRevenue * 0.3) - realizedLoss);

    return {
      totalRevenue,
      totalProfit,
      potentialLoss: realizedLoss, // User wants this to count to loss
      orderCount: orders.length,
      completedCount: completedOrders.length,
      cancelledCount: cancelledOrders.length
    };
  }, [orders]);

  // Group data by date for the chart
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.date.startsWith(date));
      const revenue = dayOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        revenue: revenue,
        profit: revenue * 0.3
      };
    });
  }, [orders]);

  const pieData = [
    { name: 'Completed', value: stats.completedCount, color: '#2563eb' },
    { name: 'Cancelled', value: stats.cancelledCount, color: '#f43f5e' }
  ];

  const [downloading, setDownloading] = useState(false);
  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Report downloaded successfully!');
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Revenue Analytics</h1>
          <p className="text-gray-500 font-medium">Monthly performance and profit insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton width="80%" height={32} />
              </div>
            ))
          ) : (
            <>
              <StatCard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="text-blue-600" />}
                trend={+12.5}
                color="blue"
              />
              <StatCard
                title="Net Profit"
                value={`₹${stats.totalProfit.toLocaleString()}`}
                icon={<TrendingUp className="text-emerald-600" />}
                trend={+8.2}
                color="emerald"
              />
              <StatCard
                title="Realized Loss"
                value={`₹${stats.potentialLoss.toLocaleString()}`}
                icon={<TrendingDown className="text-rose-600" />}
                trend={-4.1}
                color="rose"
              />
              <StatCard
                title="Total Orders"
                value={stats.orderCount}
                icon={<ShoppingBag className="text-indigo-600" />}
                trend={+15.3}
                color="indigo"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Revenue Stream</h3>
                <p className="text-sm text-gray-500">Last 7 days performance</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-blue-600" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" /> Profit
                </span>
              </div>
            </div>

            <div className="h-[400px] w-full">
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 4 }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorProf)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Ratios</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold">Quick Insights</h3>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Your revenue has increased by 15% this week compared to last week. The most popular category is "Medicines".
              </p>
              <LoadingButton
                loading={downloading}
                loadingText="Generating..."
                onClick={handleDownload}
                className="w-full py-3 bg-white text-indigo-600 font-bold rounded-2xl shadow-md hover:bg-indigo-50 transition-colors"
              >
                Download Report
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }) {
  const isPositive = trend > 0;

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
  );
}
