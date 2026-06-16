import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, CheckCircle2, Clock,
    AlertCircle, ChevronLeft, ChevronRight, Zap,
    Droplet, ShieldCheck, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { vetApi } from '../../api';
import { formatDate } from '../../utils';

const VaccinationCalendar = () => {
    const [tasks, setTasks] = useState([
        { id: 1, vaccine: 'Newcastle B1', flock: 'FLK-2024-001', date: '2024-06-16', status: 'PENDING', type: 'EYE DROP' },
        { id: 2, vaccine: 'Gumboro IBD', flock: 'FLK-2024-002', date: '2024-06-16', status: 'PENDING', type: 'WATER' },
        { id: 3, vaccine: 'Fowl Pox', flock: 'FLK-2024-003', date: '2024-06-15', status: 'MISSED', type: 'INJECTION' },
        { id: 4, vaccine: 'Marek', flock: 'FLK-2024-005', date: '2024-06-14', status: 'COMPLETED', type: 'INJECTION' },
    ]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PENDING': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'MISSED': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Vaccination Task Calendar</h1>
                    <p className="text-gray-500 text-sm">Automated scheduling based on poultry age and breed templates</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-gray-50 px-3 h-10">
                        <ChevronLeft className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                        <span className="px-4 font-bold text-sm text-gray-600">June 2024</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                    </div>
                    <Button className="bg-indigo-600">Manage Templates</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center font-bold text-xs uppercase tracking-widest text-gray-400 py-2">
                        {day}
                    </div>
                ))}

                {/* Simplified Calendar Grid Layout */}
                {Array.from({ length: 31 }).map((_, i) => (
                    <Card key={i} className={`h-32 shadow-none border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer ${i === 15 ? 'bg-indigo-50/30 ring-2 ring-indigo-500 ring-inset ring-opacity-50' : 'bg-white'}`}>
                        <div className="p-2 text-right text-xs font-bold text-gray-400">{i + 1}</div>
                        <div className="px-1 space-y-1">
                            {i === 15 && (
                                <>
                                    <div className="bg-indigo-600 text-white text-[10px] p-1 rounded font-bold truncate">Gumboro ...</div>
                                    <div className="bg-amber-500 text-white text-[10px] p-1 rounded font-bold truncate">Newcastle ...</div>
                                </>
                            )}
                            {i === 14 && <div className="bg-emerald-500 text-white text-[10px] p-1 rounded font-bold truncate">Completed...</div>}
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="shadow-sm border-gray-100 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Detailed Agenda</CardTitle>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="text-[10px]">ALL FLOCKS</Badge>
                            <Badge variant="outline" className="text-[10px]">PENDING ONLY</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/20 text-gray-400 border-b">
                            <tr>
                                <th className="p-4 font-medium">Scheduled Date</th>
                                <th className="p-4 font-medium">Vaccine</th>
                                <th className="p-4 font-medium">Target Flock</th>
                                <th className="p-4 font-medium">Administration</th>
                                <th className="p-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tasks.map(task => (
                                <tr key={task.id} className="hover:bg-gray-50/50 group transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{task.date}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{task.vaccine}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Code: VAX-{(1000 + task.id)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-mono text-xs">{task.flock}</Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            {task.type === 'WATER' ? <Droplet className="w-3 h-3 text-blue-400" /> : <Zap className="w-3 h-3 text-indigo-400" />}
                                            {task.type}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Badge className={`${getStatusStyles(task.status)} font-bold`}>{task.status}</Badge>
                                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 px-2 text-indigo-600">Update</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default VaccinationCalendar;
