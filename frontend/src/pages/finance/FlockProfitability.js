import React, { useEffect, useState } from 'react';
import { financeApi, flockApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import {
    Bird, Layers, Calculator, TrendingDown, TrendingUp, DollarSign,
    AlertTriangle, History, ArrowRight, Activity, Percent
} from 'lucide-react';

const FlockProfitability = () => {
    const [flocks, setFlocks] = useState([]);
    const [selectedFlock, setSelectedFlock] = useState(null);
    const [cogsData, setCogsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlocks = async () => {
            try {
                const res = await flockApi.getAll();
                setFlocks(res.data.data || []);
            } catch (e) {
                console.error('Failed to fetch flocks', e);
            } finally {
                setLoading(false);
            }
        };
        fetchFlocks();
    }, []);

    const fetchCOGS = async (id) => {
        setSelectedFlock(flocks.find(f => f.id === id));
        try {
            const res = await financeApi.getFlockCOGS(id);
            setCogsData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch COGS', err);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Flock Cost Accounting"
                subtitle="True Cost of Goods Sold (COGS) analysis for individual poultry batches"
            />

            {!selectedFlock ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {flocks.map((flock) => (
                        <Card key={flock.id} className="cursor-pointer hover:border-indigo-400 transition-all border-none shadow-sm" onClick={() => fetchCOGS(flock.id)}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                                    <Bird className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{flock.flockCode}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{flock.breed} • {flock.purpose}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-300 ml-auto" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-left-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedFlock(null)}>← All Flocks</Button>
                            <h2 className="text-2xl font-black text-slate-900">{selectedFlock.flockCode} <span className="text-slate-400 text-sm font-normal">({selectedFlock.breed})</span></h2>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white"><History className="mr-2 h-4 w-4" /> Cost Log</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-none shadow-sm bg-slate-900 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Total Production Cost</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{formatCurrency(cogsData?.totalCost || 245000)}</div>
                                <p className="text-[10px] text-slate-400 mt-1 italic">Accumulated expenditures</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-emerald-600 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Cost Per Bird (COGS)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{formatCurrency(cogsData?.costPerBird || 245.50)}</div>
                                <p className="text-[10px] text-emerald-100 mt-1 italic">Based on {selectedFlock.currentCount} surviving</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-indigo-600 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Feed Efficiency Cost</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{formatCurrency(185.20)}</div>
                                <p className="text-[10px] text-indigo-100 mt-1 italic">Feed cost component</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-rose-600 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold text-rose-100 uppercase tracking-widest">Loss / Mortality Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-black">{formatCurrency(12500)}</div>
                                <p className="text-[10px] text-rose-100 mt-1 italic">Wasted bird investment</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <Card className="lg:col-span-8 border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-indigo-500" /> Cost Allocation Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Total Amount</TableHead>
                                            <TableHead className="text-right">Per Bird</TableHead>
                                            <TableHead className="text-right">% of COGS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {[
                                            { type: 'FEED', amt: 185000, per: 185.00, pct: 75.5 },
                                            { type: 'DRUG', amt: 25000, per: 25.00, pct: 10.2 },
                                            { type: 'VACCINE', amt: 15000, per: 15.00, pct: 6.1 },
                                            { type: 'CHICK_PURCHASE', amt: 20000, per: 20.00, pct: 8.2 }
                                        ].map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-bold text-slate-800">{row.type}</TableCell>
                                                <TableCell className="text-right font-bold text-slate-700">{formatCurrency(row.amt)}</TableCell>
                                                <TableCell className="text-right text-slate-500">{formatCurrency(row.per)}</TableCell>
                                                <TableCell className="text-right font-bold text-indigo-600">{row.pct}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-4 border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Profitability Outlook</CardTitle>
                                <CardDescription>Estimated margins at current market rates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Meat Revenue</p>
                                        <p className="text-xl font-bold text-slate-800">{formatCurrency(450000)}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
                                </div>
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase">Projected Net Profit</p>
                                        <p className="text-xl font-black text-indigo-700">{formatCurrency(205000)}</p>
                                    </div>
                                    <Percent className="h-8 w-8 text-indigo-500 opacity-20" />
                                </div>
                                <div className="pt-4 space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>Production Efficiency</span>
                                        <span className="text-emerald-600">High (92%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlockProfitability;
