import React, { useEffect, useState } from 'react';
import {
  Activity, AlertCircle, Calendar, ClipboardList,
  Droplet, HeartPulse, ShieldCheck, TrendingUp,
  Zap, Clock, ArrowUpRight, Search, FileText,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { useNavigate } from 'react-router-dom';
import { vetApi } from '../../api';

const VeterinaryDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeCases: 0,
    vaccinationsDueThisWeek: 0,
    mortalityRate7Day: 0,
    drugStockAlerts: 0,
    mortalityTrend: [],
    diseaseBreakdown: [],
    recentCases: [],
    alerts: [],
    loading: true,
  });

  useEffect(() => {
    vetApi.getDashboardStats()
      .then((res) => {
        const data = res.data?.data || {};
        setStats({
          activeCases: data.activeDiseaseCases || 0,
          vaccinationsDueThisWeek: data.vaccinationsDueThisWeek || 0,
          mortalityRate7Day: data.mortalityRate7Day || 0,
          drugStockAlerts: data.drugStockAlerts || 0,
          mortalityTrend: (data.mortalityTrend || []).map((p) => ({
            day: p.date,
            rate: p.mortality,
          })),
          diseaseBreakdown: data.diseaseBreakdown || [],
          recentCases: data.recentDiseaseCases || [],
          alerts: data.alerts || [],
          loading: false,
        });
      })
      .catch(() => setStats((s) => ({ ...s, loading: false })));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Veterinary Command Center</h1>
          <p className="text-gray-500 mt-1">Real-time biological health monitoring & outbreak management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-indigo-200 text-indigo-700">
            <Search className="w-4 h-4 mr-2" /> Search Flock EMR
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
            <AlertCircle className="w-4 h-4 mr-2" /> Report Outbreak
          </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Disease Cases</CardTitle>
            <Activity className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeCases}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 text-rose-500 mr-1" /> +2 since yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Flocks Under Withdrawal</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.withdrawalFlocks}</div>
            <p className="text-xs text-amber-600 font-medium mt-1">BIOLOGICAL LOCKS ACTIVE</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vaccination Compliance</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.vaccinationCompliance}%</div>
            <Progress value={stats.vaccinationCompliance} className="h-1.5 mt-3 bg-emerald-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mortality Rate (Avg)</CardTitle>
            <HeartPulse className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.14%</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Below Industry Benchmark</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mortality Trend Analysis</CardTitle>
                <CardDescription>Daily mortality percentage vs healthy baseline</CardDescription>
              </div>
              <Badge variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-100">Live Telemetry</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.mortalityTrend}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Center */}
        <div className="space-y-6">
          <Card className="shadow-sm border-rose-100 bg-rose-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-700">
                <AlertCircle className="w-4 h-4" /> Active Outbreaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentCases.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-rose-100 shadow-sm animate-in slide-in-from-right duration-500">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{c.disease}</div>
                    <div className="text-xs text-gray-500">Flock: {c.batch}</div>
                  </div>
                  <Badge className={c.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}>
                    {c.severity}
                  </Badge>
                </div>
              ))}
              <Button variant="link" className="text-rose-600 text-xs w-full">View Outbreak Map</Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4" /> Today's Vaccinations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                <div className="bg-emerald-100 p-2 rounded-full"><Droplet className="w-4 h-4 text-emerald-600" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Gumboro Booster</div>
                  <div className="text-xs text-gray-500">Scheduled: 09:00 AM</div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-indigo-600">Start</Button>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                <div className="bg-indigo-100 p-2 rounded-full"><Zap className="w-4 h-4 text-indigo-600" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Newcastle (Lasota)</div>
                  <div className="text-xs text-gray-500">Overdue: 2hrs</div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 text-rose-600">Urgent</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-purple-500" /> Clinical Prescription Queue
              </CardTitle>
              <CardDescription>Track fulfillment of medical orders by the Pharmacy</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/veterinary/prescription/new')}>New Prescription</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>ORDER #</TableHead>
                  <TableHead>ITEM / DOSE</TableHead>
                  <TableHead>FARM / FLOCK</TableHead>
                  <TableHead>ADMIN ROUTE</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Normally fetched from vetApi.getPrescriptions() */}
                <TableRow className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-gray-400">RX-8821</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">Amprolium 20%</span>
                      <span className="text-[10px] text-gray-400 font-medium">1.5g / L</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">Ababiya Farm</span>
                      <span className="text-[10px] text-gray-500 underline font-bold uppercase tracking-widest">FLK-2024-08</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-indigo-200 text-indigo-700">In Water</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">DISPENSED</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-gray-400">RX-9104</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">Oxytetracycline</span>
                      <span className="text-[10px] text-gray-400 font-medium">100ml Injection</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">Central Hub</span>
                      <span className="text-[10px] text-gray-500 underline font-bold uppercase tracking-widest">FLK-2024-12</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700">Injection</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">SUBMITTED</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Biological Security
            </CardTitle>
            <CardDescription>Withdrawal compliance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-black text-rose-700 uppercase tracking-widest">LOCKED FLOCKS</p>
                  <p className="text-2xl font-black text-rose-900">2</p>
                </div>
                <AlertCircle className="h-5 w-5 text-rose-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-rose-600">FLK-2024-05</span>
                  <span className="text-rose-800">4 Days Remaining</span>
                </div>
                <Progress value={60} className="h-1 bg-rose-200" />
              </div>
            </div>

            <Button variant="outline" className="w-full text-xs font-bold rounded-xl h-10 border-gray-200 text-gray-600">
              View Biosecurity Map
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" /> Historical Diagnostic Logs
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Download History</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Date</TableHead>
                <TableHead>Flock Batch</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Findings / Clinical Summary</TableHead>
                <TableHead className="text-right">Verdict</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-xs font-medium text-gray-600">2024-06-15</td>
                <td className="py-4 font-bold text-gray-900">FLK-2024-08</td>
                <td className="py-4 italic text-rose-600 font-bold uppercase text-[10px]">Necropsy</td>
                <td className="py-4 text-xs text-gray-500">Suspected Gumboro in 15% of flock. Acute liver hemorrhage detected. High risk.</td>
                <td className="py-4 text-right"><Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">Critical</Badge></td>
              </TableRow>
              <TableRow className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 text-xs font-medium text-gray-600">2024-06-14</td>
                <td className="py-4 font-bold text-gray-900">FLK-2024-12</td>
                <td className="py-4 text-indigo-600 font-bold uppercase text-[10px]">Treatment</td>
                <td className="py-4 text-xs text-gray-500">Scheduled Tylosin administration complete. Beginning 7-day withdrawal period.</td>
                <td className="py-4 text-right"><Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">Monitoring</Badge></td>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeterinaryDashboard;
