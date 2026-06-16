import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vetApi, farmApi } from '../../api';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Syringe, FileText, Activity, Pill, Check, MoreHorizontal, Plus, ShieldAlert, ClipboardCheck, Stethoscope, Search, Filter, ArrowUpRight, TrendingUp, AlertTriangle, ChevronRight, Lock, Calendar as CalendarIcon, List, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PERMISSIONS } from '../../lib/permissions';

const VeterinaryPage = () => {
  const { t } = useLanguage();
  const { hasAnyPermission } = useAuth();
  const [vaccinations, setVaccinations] = useState([]);
  const [healthReports, setHealthReports] = useState([]);
  const [diseaseCases, setDiseaseCases] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [biosecurityLogs, setBiosecurityLogs] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewForm, setReviewForm] = useState({ suspectedDiagnosis: '', severity: 'LOW', treatmentPlan: '', status: 'REVIEWED' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [loading, setLoading] = useState(true);
  const [vaccinationView, setVaccinationView] = useState('list');
  const navigate = useNavigate();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const renderCalendar = () => {
    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 rounded-xl" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayVacs = vaccinations.filter(v => v.scheduledDate === dateStr);
      days.push(
        <div key={i} className={cn("h-24 p-2 border border-gray-100 rounded-xl flex flex-col overflow-hidden hover:shadow-md transition-all", dateStr === new Date().toISOString().split('T')[0] ? "bg-indigo-50 border-indigo-200" : "bg-white")}>
          <span className={cn("text-xs font-bold", dateStr === new Date().toISOString().split('T')[0] ? "text-indigo-600" : "text-gray-500")}>{i}</span>
          <div className="flex-1 overflow-y-auto mt-1 space-y-1 scrollbar-hide">
            {dayVacs.map(v => (
              <div key={v.id} title={v.vaccineName} className={cn("text-[9px] px-1.5 py-0.5 rounded truncate font-black uppercase", v.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>
                {v.vaccineName}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const canWrite = hasAnyPermission([
    PERMISSIONS.CREATE_DISEASE_CASES,
    PERMISSIONS.EDIT_DISEASE_CASES,
    PERMISSIONS.CREATE_TREATMENTS,
    PERMISSIONS.CREATE_PRESCRIPTIONS,
    PERMISSIONS.MANAGE_VACCINATIONS,
  ]);
  useEffect(() => {
    Promise.all([
      vetApi.getVaccinations(),
      vetApi.getHealthReports(),
      vetApi.getDiseaseCases(),
      vetApi.getTreatments(),
      vetApi.getPrescriptions()
    ]).then(([vaccinationsRes, healthReportsRes, diseaseCasesRes, treatmentsRes, prescriptionsRes]) => {
      setVaccinations(vaccinationsRes.data.data || []);
      setHealthReports(healthReportsRes.data.data || []);
      setDiseaseCases(diseaseCasesRes.data.data || []);
      setTreatments(treatmentsRes.data.data || []);
      setPrescriptions(prescriptionsRes.data.data || []);
      fetchBiosecurityLogs();
    }).catch((err) => {
      console.error('Failed to load veterinary data', err);
      toast.error('Could not load veterinary data. Please refresh or try again.');
    }).finally(() => setLoading(false));
  }, []);

  const fetchBiosecurityLogs = async () => {
    try {
      const farmRes = await farmApi.getAll();
      if (farmRes.data.data?.length > 0) {
        const res = await farmApi.getBiosecurityLogs(farmRes.data.data[0].id);
        setBiosecurityLogs(res.data.data || []);
      }
    } catch (err) { console.error("Could not load biosecurity", err); }
  };

  const completeVaccination = async (id) => {
    if (!canWrite) return;
    try {
      await vetApi.completeVaccination(id);
      setVaccinations((prev) => prev.map((item) => item.id === id ? { ...item, status: 'COMPLETED' } : item));
      toast.success('Vaccination successfully marked as complete');
    } catch (e) {
      toast.error('Failed to update vaccination status');
    }
  };

  const openReviewModal = (report) => {
    if (!canWrite) return;
    setSelectedReport(report);
    setReviewForm({
      suspectedDiagnosis: report.suspectedDiagnosis || '',
      severity: report.severity || 'LOW',
      treatmentPlan: report.treatmentPlan || '',
      status: report.status === 'CLOSED' ? 'CLOSED' : 'REVIEWED',
    });
    setReviewError('');
  };

  const submitReview = async () => {
    if (!selectedReport || !canWrite) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await vetApi.reviewHealthReport(selectedReport.id, reviewForm);
      setHealthReports((prev) => prev.map((report) => report.id === selectedReport.id ? res.data.data : report));
      toast.success('Health report reviewed and updated');
      setSelectedReport(null);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Unable to review report');
    } finally {
      setReviewLoading(false);
    }
  };

  const vaccinationCols = [
    {
      key: 'farmName',
      label: 'Location/Batch',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.farmName}</span>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{row.batchCode}</span>
        </div>
      )
    },
    {
      key: 'vaccineName',
      label: 'Vaccine',
      render: (row) => <span className="font-black text-slate-700">{row.vaccineName}</span>
    },
    {
      key: 'scheduledDate',
      label: 'Scheduled',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-600">{formatDate(row.scheduledDate)}</span>
          {row.actualDate && <span className="text-[10px] text-emerald-600 font-bold italic">Done: {formatDate(row.actualDate)}</span>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Compliance',
      render: (row) => <StatusBadge status={row.status?.toLowerCase()} />
    },
    {
      key: 'actions',
      label: '',
      render: (row) => row.status === 'SCHEDULED' && canWrite && (
        <Button size="sm" variant="outline" className="rounded-xl border-2 h-8 font-black text-[10px] uppercase tracking-wider" onClick={() => completeVaccination(row.id)}>
          <Check className="mr-1.5 h-3 w-3" />
          Mark Done
        </Button>
      )
    },
  ];

  const healthReportCols = [
    {
      key: 'farmName',
      label: 'Source',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.farmName}</span>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{row.batchCode}</span>
        </div>
      )
    },
    {
      key: 'reportDate',
      label: 'Logged At',
      render: (row) => <span className="font-bold text-gray-600">{formatDate(row.reportDate)}</span>
    },
    {
      key: 'mortalityObserved',
      label: 'Impact',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-center min-w-12">
            <span className="text-sm font-black text-rose-600">{row.mortalityObserved || 0}</span>
            <span className="text-[8px] font-black uppercase text-gray-400">Deaths</span>
          </div>
          <div className="h-6 w-px bg-gray-100" />
          <div className="flex flex-col text-center min-w-12">
            <span className="text-sm font-black text-amber-600">{row.numberAffected || 0}</span>
            <span className="text-[8px] font-black uppercase text-gray-400">Affected</span>
          </div>
        </div>
      )
    },
    { key: 'status', label: 'Surveillance', render: (row) => <StatusBadge status={row.status?.toLowerCase()} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => canWrite && (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50 hover:text-indigo-600" onClick={() => openReviewModal(row)}>
            <ClipboardCheck className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600" onClick={() => navigate('/veterinary/disease-cases/new', { state: { healthReport: row } })}>
            <ShieldAlert className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600" onClick={() => navigate('/veterinary/prescriptions/new', { state: { healthReport: row } })}>
            <Pill className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const diseaseCols = [
    { key: 'farmName', label: 'Farm' },
    {
      key: 'suspectedDisease',
      label: 'Diagnosis',
      render: (row) => <span className="font-black text-rose-700">{row.suspectedDisease}</span>
    },
    { key: 'dateDetected', label: 'Detection Date', render: (row) => <span className="font-bold text-gray-600">{formatDate(row.dateDetected)}</span> },
    { key: 'severity', label: 'Triage', render: (row) => <StatusBadge status={row.severity?.toLowerCase()} /> },
    { key: 'status', label: 'Resolution', render: (row) => <StatusBadge status={row.status?.toLowerCase()} /> },
    {
      key: 'numberAffected',
      label: 'Scale',
      render: (row) => <span className="font-black">{row.numberAffected} birds</span>
    },
  ];

  const treatmentCols = [
    { key: 'farmName', label: 'Farm' },
    {
      key: 'drugName',
      label: 'Medication',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Pill className="h-3 w-3 text-blue-600" />
          </div>
          <span className="font-bold text-gray-900">{row.drugName}</span>
        </div>
      )
    },
    { key: 'dosage', label: 'Protocol' },
    {
      key: 'startDate',
      label: 'Course Period',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-bold text-gray-600 text-[11px]">
          {formatDate(row.startDate)} <ChevronRight className="h-3 w-3" /> {formatDate(row.endDate)}
        </div>
      )
    },
    { key: 'outcome', label: 'Clinical Outcome', render: (row) => <span className="text-xs italic font-medium text-gray-500">{row.outcome || 'Pending Results...'}</span> },
  ];

  const prescriptionCols = [
    {
      key: 'prescriptionNumber',
      label: 'Order Reference',
      render: (row) => <span className="font-black text-indigo-600 tracking-tighter">#{row.prescriptionNumber}</span>
    },
    { key: 'farmName', label: 'Farm' },
    {
      key: 'drugName',
      label: 'Item',
      render: (row) => <span className="font-bold text-slate-700">{row.drugName}</span>
    },
    { key: 'quantity', label: 'Qty Order', render: (row) => <span className="font-black">{row.quantity}</span> },
    {
      key: 'withdrawal',
      label: 'Withdrawal Period',
      render: (row) => {
        if (!row.withdrawalEndDate) return <span className="text-gray-400 font-bold">-</span>;
        const diff = new Date(row.withdrawalEndDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-full">{days} Days Locked</span>;
        return <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Cleared</span>;
      }
    },
    { key: 'status', label: 'Pharmacy Status', render: (row) => <StatusBadge status={row.status?.toLowerCase()} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => row.status === 'PENDING' && (
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full w-fit">
          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase text-amber-700 tracking-tight">Queued</span>
        </div>
      )
    },
  ];

  const biosecurityCols = [
    { key: 'timestamp', label: 'Date/Time', render: (row) => new Date(row.timestamp).toLocaleString() },
    { key: 'farmName', label: 'Farm', render: (row) => <span className="font-bold">{row.farmName}</span> },
    { key: 'visitorName', label: 'Visitor / Regen', render: (row) => <span className="text-gray-600 font-bold">{row.visitorName || row.vehicleReg || 'Internal Staff'}</span> },
    {
      key: 'checks', label: 'Protocols Passed', render: (row) => (
        <div className="flex gap-2">
          {row.footbathRefreshed && <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-black uppercase rounded-full tracking-widest">Footbath</span>}
          {row.vehicularSpray && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full tracking-widest">Spray</span>}
          {row.ppeWorn && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-widest">PPE</span>}
        </div>
      )
    },
    { key: 'signature', label: 'Officer Signature', render: (row) => <span className="font-mono text-xs opacity-50">{row.staffSignature}</span> }
  ];

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <PageHeader
          title="Medical Lifecycle Management"
          subtitle="Comprehensive oversight of vaccination protocols, disease surveillance, and therapeutics."
          className="mb-0"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-2xl border-2 hover:bg-slate-50" onClick={() => navigate('/veterinary/reports')}>
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Archive Logs
            </Button>
            {canWrite ? (
              <Button className="rounded-2xl bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 uppercase tracking-widest text-[10px] font-black" onClick={() => navigate('/veterinary/health-reports/new')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency Report
              </Button>
            ) : (
              <Button disabled className="rounded-2xl bg-gray-200 text-gray-400 border-none uppercase tracking-widest text-[10px] font-black">
                <Lock className="mr-2 h-4 w-4" />
                Read Only
              </Button>
            )}
          </div>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Analytics Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-indigo-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Biosecurity Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="space-y-2">
                <p className="text-4xl font-black">{diseaseCases.length}</p>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Outbreaks</p>
              </div>
              <div className="space-y-4 pt-6 border-t border-indigo-800">
                <div className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/veterinary/vaccinations/new')}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-800 rounded-xl group-hover:bg-indigo-700 transition-colors">
                      <Syringe className="h-4 w-4 text-indigo-300" />
                    </div>
                    <span className="text-xs font-bold">Planned Vacs</span>
                  </div>
                  <span className="text-xs font-black bg-white/10 px-2 py-1 rounded-lg">{vaccinations.filter(v => v.status === 'SCHEDULED').length}</span>
                </div>
                <div className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/veterinary/prescriptions/new')}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-800 rounded-xl group-hover:bg-indigo-700 transition-colors">
                      <Pill className="h-4 w-4 text-indigo-300" />
                    </div>
                    <span className="text-xs font-bold">Open Orders</span>
                  </div>
                  <span className="text-xs font-black bg-white/10 px-2 py-1 rounded-lg">{prescriptions.filter(p => p.status === 'PENDING').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400">Quick Protocols</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2">
              <Button variant="ghost" disabled={!canWrite} className="w-full justify-between h-14 rounded-2xl hover:bg-slate-50 px-4 group" onClick={() => navigate('/veterinary/vaccinations/new')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Syringe className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className={cn("text-sm font-black", !canWrite ? "text-gray-300" : "text-slate-700")}>Schedule Vac</span>
                </div>
                <Plus className="h-4 w-4 text-slate-300" />
              </Button>
              <Button variant="ghost" disabled={!canWrite} className="w-full justify-between h-14 rounded-2xl hover:bg-slate-50 px-4 group" onClick={() => navigate('/veterinary/disease-cases/new')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldAlert className="h-5 w-5 text-rose-600" />
                  </div>
                  <span className={cn("text-sm font-black", !canWrite ? "text-gray-300" : "text-slate-700")}>Record Case</span>
                </div>
                <Plus className="h-4 w-4 text-slate-300" />
              </Button>
              <Button variant="ghost" disabled={!canWrite} className="w-full justify-between h-14 rounded-2xl hover:bg-slate-50 px-4 group" onClick={() => navigate('/veterinary/treatments/new')}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className={cn("text-sm font-black", !canWrite ? "text-gray-300" : "text-slate-700")}>Regimen Plan</span>
                </div>
                <Plus className="h-4 w-4 text-slate-300" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabbed Interface */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="vaccinations" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="bg-gray-100 p-1.5 rounded-[2rem] w-fit border border-gray-200">
                <TabsList className="bg-transparent h-12 gap-1 px-1">
                  <TabsTrigger value="vaccinations" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Vaccinations</TabsTrigger>
                  <TabsTrigger value="healthReports" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Alert Logs</TabsTrigger>
                  <TabsTrigger value="disease" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Surveillance</TabsTrigger>
                  <TabsTrigger value="treatments" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Clinical</TabsTrigger>
                  <TabsTrigger value="prescriptions" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Rx Ledger</TabsTrigger>
                  <TabsTrigger value="biosecurity" className="rounded-3xl data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-tight h-10 px-6">Biosecurity</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex items-center gap-3 px-6 py-2 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Medical Compliance: 92.4%</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              <TabsContent value="vaccinations" className="m-0 border-none outline-none">
                <div className="flex justify-end p-4 bg-gray-50 border-b border-gray-100">
                  <div className="bg-white rounded-2xl flex border border-gray-200 p-1 shadow-sm">
                    <Button size="sm" variant={vaccinationView === 'list' ? 'default' : 'ghost'} className={cn("rounded-xl h-8 text-[10px] uppercase font-black tracking-widest", vaccinationView === 'list' && "bg-indigo-600")} onClick={() => setVaccinationView('list')}>
                      <List className="h-3 w-3 mr-1" /> List
                    </Button>
                    <Button size="sm" variant={vaccinationView === 'calendar' ? 'default' : 'ghost'} className={cn("rounded-xl h-8 text-[10px] uppercase font-black tracking-widest", vaccinationView === 'calendar' && "bg-indigo-600")} onClick={() => setVaccinationView('calendar')}>
                      <CalendarIcon className="h-3 w-3 mr-1" /> Calendar
                    </Button>
                  </div>
                </div>
                {vaccinationView === 'list' ? (
                  <DataTable columns={vaccinationCols} data={vaccinations} loading={loading} searchable pagination emptyMessage="No active vaccination schedules detected." />
                ) : (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl border-2" onClick={() => { setCurrentMonth(prev => prev === 0 ? 11 : prev - 1); setCurrentYear(prev => currentMonth === 0 ? prev - 1 : prev); }}>Prev</Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-2" onClick={() => { setCurrentMonth(prev => prev === 11 ? 0 : prev + 1); setCurrentYear(prev => currentMonth === 11 ? prev + 1 : prev); }}>Next</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-3 mb-2 text-center text-[10px] font-black tracking-widest uppercase text-slate-400">
                      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {renderCalendar()}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="healthReports" className="m-0 border-none outline-none">
                <DataTable columns={healthReportCols} data={healthReports} loading={loading} searchable pagination emptyMessage="Clear surveillance. No health reports flagged." />
              </TabsContent>

              <TabsContent value="disease" className="m-0 border-none outline-none">
                <DataTable columns={diseaseCols} data={diseaseCases} loading={loading} searchable pagination emptyMessage="No active disease cases currently isolated." />
              </TabsContent>

              <TabsContent value="treatments" className="m-0 border-none outline-none">
                <DataTable columns={treatmentCols} data={treatments} loading={loading} searchable pagination emptyMessage="No active treatment regimens recorded." />
              </TabsContent>

              <TabsContent value="prescriptions" className="m-0 border-none outline-none">
                <DataTable columns={prescriptionCols} data={prescriptions} loading={loading} searchable pagination emptyMessage="No pharmaceutical orders in the current queue." />
              </TabsContent>

              <TabsContent value="biosecurity" className="m-0 border-none outline-none p-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                      Protocol Compliance
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Access Control and Sanitation Events</p>
                  </div>
                  <Button className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate('/veterinary/biosecurity/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Log
                  </Button>
                </div>
                <DataTable columns={biosecurityCols} data={biosecurityLogs} loading={loading} searchable pagination emptyMessage="No biosecurity protocols logged recently." />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Review Modal Refinement */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-indigo-900 p-8 text-white">
            <DialogHeader>
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-indigo-300" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">Clinical Assessment</DialogTitle>
              <DialogDescription className="text-indigo-300 font-bold text-xs uppercase tracking-widest mt-1">
                Reviewing Health Incident for {selectedReport?.farmName}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 bg-white">
            {reviewError && (
              <div className="p-4 text-xs font-black text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="h-4 w-4" />
                {reviewError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Suspected Pathology</Label>
                <Input
                  className="rounded-xl border-gray-200 h-11 focus:ring-indigo-600 focus:border-indigo-600 font-bold"
                  placeholder="E.g., Newcastle Disease variant..."
                  value={reviewForm.suspectedDiagnosis}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, suspectedDiagnosis: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Urgency Level</Label>
                <Select value={reviewForm.severity} onValueChange={(value) => setReviewForm((prev) => ({ ...prev, severity: value }))}>
                  <SelectTrigger className="rounded-xl h-11 border-gray-200 font-bold focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((s) => (
                      <SelectItem key={s} value={s} className="rounded-xl my-1 font-bold">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Medical Lifecycle Status</Label>
              <Select value={reviewForm.status} onValueChange={(value) => setReviewForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="rounded-xl h-11 border-gray-200 font-bold focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="REVIEWED" className="rounded-xl my-1 font-bold">Review Completed</SelectItem>
                  <SelectItem value="CLOSED" className="rounded-xl my-1 font-bold">Case Closed/Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Treatment Plan / Notes</Label>
              <Textarea
                className="rounded-2xl border-gray-200 focus:ring-indigo-600 font-medium text-sm leading-relaxed"
                rows={4}
                placeholder="Document clinical observations and immediate therapeutic steps..."
                value={reviewForm.treatmentPlan}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, treatmentPlan: e.target.value }))}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button variant="ghost" className="rounded-xl font-bold px-6" onClick={() => setSelectedReport(null)}>Discard</Button>
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black px-8 shadow-lg shadow-indigo-100" onClick={submitReview} disabled={reviewLoading}>
                {reviewLoading ? 'Updating Audit...' : 'Commit Review'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VeterinaryPage;
