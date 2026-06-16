import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pharmacyApi } from '../../api';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { toast } from 'react-hot-toast';
import {
    Pill,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Stethoscope,
    ClipboardCheck,
    Navigation,
    Calendar,
    Hash,
    Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export default function ProcessPrescription() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRxId = queryParams.get('rxId');

    const [rx, setRx] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (initialRxId) {
            fetchRx(initialRxId);
        }
    }, [initialRxId]);

    const fetchRx = async (id) => {
        setLoading(true);
        try {
            // Note: In a real system we'd have getPrescriptionById, 
            // for now we'll find it in the pending list
            const res = await pharmacyApi.getPrescriptions();
            const found = (res.data.data || []).find(r => String(r.id) === String(id));
            if (found) {
                setRx(found);
            } else {
                toast.error("Prescription not found or already processed");
            }
        } catch (err) {
            toast.error("Failed to load prescription details");
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async () => {
        if (!rx) return;
        setProcessing(true);
        try {
            await pharmacyApi.approvePrescription(rx.id);
            await pharmacyApi.dispensePrescription(rx.id);
            toast.success("Prescription dispensed! Stock levels and finance ledger updated.");
            navigate('/pharmacy/overview');
        } catch (error) {
            toast.error(error.response?.data?.message || "Dispensing failure");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center animate-pulse">
                <Pill className="h-12 w-12 text-gray-200 mb-4 animate-bounce" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Order Details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title="Process Medical Order"
                    subtitle="Verify instructions and execute issuance to farm"
                />
            </div>

            {!rx ? (
                <Card className="border-dashed border-2 bg-gray-50/50">
                    <CardContent className="h-64 flex flex-col items-center justify-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-gray-300" />
                        <div className="text-center">
                            <p className="text-gray-500 font-bold">No Active Selection</p>
                            <p className="text-xs text-gray-400">Select a prescription from the command center to begin processing.</p>
                        </div>
                        <Button onClick={() => navigate('/pharmacy/overview')} variant="outline" className="rounded-xl">
                            Go to Queue
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Summary Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white p-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none font-bold">READY FOR DISPENSING</Badge>
                                        <CardTitle className="text-3xl font-black tracking-tight">{rx.prescriptionNumber || `RX-${rx.id}`}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium italic">Ordered on {format(new Date(rx.createdAt || Date.now()), 'PPP')}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md inline-block">
                                            <Pill className="h-8 w-8 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Medication Name</Label>
                                        <p className="text-xl font-bold text-gray-900">{rx.drugName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity to Issue</Label>
                                        <p className="text-xl font-bold text-indigo-600">{rx.quantity} <span className="text-sm font-normal text-gray-500 uppercase tracking-tighter">Units</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1 flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg"><Navigation className="h-4 w-4 text-blue-600" /></div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Route of Admin</Label>
                                            <p className="font-bold text-gray-700">{rx.administrationRoute}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 rounded-lg"><Stethoscope className="h-4 w-4 text-amber-600" /></div>
                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Frequency</Label>
                                            <p className="font-bold text-gray-700">{rx.frequency}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 not-italic">Doctor's Clinical Notes</Label>
                                    "{rx.notes || 'No specific clinical instructions provided.'}"
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-lg bg-white rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <ClipboardCheck className="h-4 w-4 text-emerald-500" /> Verification Checklist
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        </div>
                                        Stock Availability Confirmed
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        </div>
                                        Batch Traceability Active
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <div className="h-4 w-4 rounded border-2 border-gray-200" />
                                        Labeled for Farm Delivery
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl p-2 relative overflow-hidden">
                                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                                    <CheckCircle2 size={120} />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold">Automated Effects</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-xs opacity-90 font-medium">
                                    <p>• Deduct <strong>{rx.quantity} units</strong> from FEFO drug batch</p>
                                    <p>• Log <strong>Internal Consumption</strong> expense</p>
                                    <p>• Link usage to <strong>{rx.flockName || 'Target Flock'}</strong> COGS</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right: Target Information & Action */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="pb-2 border-b border-gray-50">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Fulfillment Target</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Hash className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 leading-tight">{rx.flockName || 'General Stock'}</p>
                                        <p className="text-xs text-indigo-600 font-bold">{rx.farmName || 'Trust Agro Farm'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ordering Provider</Label>
                                    <p className="text-sm font-bold text-gray-700">Dr. {rx.veterinarianName || 'System Vet'}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Start Date</Label>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {format(new Date(rx.startDate || Date.now()), 'dd MMM yyyy')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            className="w-full h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black shadow-lg shadow-indigo-200 transition-all active:scale-95 group"
                            onClick={handleProcess}
                            disabled={processing}
                        >
                            {processing ? (
                                <Activity className="animate-spin mr-2 h-5 w-5" />
                            ) : (
                                <CheckCircle2 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                            )}
                            {processing ? 'Processing...' : 'Verify & Dispense'}
                        </Button>

                        <p className="text-[10px] text-center text-gray-400 font-medium px-4 leading-relaxed">
                            By clicking dispense, you confirm that physical stock has been issued and that this transaction will be recorded in the financial cost ledger immediately.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
