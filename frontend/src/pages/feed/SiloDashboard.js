import React, { useEffect, useState } from 'react';
import { feedApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Database, AlertTriangle, Truck, PlusCircle, Info } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { cn } from '../../lib/utils';

const SiloDashboard = () => {
    const [silos, setSilos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSilos = async () => {
            try {
                const res = await feedApi.getSilos();
                setSilos(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSilos();
    }, []);

    const getLevelColor = (level, capacity) => {
        const percent = (level / capacity) * 100;
        if (percent < 20) return 'text-rose-600 bg-rose-50';
        if (percent < 40) return 'text-amber-600 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
    };

    if (loading) return <div className="p-8 text-center text-gray-400 font-bold">Scanning Silos...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <PageHeader
                title="Silo Monitoring"
                subtitle="Real-time tracking of feed inventory levels across all farm storage units."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {silos.map((silo) => (
                    <Card key={silo.id} className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white group hover:scale-[1.02] transition-all duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 rounded-2xl">
                                        <Database className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black text-gray-900 tracking-tight">{silo.name}</CardTitle>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{silo.barn?.name || 'GENERIC STORAGE'}</p>
                                    </div>
                                </div>
                                <Badge className={cn("rounded-xl px-3 py-1 font-bold border-none", getLevelColor(silo.currentLevel, silo.capacity))}>
                                    {((silo.currentLevel / silo.capacity) * 100).toFixed(0)}% FULL
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative h-48 w-full bg-gray-50 rounded-3xl overflow-hidden flex flex-col justify-end">
                                <div
                                    className={cn("w-full transition-all duration-1000 ease-out flex items-center justify-center text-white font-black text-xs",
                                        ((silo.currentLevel / silo.capacity) * 100) < 20 ? 'bg-rose-500' : 'bg-indigo-500'
                                    )}
                                    style={{ height: `${(silo.currentLevel / silo.capacity) * 100}%` }}
                                >
                                    {((silo.currentLevel / silo.capacity) * 100).toFixed(0)}%
                                </div>
                                {((silo.currentLevel / silo.capacity) * 100) < 20 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <AlertTriangle className="h-12 w-12 text-rose-500/20 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Level</p>
                                    <p className="text-lg font-black text-gray-900">{silo.currentLevel.toLocaleString()} <span className="text-xs text-gray-400">KG</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capacity</p>
                                    <p className="text-lg font-black text-gray-900">{silo.capacity.toLocaleString()} <span className="text-xs text-gray-400">KG</span></p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                                <Info className="h-4 w-4 text-gray-400" />
                                <div className="text-xs font-bold text-gray-500">
                                    Active Recipe: <span className="text-indigo-600 truncate">{silo.currentRecipe?.name || 'None'}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-white border border-gray-100 hover:bg-gray-50 text-gray-600 font-bold py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                                    <Truck className="h-4 w-4" /> Log Delivery
                                </button>
                                <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors">
                                    <PlusCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SiloDashboard;
