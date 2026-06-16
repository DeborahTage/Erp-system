import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { crmApi, farmApi, flockApi, inventoryApi, vetApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, FileSignature, Hash, User, Package, Clipboard, Info, CheckCircle2, FlaskConical, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const healthReport = location.state?.healthReport;
  const diseaseCase = location.state?.diseaseCase;

  const [form, setForm] = useState({
    prescriptionNumber: `RX-${Date.now()}`,
    prescriptionType: healthReport?.clientId ? 'EXTERNAL_CLIENT' : 'INTERNAL_FARM',
    drugName: '',
    quantity: '',
    dosageInstruction: healthReport?.treatmentPlan || '',
    farmId: healthReport?.farmId || diseaseCase?.farmId || '',
    flockId: healthReport?.flockId || diseaseCase?.flockId || '',
    clientId: healthReport?.clientId || '',
    diseaseCaseId: diseaseCase?.id || healthReport?.diseaseCaseId || '',
    inventoryItemId: '',
    withdrawalPeriodDays: ''
  });

  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [clients, setClients] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    farmApi.getAll().then((r) => setFarms(r.data.data?.filter((farm) => farm.status === 'ACTIVE') || []));
    crmApi.getClients().then((r) => setClients(r.data.data || []));
    inventoryApi.getItems().then((r) => setInventoryItems(r.data.data?.filter((item) => item.status === 'ACTIVE') || []));
  }, []);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll().then((r) => setFlocks(r.data.data?.filter((flock) => String(flock.farmId) === String(form.farmId) && flock.status === 'ACTIVE') || []));
    } else {
      setFlocks([]);
    }
  }, [form.farmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.drugName || !form.quantity) {
      setError('Missing pharmacological data. Please specify the drug and quantity.');
      setLoading(false);
      return;
    }

    try {
      await vetApi.createPrescription({
        ...form,
        quantity: Number(form.quantity),
        farmId: form.farmId ? Number(form.farmId) : null,
        flockId: form.flockId ? Number(form.flockId) : null,
        clientId: form.clientId ? Number(form.clientId) : null,
        diseaseCaseId: form.diseaseCaseId ? Number(form.diseaseCaseId) : null,
        inventoryItemId: form.inventoryItemId ? Number(form.inventoryItemId) : null,
        withdrawalPeriodDays: form.withdrawalPeriodDays ? Number(form.withdrawalPeriodDays) : null,
      });
      toast.success('Prescription issued and logged in pharmacy ledger.');
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authorize prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 group transition-all"
            onClick={() => navigate('/veterinary')}
          >
            <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
              Issue RX
              <div className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100 flex items-center gap-1.5">
                <FileSignature className="h-3 w-3" />
                Medical Authority
              </div>
            </h1>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Pharmacological intervention & Dispensing control</p>
          </div>
        </div>
        <div className="h-px flex-1 bg-gray-100 hidden md:block mx-8" />
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
          <Clock className="h-4 w-4 text-purple-500" />
          <span className="text-[10px] font-black uppercase text-gray-500">Pharmacy Queue Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
              <CardTitle className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                <FlaskConical className="h-5 w-5 text-purple-600" />
                Clinical Order
              </CardTitle>
              <CardDescription className="text-xs font-bold text-gray-400">Specify biological agent and target population parameters</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 text-xs font-black text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Prescription Tier</Label>
                    <Select value={form.prescriptionType} onValueChange={(v) => setForm({ ...form, prescriptionType: v })}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="INTERNAL_FARM" className="rounded-xl my-1 font-bold">INTERNAL FARM HUB</SelectItem>
                        <SelectItem value="EXTERNAL_CLIENT" className="rounded-xl my-1 font-bold">EXTERNAL CLIENT PORTFOLIO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">RX Reference ID</Label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        className="h-12 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl font-mono font-bold text-purple-700 cursor-not-allowed"
                        value={form.prescriptionNumber}
                        readOnly
                      />
                    </div>
                  </div>

                  {form.prescriptionType === 'INTERNAL_FARM' ? (
                    <>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Target Zone *</Label>
                        <Select value={String(form.farmId)} onValueChange={(v) => setForm({ ...form, farmId: v, flockId: '' })}>
                          <SelectTrigger className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {farms.map((f) => (
                              <SelectItem key={f.id} value={String(f.id)} className="rounded-xl my-1 font-bold">{f.farmName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Flock Identity *</Label>
                        <Select value={String(form.flockId)} onValueChange={(v) => setForm({ ...form, flockId: v })} disabled={!form.farmId}>
                          <SelectTrigger className={cn("h-12 border-2 rounded-2xl font-bold transition-all", !form.farmId ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100 focus:ring-purple-600")}>
                            <SelectValue placeholder="Select target batch" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {flocks.map((f) => (
                              <SelectItem key={f.id} value={String(f.id)} className="rounded-xl my-1 font-bold">{f.batchCode}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Account Portfolio *</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Select value={String(form.clientId)} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                          <SelectTrigger className="h-12 pl-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                            <SelectValue placeholder="Select registered client" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {clients.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)} className="rounded-xl my-1 font-bold">{c.clientName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Pharmacy Inventory Link</Label>
                    <Select value={String(form.inventoryItemId)} onValueChange={(v) => {
                      const selected = inventoryItems.find((item) => String(item.id) === String(v));
                      setForm({ ...form, inventoryItemId: v, drugName: selected?.itemName || form.drugName });
                    }}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                        <SelectValue placeholder="Link to existing medical stock" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]">
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)} className="rounded-xl my-1 font-bold">
                            {item.itemName} <span className="ml-2 text-xs text-gray-400">(BAL: {item.currentStock} {item.unit})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Priority Lifecycle *</Label>
                    <Select value={form.priority || 'NORMAL'} onValueChange={(v) => setForm({ ...form, priority: v })}>
                      <SelectTrigger className={cn(
                        "h-12 border-2 rounded-2xl font-bold transition-all",
                        form.priority === 'EMERGENCY' ? "border-rose-200 bg-rose-50 text-rose-700" : "bg-white border-gray-100"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="NORMAL" className="rounded-xl my-1 font-bold">NORMAL PRIORITY</SelectItem>
                        <SelectItem value="EMERGENCY" className="rounded-xl my-1 font-bold text-rose-600">EMERGENCY / URGENT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Biological Identity *</Label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        className="h-12 pl-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all"
                        value={form.drugName}
                        onChange={(e) => setForm({ ...form, drugName: e.target.value })}
                        placeholder="e.g. Oxytetracycline 20%"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Dispense Volume *</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-black focus:ring-purple-600 transition-all text-purple-700"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Admin Route *</Label>
                    <Select value={form.administrationRoute || ''} onValueChange={(v) => setForm({ ...form, administrationRoute: v })}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                        <SelectValue placeholder="e.g. Oral, Injection" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {['ORAL', 'INJECTION', 'WATER_SOLUBLE', 'FEED_MIX', 'TOPICAL'].map(r => (
                          <SelectItem key={r} value={r} className="rounded-xl my-1 font-bold">{r.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Frequency *</Label>
                    <Select value={form.frequency || ''} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:ring-purple-600 transition-all">
                        <SelectValue placeholder="e.g. Once Daily" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {['ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'EVERY_OTHER_DAY', 'CONTINUOUS_IN_WATER'].map(f => (
                          <SelectItem key={f} value={f} className="rounded-xl my-1 font-bold">{f.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Withdrawal Days (Meat/Eggs)</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                      <Input
                        type="number"
                        min="0"
                        className="h-12 pl-12 bg-rose-50/30 border-rose-100 border-2 rounded-2xl font-black text-rose-700 focus:ring-rose-600 transition-all"
                        value={form.withdrawalPeriodDays}
                        onChange={(e) => setForm({ ...form, withdrawalPeriodDays: e.target.value })}
                        placeholder="e.g. 7"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Clinical Instruction Set</Label>
                    <div className="relative">
                      <Clipboard className="absolute left-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Textarea
                        rows={4}
                        className="bg-white border-2 border-gray-100 rounded-2xl font-medium text-sm focus:ring-purple-600 transition-all p-4 pl-12 leading-relaxed"
                        value={form.dosageInstruction}
                        onChange={(e) => setForm({ ...form, dosageInstruction: e.target.value })}
                        placeholder="Specify dosage, route of administration, and withdrawal period protocols..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <Button type="submit" className="flex-[2] h-14 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95" disabled={loading}>
                    {loading ? 'Authorizing Order...' : 'Dispatch Prescription'}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-2 font-black text-sm uppercase tracking-widest hover:bg-gray-50" onClick={() => navigate('/veterinary')}>
                    Discard
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] bg-indigo-900 text-white overflow-hidden p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-800 rounded-xl">
                <Info className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Pharmacy Auth</span>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-black flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Regulated Substance Control
                </h4>
                <p className="text-xs text-indigo-200/70 font-medium leading-relaxed italic">
                  All prescriptions are audited for dosage safety bounds before dispensing. Withdrawl periods must be communicated to the field supervisor.
                </p>
              </div>
              <div className="h-px bg-indigo-800" />
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Authorization Logic</p>
                <div className="flex items-center gap-3 bg-indigo-950/30 p-3 rounded-xl border border-indigo-800/50">
                  <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold">Automatic Inventory Deduction</span>
                </div>
                <div className="flex items-center gap-3 bg-indigo-950/30 p-3 rounded-xl border border-indigo-800/50">
                  <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold">Medical Ledger Synchronization</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[2.5rem] bg-purple-500 p-8 text-white">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-100">Live Stock</span>
                <Clock className="h-4 w-4 text-purple-100" />
              </div>
              <p className="text-2xl font-black">94%</p>
              <p className="text-[10px] font-bold text-purple-100/60 uppercase tracking-widest">Biological Inventory Health</p>
            </div>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default PrescriptionForm;
