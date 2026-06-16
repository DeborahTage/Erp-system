import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils';
import {
  Package, AlertTriangle, Clock, Activity, BarChart3, TrendingUp, DollarSign,
  ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Layers, History,
  ShoppingCart, ShieldAlert, PlusCircle, MinusCircle, FileText, RefreshCw,
  Box, ShieldCheck, Settings, Pill
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

const InventoryDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState({
    total_skus: 0,
    total_value: 0,
    today_stock_in: 0,
    today_stock_out: 0,
    low_stock_count: 0,
    expiring_count: 0,
    recent_stock_in: [],
    low_stock: [],
    expiring: [],
    movement_trend: { in: [], out: [] },
    activity_timeline: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await inventoryApi.getDashboardStats();
        setData(res.data || {});
      } catch (e) {
        console.error('Failed to fetch inventory dashboard', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Total Inventory Items',
      value: data.total_skus,
      description: 'Active stock units',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Low Stock Alerts',
      value: data.low_stock_count,
      description: 'Items needing reorder',
      icon: ShieldAlert,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Expiring Soon',
      value: data.expiring_count,
      description: 'In next 30 days',
      icon: Clock,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Stock Valuation',
      value: formatCurrency(data.total_value),
      description: 'Total asset value',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: "Today's Stock In",
      value: data.today_stock_in,
      description: 'Goods received',
      icon: ArrowDownToLine,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  // Specific category cards (Requirement 1.4)
  const categoryMapping = {
    'FEED': { title: 'Feed Stock', icon: Box, color: 'text-amber-600', bg: 'bg-amber-50' },
    'DRUG': { title: 'Drug Stock', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50' },
    'VACCINE': { title: 'Vaccine Stock', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    'EQUIPMENT': { title: 'Equipment', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50' }
  };

  const categoricalKpis = (data.category_stats || []).filter(c => categoryMapping[c.category]).map(c => ({
    title: categoryMapping[c.category].title,
    value: c.count || 0,
    description: `Val: ${formatCurrency(c.value || 0)}`,
    icon: categoryMapping[c.category].icon,
    iconColor: categoryMapping[c.category].color,
    bgColor: categoryMapping[c.category].bg
  }));

  // Process movement trend data for chart
  const trendData = data.movement_trend?.in?.map((item, idx) => {
    return {
      date: item[0],
      in: item[1] || 0,
      out: data.movement_trend.out?.[idx]?.[1] || 0
    };
  }) || [];

  if (loading) {
    return <div className="p-8 text-center"><Activity className="animate-spin h-8 w-8 text-blue-600 mx-auto" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-2">
        <PageHeader
          title="Warehouse Control Center"
          subtitle="Real-time operational oversight and inventory intelligence"
        />
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-white">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <BarChart3 className="mr-2 h-4 w-4" /> Reports
          </Button>
        </div>
      </div>

      {/* Main KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Category Specific Stock (Requirement 1.4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoricalKpis.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Operational Area */}
        <div className="xl:col-span-9 space-y-6">

          {/* Recent Stock In Table */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white py-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-500" /> Recent Stock In (GRN)
                  </CardTitle>
                  <CardDescription>Latest material receipts and batch deployments</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/inventory/stock-in')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[120px]">Timestamp</TableHead>
                    <TableHead>Item Definition</TableHead>
                    <TableHead>Batch Ref</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Warehouse Area</TableHead>
                    <TableHead>Supplier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {data.recent_stock_in?.map((m, i) => (
                    <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="text-xs text-slate-500">
                        {new Date(m.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{m.item}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] uppercase bg-slate-50">
                          {m.batch}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-indigo-600">
                        +{m.quantity}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 font-medium">
                        {m.warehouse}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-500">
                        {m.supplier}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data.recent_stock_in || data.recent_stock_in.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                        No recent shipments detected.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" /> Movement Intelligence
                </CardTitle>
                <CardDescription>Stock In vs Stock Out (Last 7 Days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="in" stroke="#4f46e5" strokeWidth={2} fill="url(#colorIn)" />
                      <Area type="monotone" dataKey="out" stroke="#f43f5e" strokeWidth={2} fill="url(#colorOut)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Stock Distribution</CardTitle>
                <CardDescription>Value by category</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.category_stats || []}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(data.category_stats || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatCurrency(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  {(data.category_stats || []).slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'][i % 4] }} />
                      <span className="text-[10px] font-bold text-slate-600 truncate">{c.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-sm dark:bg-slate-900 overflow-hidden">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Command Center</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pb-6">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:border-indigo-500 hover:bg-indigo-50 border-slate-200 shadow-none bg-white"
                onClick={() => navigate('/inventory/stock-in')}
              >
                <PlusCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-[11px] font-bold">STOCK IN</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:border-rose-500 hover:bg-rose-50 border-slate-200 shadow-none bg-white"
                onClick={() => navigate('/inventory/stock-out')}
              >
                <MinusCircle className="h-5 w-5 text-rose-600" />
                <span className="text-[11px] font-bold">STOCK OUT</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 border-slate-200 shadow-none bg-white"
                onClick={() => navigate('/inventory/items')}
              >
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span className="text-[11px] font-bold">REORDER</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:border-amber-500 hover:bg-amber-50 border-slate-200 shadow-none bg-white"
                onClick={() => navigate('/inventory/requisitions')}
              >
                <FileText className="h-5 w-5 text-amber-600" />
                <span className="text-[11px] font-bold">CYCLE COUNT</span>
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-none shadow-sm bg-white h-fit">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" /> Activity Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ScrollArea className="h-[450px] pr-4">
                <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pt-2">
                  {data.activity_timeline?.map((event, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white shadow-sm ${event.action === 'RECEIPT' ? 'bg-emerald-500' :
                        event.action === 'SALE' ? 'bg-indigo-500' : 'bg-slate-400'
                        }`} />
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-slate-800 leading-none">
                            {event.action} - {event.item}
                          </p>
                          <span className="text-[9px] font-medium text-slate-400">
                            {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {event.qty > 0 ? '+' : ''}{event.qty} units processed by <span className="font-semibold">{event.user}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!data.activity_timeline || data.activity_timeline.length === 0) && (
                    <div className="text-center py-10 text-slate-300 text-xs italic">No activity recorded today.</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
