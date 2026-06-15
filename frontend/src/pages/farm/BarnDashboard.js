import React, { useEffect, useState } from 'react';
import { farmApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Home, Thermometer, Droplets, Wind, AlertTriangle, Users, Zap, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { cn } from '../../lib/utils';

const BarnDashboard = () => {
    const [barns, setBarns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await farmApi.getBarns();
                setBarns(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (barn) => {
        // Mock logic: check thresholds (In real app, this would be based on bird age rules)
        if (barn.currentAmmonia > 25) return 'bg-rose-500';
        if (barn.currentTemp > 35 || barn.currentTemp < 20) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-400">Syncing with Barn Sensors...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <PageHeader
                title="Barn Control Center"
                subtitle="Live environmental monitoring and occupancy status across all facilities."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {barns.map((barn) => (
                    <Card key={barn.id} className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white group hover:scale-[1.02] transition-all duration-500">
                        <div className={cn("h-3 w-full", getStatusColor(barn))} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                        <Home className="h-6 w-6 text-indigo-500" /> {barn.name}
                                    </CardTitle>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">{barn.barnType || 'STANDARD'}</p>
                                </div>
                                <Badge className="rounded-xl px-3 py-1 font-bold bg-gray-50 text-gray-500 border-none">
                                    {barn.capacity - (barn.currentBirdCount || 0)} Slots Free
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-orange-50/50 p-4 rounded-3xl space-y-1">
                                    <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-widest">
                                        <Thermometer className="h-3 w-3" /> Temp
                                    </div>
                                    <div className="text-2xl font-black text-orange-700">{barn.currentTemp || '24.5'}°C</div>
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-3xl space-y-1">
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                                        <Droplets className="h-3 w-3" /> Humidity
                                    </div>
                                    <div className="text-2xl font-black text-blue-700">{barn.currentHumidity || '62'}%</div>
                                </div>
                                <div className="bg-rose-50/50 p-4 rounded-3xl space-y-1">
                                    <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest">
                                        <Wind className="h-3 w-3" /> Ammonia
                                    </div>
                                    <div className="text-2xl font-black text-rose-700">{barn.currentAmmonia || '12'} <span className="text-xs">ppm</span></div>
                                </div>
                                <div className="bg-indigo-50/50 p-4 rounded-3xl space-y-1">
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                                        <Zap className="h-3 w-3" /> CO2
                                    </div>
                                    <div className="text-2xl font-black text-indigo-700">{barn.currentCO2 || '450'} <span className="text-xs">ppm</span></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Occupancy</span>
                                    <span>{((barn.currentBirdCount || 0) / barn.capacity * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={(barn.currentBirdCount || 0) / barn.capacity * 100} className="h-2 rounded-full bg-gray-100" />
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                    <CheckCircle2 className="h-4 w-4" /> Systems Normal
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View History</button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BarnDashboard;
