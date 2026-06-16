import React, { useState } from 'react';
import { financeApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { formatCurrency } from '../../utils';
import { Calculator, CheckCircle2, AlertCircle, TrendingUp, History } from 'lucide-react';

const CashReconciliation = () => {
    const [expected, setExpected] = useState('');
    const [actual, setActual] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await financeApi.reconcileCash({
                expectedCash: parseFloat(expected),
                actualCash: parseFloat(actual),
                notes
            });
            setResult(res.data.data);
        } catch (err) {
            console.error('Reconciliation failed', err);
        } finally {
            setSubmitting(false);
        }
    };

    const variance = (parseFloat(actual) || 0) - (parseFloat(expected) || 0);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Daily Cash Reconciliation"
                subtitle="End-of-day audit process to compare system expected vs actual cash on hand"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Audit Entry</CardTitle>
                        <CardDescription>Perform precise cash count at shift end</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expected Cash (from Ledger)</Label>
                                    <Input
                                        type="number"
                                        value={expected}
                                        onChange={(e) => setExpected(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-slate-50 border-none shadow-none text-lg font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Actual Cash (Physical Count)</Label>
                                    <Input
                                        type="number"
                                        value={actual}
                                        onChange={(e) => setActual(e.target.value)}
                                        placeholder="0.00"
                                        className="bg-white border border-slate-200 text-lg font-bold"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500 italic uppercase tracking-wider">Calculated Variance</span>
                                    <span className={`text-2xl font-black ${variance === 0 ? 'text-emerald-600' : variance < 0 ? 'text-rose-600' : 'text-indigo-600'}`}>
                                        {formatCurrency(variance)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold tracking-tight">
                                    {variance === 0 ? 'Balanced' : variance < 0 ? 'Shortage detected' : 'Overage detected'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Auditor's Notes</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Explain any shortages or overages..."
                                    className="bg-white border-slate-200 min-h-[100px]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-base font-bold shadow-lg shadow-indigo-200"
                                disabled={submitting || !expected || !actual}
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" /> COMPLETE RECONCILIATION
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {result ? (
                        <Card className="border-none shadow-sm animate-in zoom-in duration-300 bg-white border-2 border-emerald-100">
                            <CardHeader className="bg-emerald-50/50 pb-4 border-b">
                                <CardTitle className="text-emerald-700 text-base font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" /> RECONCILIATION SUCCESSFUL
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="text-4xl font-black text-slate-900">{result.status}</div>
                                <div className="grid grid-cols-3 gap-4 border-y py-6 my-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Expected</p>
                                        <p className="font-bold text-slate-700">{formatCurrency(result.expectedCash)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Actual</p>
                                        <p className="font-bold text-slate-700">{formatCurrency(result.actualCash)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Variance</p>
                                        <p className={`font-bold ${result.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatCurrency(result.variance)}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => setResult(null)}>Reset Form</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-sm bg-slate-900 text-white">
                            <CardHeader>
                                <CardTitle className="text-indigo-300 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <History className="h-4 w-4" /> RECENT AUDIT LOGS
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex flex-row items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5">
                                            <div>
                                                <p className="text-xs font-bold text-indigo-100">June {16 - i}, 2026</p>
                                                <p className="text-[10px] text-slate-400 italic">Performed by Sarah J.</p>
                                            </div>
                                            <Badge className="bg-emerald-900/50 text-emerald-400 border border-emerald-500/30">BALANCED</Badge>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full text-indigo-300 hover:text-indigo-200 mt-4 text-xs font-bold">VIEW ALL RECONCILIATIONS</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CashReconciliation;
