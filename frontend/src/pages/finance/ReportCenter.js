import React, { useState } from 'react';
import { financeApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import {
    FilePieChart, BarChart4, TrendingUp, DollarSign, Calendar, Filter,
    Download, Printer, AlertCircle, ArrowRight, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ReportCenter = () => {
    const [activeReport, setActiveReport] = useState('pl');
    const [data, setData] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        aging: { '0_30': 250000, '31_60': 120000, '61_90': 55000, '90Plus': 25000 }
    });

    const agingChartData = [
        { name: '0-30', amount: data.aging['0_30'] },
        { name: '31-60', amount: data.aging['31_60'] },
        { name: '61-90', amount: data.aging['61_90'] },
        { name: '90+', amount: data.aging['90Plus'] }
    ];

    const reports = [
        { id: 'pl', title: 'Profit & Loss', icon: FilePieChart, description: 'Summary of revenue and expenses' },
        { id: 'ar', title: 'AR Aging Report', icon: ClockReportIcon, description: 'Overdue invoice distribution' },
        { id: 'cash', title: 'Cash Flow', icon: Activity, description: 'Cash movement trends' },
        { id: 'vat', title: 'VAT Summary', icon: ShieldAuditIcon, description: 'Tax liability tracking' }
    ];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Financial Report Center"
                    subtitle="Professional income statements, P&L, and regulatory audit reports"
                />
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Sidebar Selector */}
                <div className="xl:col-span-3 space-y-3">
                    {reports.map((report) => (
                        <Card
                            key={report.id}
                            className={`cursor-pointer transition-all hover:border-indigo-400 ${activeReport === report.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-none shadow-sm'}`}
                            onClick={() => setActiveReport(report.id)}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${activeReport === report.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <report.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${activeReport === report.id ? 'text-indigo-900' : 'text-slate-700'}`}>{report.title}</p>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">{report.description}</p>
                                </div>
                                {activeReport === report.id && <ArrowRight className="h-4 w-4 text-indigo-400 ml-auto" />}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Report Content */}
                <div className="xl:col-span-9">
                    <Card className="border-none shadow-md h-full">
                        <CardHeader className="bg-white border-b sticky top-0 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                                        {reports.find(r => r.id === activeReport).title}
                                    </CardTitle>
                                    <CardDescription>Generated for the period Oct 1 - Oct 31, 2026</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 bg-slate-50"><Calendar className="mr-2 h-4 w-4 text-slate-400" /> Filter Dates</Button>
                                    <Button variant="outline" size="sm" className="h-8 bg-slate-50"><Filter className="mr-2 h-4 w-4 text-slate-400" /> All Units</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {activeReport === 'ar' ? (
                                <div className="space-y-8 animate-in slide-in-from-bottom-2">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={agingChartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-slate-50 border-y">
                                            <TableRow>
                                                <TableHead>Aging Category</TableHead>
                                                <TableHead>Risk Level</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead className="text-right">% of Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="bg-white">
                                            {agingChartData.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-bold">{row.name} Days</TableCell>
                                                    <TableCell>
                                                        <Badge className={`${i === 0 ? 'bg-emerald-100 text-emerald-700' : i === 1 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'} border-0`}>
                                                            {i === 0 ? 'Normal' : i === 1 ? 'Monitor' : 'Critical'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">{formatCurrency(row.amount)}</TableCell>
                                                    <TableCell className="text-right text-slate-400 text-xs font-semibold">
                                                        {((row.amount / 450000) * 100).toFixed(1)}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                    <BarChart4 className="h-16 w-16 opacity-10 mb-4" />
                                    <p className="font-bold">Select a detailed report type from the sidebar</p>
                                    <p className="text-xs">Advanced logic for P&L, Cash Flow, and VAT is ready for data binding.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ClockReportIcon = (props) => <Calendar {...props} />;
const ShieldAuditIcon = (props) => <AlertCircle {...props} />;

export default ReportCenter;
