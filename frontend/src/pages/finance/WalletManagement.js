import React, { useEffect, useState } from 'react';
import { financeApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import { Wallet, Plus, ArrowDown, History, Search, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/input';

const WalletManagement = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const res = await financeApi.getWallets();
                setWallets(res.data.data || []);
            } catch (e) {
                console.error('Failed to fetch wallets', e);
            } finally {
                setLoading(false);
            }
        };
        fetchWallets();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Digital Wallet System"
                    subtitle="Manage customer deposits, training credits, and credit limits"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> New Wallet
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <Card className="border-none shadow-sm bg-emerald-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-100 italic">Total Deposits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(1250000)}</div>
                        <p className="text-[10px] mt-1 text-emerald-100">Customer-held funds</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-indigo-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-100 italic">Active Wallets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-[10px] mt-1 text-indigo-100">Verified customers</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-amber-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-100 italic">Total Exposure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(450000)}</div>
                        <p className="text-[10px] mt-1 text-amber-100">Aggregated credit limits</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-500" /> Customer Ledgers
                        </CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search customer wallets..." className="pl-9 h-9 w-64 bg-slate-50 border-none shadow-none" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Customer / Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead className="text-right">Credit Limit</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {wallets.map((w, i) => (
                                <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-bold text-slate-900">{w.clientName}</TableCell>
                                    <TableCell>
                                        <Badge className={`${w.blocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'} shadow-none border-0`}>
                                            {w.blocked ? 'BLOCKED' : 'ACTIVE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(w.balance)}</TableCell>
                                    <TableCell className="text-right font-semibold text-slate-500">{formatCurrency(w.creditLimit)}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold"><Plus className="mr-1 h-3 w-3" /> DEPOSIT</Button>
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold"><ArrowDown className="mr-1 h-3 w-3" /> DEDUCT</Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><History className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {wallets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Wallet className="h-10 w-10 opacity-20" />
                                            <p className="italic">No digital wallets registered yet.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletManagement;
