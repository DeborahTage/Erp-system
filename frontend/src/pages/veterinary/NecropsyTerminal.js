import React, { useState } from 'react';
import {
    Microscope, Heart, Info, Clipboard,
    Camera, FileText, CheckCircle2, ChevronRight,
    Flame, Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';

const NecropsyTerminal = () => {
    const [step, setStep] = useState(1);

    const organSections = [
        { id: 'heart', label: 'Heart & Pericardium', icon: <Heart className="w-4 h-4 text-rose-500" /> },
        { id: 'liver', label: 'Liver & Gallbladder', icon: <Info className="w-4 h-4 text-emerald-500" /> },
        { id: 'lungs', label: 'Lungs & Air Sacs', icon: <Info className="w-4 h-4 text-blue-500" /> },
        { id: 'gizzard', label: 'Gizzard & Proventriculus', icon: <Info className="w-4 h-4 text-amber-500" /> },
        { id: 'spleen', label: 'Spleen', icon: <Info className="w-4 h-4 text-indigo-500" /> },
        { id: 'intestine', label: 'Intestinal Tract', icon: <Info className="w-4 h-4 text-orange-500" /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-rose-600 p-3 rounded-xl text-white shadow-lg shadow-rose-200">
                        <Microscope className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Forensic Necropsy Terminal</h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Case ID: NC-{(new Date().getTime().toString().slice(-6))}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-gray-500 font-bold">CANCEL</Button>
                    <Button className="bg-rose-600 hover:bg-rose-700 shadow-md">SUBMIT FINAL REPORT</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* STEPPER SIDEBAR */}
                <Card className="lg:col-span-1 shadow-sm border-gray-100 h-fit">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-gray-400">Biological Audit Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                        {['Flock Context', 'External Examination', 'Systemic Organ Check', 'Final Diagnosis'].map((label, i) => (
                            <div
                                key={i}
                                onClick={() => setStep(i + 1)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${step === i + 1 ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === i + 1 ? 'border-white bg-indigo-500' : 'border-gray-300'}`}>
                                    {i + 1}
                                </div>
                                <span className="text-sm">{label}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* MAIN FORM AREA */}
                <div className="lg:col-span-3 space-y-6">

                    {step === 1 && (
                        <Card className="shadow-sm border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
                            <CardHeader>
                                <CardTitle>Flock Contextual Data</CardTitle>
                                <CardDescription>Register birds for necropsy from affected flocks</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Select Affected Flock</label>
                                        <Select>
                                            <SelectTrigger className="font-semibold text-gray-700 h-12 bg-gray-50 border-gray-200">
                                                <SelectValue placeholder="Choose a flock..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FLK-001">FLK-2024-001 (ISA Brown)</SelectItem>
                                                <SelectItem value="FLK-005">FLK-2024-005 (Broiler)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Number of Specimens</label>
                                        <Input type="number" placeholder="Enter count..." className="h-12 bg-gray-50 border-gray-200 font-semibold" />
                                    </div>
                                </div>
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex gap-3">
                                    <Info className="w-5 h-5 flex-shrink-0" />
                                    <p>Ensure bio-security protocols are maintained in the necropsy lab. Use full structural PPE before internal examination.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {organSections.map(section => (
                                    <Card key={section.id} className="shadow-sm border-gray-100 hover:border-indigo-200 transition-all group">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 group-hover:bg-indigo-50/20">
                                            <div className="flex items-center gap-2">
                                                {section.icon}
                                                <CardTitle className="text-sm font-bold text-gray-700 uppercase">{section.label}</CardTitle>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-300 hover:text-indigo-600">
                                                <Camera className="w-4 h-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <Textarea
                                                placeholder={`Record pathological observations for ${section.label}...`}
                                                className="min-h-[80px] bg-gray-50/50 border-gray-100 text-sm focus:bg-white transition-all"
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                        <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>PREVIOUS</Button>
                        <Button className="bg-indigo-600" onClick={() => setStep(Math.min(4, step + 1))}>
                            {step === 4 ? 'FINALIZE REPORT' : 'CONTINUE TO NEXT SECTION'} <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NecropsyTerminal;
