import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Activity, Egg, AlertTriangle, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';

const EggAnalytics = ({ flockId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching for now
        setData({
            hdpTrend: [
                { day: 'D105', hdp: 82 },
                { day: 'D110', hdp: 85 },
                { day: 'D115', hdp: 88 },
                { day: 'D120', hdp: 91 },
                { day: 'D125', hdp: 89 },
            ],
            grades: [
                { name: 'Grade A', value: 75, color: '#10b981' },
                { name: 'Grade B', value: 15, color: '#3b82f6' },
                { name: 'Grade C', value: 7, color: '#f59e0b' },
                { name: 'Broken', value: 3, color: '#f43f5e' },
            ]
        });
        setLoading(false);
    }, [flockId]);

    if (loading) return <div className="p-8 text-center text-gray-400 font-bold">crunching egg data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Hen-Day (HDP%)"
                    value="89.2%"
                    icon={Activity}
                    iconColor="text-emerald-600"
                    bgColor="bg-emerald-50"
                    trend="up"
                    trendValue="+2.1%"
                />
                <StatsCard
                    title="Daily Production"
                    value="4,460"
                    icon={Egg}
                    iconColor="text-orange-600"
                    bgColor="bg-orange-50"
                />
                <StatsCard
                    title="Broken Rate"
                    value="1.2%"
                    icon={AlertTriangle}
                    iconColor="text-rose-600"
                    bgColor="bg-rose-50"
                    trend="down"
                    trendValue="0.2%"
                />
                <StatsCard
                    title="Feed Efficiency"
                    value="122g/egg"
                    icon={TrendingUp}
                    iconColor="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Production Curve (HDP%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.hdpTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis domain={[70, 100]} hide />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="hdp" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <PieIcon className="h-5 w-5 text-indigo-500" />
                            Grade Mix
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={data.grades} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {data.grades.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {data.grades.map((g, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                                    {g.name}: {g.value}%
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EggAnalytics;
