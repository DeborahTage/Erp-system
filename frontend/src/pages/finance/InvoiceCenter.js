import React, { useEffect, useState } from 'react';
import { financeApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import { FileText, Plus, Receipt, Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/input';

const InvoiceCenter = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await financeApi.getInvoices();
                setInvoices(res.data.data || []);
            } catch (e) {
                console.error('Failed to fetch invoices', e);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const StatusBadge = ({ status }) => {
        const variants = {
            'PAID': 'bg-emerald-100 text-emerald-700',
            'OVERDUE': 'bg-rose-100 text-rose-700',
            'SENT': 'bg-blue-100 text-blue-700',
            'DRAFT': 'bg-slate-100 text-slate-600',
            'PARTIALLY_PAID': 'bg-amber-100 text-amber-700'
        };
        return <Badge className={`${variants[status] || 'bg-slate-100'} hover:bg-opacity-80 shadow-none`}>{status}</Badge>;
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Invoice Center"
                    subtitle="Manage multi-stream billing, POS receipts, and service contracts"
                />
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white"><Receipt className="mr-2 h-4 w-4" /> POS Entry</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="mr-2 h-4 w-4" /> Service Invoice</Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <TabsList className="bg-slate-100">
                        <TabsTrigger value="all">All Invoices</TabsTrigger>
                        <TabsTrigger value="pos">POS Sales</TabsTrigger>
                        <TabsTrigger value="service">Service Contracts</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search invoices..." className="pl-9 h-9 w-64 bg-white" />
                        </div>
                        <Button variant="outline" size="sm" className="bg-white h-9"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                    </div>
                </div>

                <TabsContent value="all" className="m-0">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Total Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {invoices.map((inv, i) => (
                                        <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</TableCell>
                                            <TableCell>{inv.clientName}</TableCell>
                                            <TableCell><Badge variant="outline" className="text-[10px]">{inv.businessUnit}</Badge></TableCell>
                                            <TableCell className="text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(inv.totalAmount)}</TableCell>
                                            <TableCell><StatusBadge status={inv.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowRight className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {invoices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <FileText className="h-10 w-10 opacity-20" />
                                                    <p className="italic">No invoices found. Generate your first POS or Service invoice above.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default InvoiceCenter;
