import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import ActivityTimeline from '../../components/shared/ActivityTimeline';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils';
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../lib/utils';

const InventoryDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [res, statsRes] = await Promise.all([
          inventoryApi.getItems(),
          inventoryApi.getDashboardStats()
        ]);
        const items = res.data.data || [];
        const stats = statsRes.data.data || {};

        setData({
          totalItems: stats.totalSkus,
          lowStock: stats.lowStockCount,
          expiringSoon: stats.expiringSoonCount,
          totalValue: Object.values(stats.valueByCategory || {}).reduce((s, v) => s + v, 0),
          valueByCategory: stats.valueByCategory,
          items
        });
      } catch (e) {
        console.error('Failed to fetch inventory analytics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Total Inventory Items',
      value: data.totalItems || 0,
      description: 'Items currently in warehouse',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      trendValue: '+2.4%'
    },
    {
      title: 'Stock Alerts',
      value: data.lowStock || 0,
      description: 'Items below safety levels',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      trend: data.lowStock > 0 ? 'up' : 'stable',
      trendValue: data.lowStock > 0 ? 'Action required' : 'Optimized'
    },
    {
      title: 'Expiring Soon',
      value: data.expiringSoon || 0,
      description: 'Batches expiring in 30 days',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: 'stable',
      trendValue: 'Check list'
    },
    {
      title: 'Inventory Valuation',
      value: formatCurrency(data.totalValue || 0),
      description: 'Net asset value of stock',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'up',
      trendValue: '+8.4%'
    }
  ];

  // Mock data for charts
  const stockTrends = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
  ];

  const categoryData = data.valueByCategory ? Object.entries(data.valueByCategory).map(([name, value], i) => ({
    name,
    value: Number(value),
    color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'][i % 6]
  })) : [];

  const recentActivities = [
    {
      title: 'Bulk Feed Delivery Received',
      description: '1000kg of Chick Starter added to Main Warehouse.',
      type: 'stock_in',
      timestamp: '45 mins ago',
      meta: { supplier: 'AgroFeed Ltd', qty: '1000kg' }
    },
    {
      title: 'Vaccine Batch Expired',
      description: 'Batch #V-204 (50 units) marked as expired and removed.',
      type: 'critical',
      timestamp: '3 hours ago',
      meta: { batch: '#V-204', loss: 'ETB 4,500' }
    },
    {
      title: 'Stock Out: Veterinary Dept',
      description: '20 units of Antibiotic X issued for Farm B.',
      type: 'stock_out',
      timestamp: '5 hours ago',
      meta: { dept: 'Vet', user: 'Dr. Amen' }
    }
  ];

  const criticalOps = [
    {
      title: 'Safety Stock Violation',
      description: 'Layer Mash (LM-02) is below critical 200kg threshold.',
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      cta: 'Reorder Now'
    },
    {
      title: 'Supplier Delay',
      description: 'PO #882 from BioMed Pharma is 2 days overdue.',
      icon: Truck,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      cta: 'Contact Supplier'
    },
    {
      title: 'Storage Optimization',
      description: 'Warehouse B has 15% unused capacity in Cold Chain.',
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      cta: 'Review Space'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 bg-gray-100 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Inventory Command Center"
        subtitle="Intelligent supply chain visibility and warehouse operations."
      >
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200 hover:bg-rose-50 hover:text-rose-600 transition-all rounded-xl" onClick={() => navigate('/inventory/stock-out')}>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Stock Issuance
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 shadow-lg rounded-xl" onClick={() => navigate('/inventory/stock-in')}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Receive Stock
          </Button>
        </div>
      </PageHeader>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Value Trend Area Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Investment Valuation
              </CardTitle>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Asset growth over time</p>
            </div>
            <Select defaultValue="6m">
              <SelectTrigger className="w-[120px] h-9 bg-gray-50 border-none text-xs font-bold rounded-xl focus:ring-0">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Full Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(val) => [formatCurrency(val), 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Alerts / Operations */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-none shadow-2xl rounded-3xl overflow-hidden min-h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Critical Control
              </CardTitle>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Intelligent system alerts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalOps.map((op, i) => (
                <div key={i} className="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", op.bg)}>
                      <op.icon className={cn("h-4 w-4", op.color)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{op.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{op.description}</p>
                      <button className="mt-3 flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all">
                        {op.cta} <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800/50">
                <Button
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-xs font-bold gap-2"
                  onClick={() => navigate('/inventory/expiry')}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Full Expiry Tracking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Mix Pie */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black text-gray-900 tracking-tight">Category Distribution</CardTitle>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Weight by volume</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    stroke="none"
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity outline-none cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 px-2">
              {categoryData.map((item, i) => (
                <div key={i} className="flex flex-col p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-800">{item.value}% Mix</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Stock Activity */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                Live Stock Feed
              </CardTitle>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Real-time warehouse transactions</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-gray-100 hover:bg-gray-50 text-xs font-bold px-4" onClick={() => navigate('/inventory/reports')}>
              Full Ledger
            </Button>
          </CardHeader>
          <CardContent className="mt-2">
            <ActivityTimeline activities={recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
