import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vetApi, farmApi, flockApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, PieChart, Download, FileText, Activity, Layers, ActivitySquare, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#8b5cf6'];

const DrugUsageReport = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [farms, setFarms] = useState([]);
    const [flocks, setFlocks] = useState([]);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        farmId: '',
        flockId: ''
    });

    useEffect(() => {
        farmApi.getAll().then(res => setFarms(res.data.data || []));
        fetchReport();
        // eslint-disable-next-line
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.flockId) params.flockId = filters.flockId;

            const res = await vetApi.getDrugUsageReport(params);
            setReportData(res.data.data);
        } catch (error) {
            toast.error("Failed to load veterinary report data");
        } finally {
            setLoading(false);
        }
    };

    const handleFarmChange = async (farmId) => {
        setFilters(prev => ({ ...prev, farmId, flockId: '' }));
        if (farmId && farmId !== 'all') {
            const res = await flockApi.getAll();
            setFlocks(res.data.data.filter(f => String(f.farmId) === String(farmId)) || []);
        } else {
            setFlocks([]);
        }
    };

    const handleExportPDF = () => {
        window.print();
    };

    if (!reportData) return <div className="p-8 text-center animate-pulse text-indigo-400 font-bold uppercase tracking-widest">Loading Analytics...</div>;

    const chartData = Object.keys(reportData.costByDrug).map(name => ({
        name,
        cost: reportData.costByDrug[name],
        quantity: reportData.quantityByDrug[name]
    })).sort((a, b) => b.cost - a.cost);

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-16 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 group transition-all"
                        onClick={() => navigate('/veterinary')}
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                            Drug Usage Analytics
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 flex items-center gap-1.5">
                                <ActivitySquare className="h-3 w-3" />
                                Live Metrics
                            </div>
                        </h1>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Therapeutic consumption & financial analysis</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-2xl font-bold border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50" onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2rem] bg-white print:hidden">
                <CardContent className="p-6">
                    <div className="flex items-end gap-6 flex-wrap">
                        <div className="space-y-2 flex-col">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date Range Start</Label>
                            <Input type="date" className="h-11 rounded-xl bg-gray-50 font-bold border-none" value={filters.startDate} onChange={e => setFilters(old => ({ ...old, startDate: e.target.value }))} />
                        </div>
                        <div className="space-y-2 flex-col">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date Range End</Label>
                            <Input type="date" className="h-11 rounded-xl bg-gray-50 font-bold border-none" value={filters.endDate} onChange={e => setFilters(old => ({ ...old, endDate: e.target.value }))} />
                        </div>
                        <div className="space-y-2 flex-col">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Farm</Label>
                            <Select value={filters.farmId} onValueChange={handleFarmChange}>
                                <SelectTrigger className="h-11 rounded-xl bg-gray-50 font-bold border-none min-w-[150px]">
                                    <SelectValue placeholder="All Farms" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">All Farms</SelectItem>
                                    {farms.map(f => <SelectItem key={f.id} value={String(f.id)}>{f.farmName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 flex-col">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Batch / Flock</Label>
                            <Select value={filters.flockId} onValueChange={v => setFilters(old => ({ ...old, flockId: v }))} disabled={!filters.farmId || filters.farmId === 'all'}>
                                <SelectTrigger className="h-11 rounded-xl bg-gray-50 font-bold border-none min-w-[150px]">
                                    <SelectValue placeholder={!filters.farmId || filters.farmId === 'all' ? "Select a farm first" : "All Batches"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {flocks.map(f => <SelectItem key={f.id} value={String(f.id)}>{f.batchCode}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="h-11 px-8 rounded-xl bg-slate-900 font-bold tracking-widest uppercase hover:bg-slate-800" onClick={fetchReport} disabled={loading}>
                            {loading ? 'Crunching...' : 'Apply Filters'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl bg-indigo-600 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Activity className="h-20 w-20" /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Total Drug Spend</p>
                    <h3 className="text-3xl font-black">{formatCurrency(reportData.totalCost)}</h3>
                </Card>
                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl bg-rose-50 p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Total Prescriptions</p>
                    <h3 className="text-3xl font-black text-rose-700">{reportData.totalPrescriptions} <span className="text-sm font-bold text-rose-400">Issued</span></h3>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-1">
                <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden p-8">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Cost Breakdown By Agent</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="cost">
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white overflow-hidden p-8">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Volume Consumption (Qty)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="quantity" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DrugUsageReport;
