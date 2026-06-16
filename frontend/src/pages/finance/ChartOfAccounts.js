import React, { useEffect, useState } from 'react';
import { financeApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { formatCurrency } from '../../utils';
import { Layers, Activity, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';

const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // For now, using the transactional chart of accounts derived from AccountCode enum mapping
                // Real implementation would fetch from /api/finance/chart-of-accounts
                const res = await financeApi.getTransactions();
                // Group by account code for visualization
                const uniqueAccounts = {};
                res.data.data.forEach(tx => {
                    if (tx.accountCode) {
                        if (!uniqueAccounts[tx.accountCode]) {
                            uniqueAccounts[tx.accountCode] = {
                                code: tx.accountCode,
                                name: tx.accountCode.replace(/_/g, ' '),
                                unit: tx.businessUnit,
                                balance: 0
                            };
                        }
                        uniqueAccounts[tx.accountCode].balance += (tx.transactionType === 'INCOME' ? tx.amount : -tx.amount);
                    }
                });
                setAccounts(Object.values(uniqueAccounts));
            } catch (e) {
                console.error('Failed to fetch COA', e);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const filtered = accounts.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Chart of Accounts"
                subtitle="Double-entry ledger structure for all business units"
            />

            <div className="flex items-center gap-4 mb-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search accounts..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-500" /> General Ledger Accounts
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Account Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Business Unit</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {filtered.map((acc, i) => (
                                <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-bold text-slate-800">{acc.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-mono text-[10px]">{acc.code}</Badge></TableCell>
                                    <TableCell><Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">{acc.unit}</Badge></TableCell>
                                    <TableCell className={`text-right font-bold ${acc.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {formatCurrency(acc.balance)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20 text-slate-400 italic">No accounts found matching your search.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChartOfAccounts;
