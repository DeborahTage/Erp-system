import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { requisitionApi } from '../../api';
import { formatCurrency } from '../../utils';
import { Button } from '../../components/ui/button';
import { CheckCircle2, Clock, PlayCircle, Loader2 } from 'lucide-react';

const RequisitionCenter = () => {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequisitions();
    }, []);

    const fetchRequisitions = async () => {
        try {
            const res = await requisitionApi.getAll();
            setRequisitions(res.data || []);
        } catch (e) {
            console.error('Failed to fetch requisitions', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessing(id);
        try {
            await requisitionApi.approve(id);
            await fetchRequisitions();
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    };

    const handleIssue = async (id) => {
        setProcessing(id);
        try {
            await requisitionApi.issue(id);
            await fetchRequisitions();
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'REQUESTED': return <Badge variant="warning" className="flex gap-1 items-center"><Clock className="w-3 h-3" /> Requested</Badge>;
            case 'APPROVED': return <Badge variant="outline" className="flex gap-1 items-center text-indigo-600 border-indigo-200 bg-indigo-50"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
            case 'ISSUED': return <Badge variant="outline" className="flex gap-1 items-center text-emerald-600 border-emerald-200 bg-emerald-50"><PlayCircle className="w-3 h-3" /> Issued</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <PageHeader
                title="Internal Requisitions"
                subtitle="Manage farm and operational consumptions"
            />

            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Requisition Workflow</CardTitle>
                            <CardDescription>Allocate central warehouse inventory directly to farms and barns</CardDescription>
                        </div>
                        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                            New Requisition
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead>Req #</TableHead>
                                <TableHead>Target Allocation</TableHead>
                                <TableHead>Date Requested</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requisitions.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-mono font-medium text-gray-700">{req.requisitionNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{req.farm?.name || 'Central Facility'}</span>
                                            <span className="text-xs text-gray-500">{req.barn ? req.barn.name : 'General Maintenance'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {new Date(req.requestedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{req.items?.length || 0} items</Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-700">
                                        {formatCurrency(req.totalValue)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(req.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {req.status === 'REQUESTED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={processing === req.id}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {req.status === 'APPROVED' && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => handleIssue(req.id)}
                                                    disabled={processing === req.id}
                                                >
                                                    Issue Stock
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-900">
                                                Details
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requisitions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                        No active requisitions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequisitionCenter;
