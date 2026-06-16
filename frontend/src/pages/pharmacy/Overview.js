import React, { useEffect, useState } from 'react';
import { pharmacyApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import {
    ShoppingBag, Pill, ClipboardList, Wallet, BarChart3, Activity
} from 'lucide-react';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { cn } from '../../lib/utils';
import PrescriptionQueue from './PrescriptionQueue';

const PharmacyOverview = () => {
    const [data, setData] = useState({
        revenue_today: 0,
        sales_count_today: 0,
        pending_prescriptions: 0,
        revenue_trend: [],
        pending_rx_list: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        setRefreshing(true);
        try {
            const [dashRes, rxRes] = await Promise.all([
                pharmacyApi.getDashboard(),
                pharmacyApi.getPrescriptions()
            ]);
            setData({
                ...dashRes.data,
                pending_rx_list: rxRes.data.data || []
            });
        } catch (e) {
            console.error('Failed to fetch pharmacy analytics', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const kpis = [
        {
            title: "Today's Revenue",
            value: formatCurrency(data.revenue_today || 0),
            description: `${data.sales_count_today || 0} commercial sales`,
            icon: Wallet,
            iconColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        {
            title: "Pending Prescriptions",
            value: data.pending_rx_list.length || 0,
            description: "Awaiting farm issuance",
            icon: Pill,
            iconColor: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        },
        {
            title: "Internal Requisitions",
            value: "3",
            description: "Awaiting warehouse fulfillment",
            icon: ClipboardList,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50'
        },
        {
            title: "Available Drug SKUs",
            value: "84",
            description: "Active medication inventory",
            icon: ShoppingBag,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        }
    ];

    if (loading) {
        return <div className="p-8 flex justify-center"><Activity className="animate-spin text-indigo-600 h-8 w-8" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Pharmacy Command Center"
                    subtitle="Integrated sales, medical fulfillment, and revenue oversight"
                />
                <button
                    onClick={fetchDashboard}
                    disabled={refreshing}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Activity className={cn("h-5 w-5 text-gray-400", refreshing && "animate-spin")} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <StatsCard key={i} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-sm border-none bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2 font-bold text-gray-800">
                                <ClipboardList className="h-5 w-5 text-indigo-500" /> Medical Fulfillment Queue
                            </CardTitle>
                            <CardDescription>Prescriptions submitted by Veterinary staff</CardDescription>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Live Traffic</Badge>
                    </CardHeader>
                    <CardContent>
                        <PrescriptionQueue prescriptions={data.pending_rx_list} loading={refreshing} />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-emerald-500" /> Revenue Health
                        </CardTitle>
                        <CardDescription>Today vs Target (Experimental)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Commercial', value: 75 },
                                                { name: 'Internal Issues', value: 25 }
                                            ]}
                                            innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#6366f1" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Sale Type Distribution</p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-500">Commercial Target</span>
                                    <span className="text-xs font-black text-emerald-600">85% Achieved</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[85%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PharmacyOverview;
