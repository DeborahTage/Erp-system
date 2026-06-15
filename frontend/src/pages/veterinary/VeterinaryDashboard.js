import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, vetApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import AlertCard from '../../components/shared/AlertCard';
import ActivityTimeline from '../../components/shared/ActivityTimeline';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../context/LanguageContext';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  Plus,
  Syringe,
  ChevronRight,
  ClipboardCheck,
  ShieldAlert,
  Zap,
  Microscope,
  Stethoscope,
  History
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../../lib/utils';

const VeterinaryDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.vet();
        setData(res.data.data || {});
      } catch (e) {
        console.error('Failed to fetch veterinary dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Active Disease Cases',
      value: data.activeDiseaseCases || 0,
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      trend: 'down',
      trendValue: '-5% vs last week',
      description: 'Pending resolution'
    },
    {
      title: 'Upcoming Vacs',
      value: data.upcomingVaccinations || 0,
      icon: Syringe,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      trendValue: '12 tomorrow',
      description: 'Scheduled this week'
    },
    {
      title: 'Open Health Reports',
      value: data.openHealthReports || 0,
      icon: ClipboardCheck,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Requires validation'
    },
    {
      title: 'Active Treatments',
      value: data.activeTreatments || 0,
      icon: HeartPulse,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Medical regimens in dev'
    }
  ];

  // Process data for trends
  const mortalityTrend = data.mortalityTrend || [];

  const COLORS = ['#f43f5e', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];
  const diseaseStats = data.diseaseBreakdown ? data.diseaseBreakdown.map((d, i) => ({
    name: d.name,
    count: d.count,
    color: COLORS[i % COLORS.length]
  })) : [];

  const recentActivities = [
    ...(data.recentDiseaseCases || []).map(dc => ({
      title: 'Disease Case Reported',
      description: `Case ${dc.id}: ${dc.suspectedDisease} detected in Farm ${dc.farmId}`,
      type: 'disease',
      timestamp: String(dc.createdAt || dc.dateDetected),
      meta: { severity: dc.severity }
    })),
    ...(data.recentTreatments || []).map(tr => ({
      title: 'Treatment Recorded',
      description: `Treatment ${tr.id}: ${tr.treatmentType} for Case ${tr.diseaseCaseId}`,
      type: 'vet',
      timestamp: String(tr.createdAt || tr.startDate),
      meta: { status: tr.status }
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5).map(act => ({
    ...act,
    icon: act.type === 'disease' ? ShieldAlert : Stethoscope
  }));

  const alerts = data.alerts ? data.alerts.map(alert => ({
    ...alert,
    icon: alert.type === 'critical' ? AlertTriangle : Clock
  })) : [];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-8">
        <div className="h-10 w-1/3 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-50 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-[400px] bg-gray-50 rounded-3xl" />
          <div className="h-[400px] bg-gray-50 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-700">
      <PageHeader
        title="Clinical Operations Control"
        subtitle="End-to-end veterinary surveillance and medical lifecycle management."
      >
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-2 hover:bg-slate-50 transition-all" onClick={() => navigate('/veterinary/vaccinations/new')}>
            <Syringe className="mr-2 h-4 w-4 text-blue-500" />
            Plan Vaccination
          </Button>
          <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl" onClick={() => navigate('/veterinary/disease-cases/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Report Outbreak
          </Button>
        </div>
      </PageHeader>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Surveillance Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                  <Activity className="h-6 w-6 text-indigo-600" />
                  Mortality Trend
                </CardTitle>
                <CardDescription className="text-xs font-bold text-gray-400 mt-1">Daily mortality count vs time</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600">7D</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">30D</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mortalityTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mortality"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* High Priority Alerts */}
        <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-slate-900">
          <CardHeader className="p-8 border-b border-slate-800">
            <CardTitle className="text-lg font-black text-white tracking-tight flex items-center gap-2 uppercase">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              Critical Alerts
            </CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500">System generated high-priority notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {alerts.map((alert, i) => (
              <div key={i} className={cn(
                "p-5 rounded-3xl border-l-4 transition-all hover:scale-[1.02] cursor-pointer",
                alert.type === 'critical' ? "bg-rose-500/10 border-rose-500" : "bg-amber-500/10 border-amber-500"
              )}>
                <div className="flex gap-4">
                  <div className={cn("p-3 rounded-2xl", alert.type === 'critical' ? "bg-rose-500/20" : "bg-amber-500/20")}>
                    <alert.icon className={cn("h-5 w-5", alert.type === 'critical' ? "text-rose-400" : "text-amber-400")} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white tracking-tight">{alert.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{alert.description}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest leading-none">Security Active</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 leading-none">V.2.4.1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Disease Distribution Analysis */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
            <CardTitle className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
              <Microscope className="h-5 w-5 text-rose-600" />
              Disease Vector Distribution
            </CardTitle>
            <CardDescription className="text-xs font-bold text-gray-400">Aggregated active cases based on diagnosis type</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseStats} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 800 }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 15, 15, 0]} barSize={35}>
                    {diseaseStats.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Surveillance Feed */}
        <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
            <CardTitle className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
              <History className="h-5 w-5 text-indigo-500" />
              Live Audit Feed
            </CardTitle>
            <CardDescription className="text-xs font-bold text-gray-400">Real-time veterinary activity logs</CardDescription>
          </CardHeader>
          <CardContent className="p-8 max-h-[450px] overflow-y-auto">
            <ActivityTimeline activities={recentActivities} />
            <Button variant="ghost" className="w-full mt-6 rounded-2xl text-xs font-black text-indigo-600 hover:bg-indigo-50 uppercase tracking-widest">
              Access Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VeterinaryDashboard;
