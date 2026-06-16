import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { pharmacyApi } from '../../api';
import { formatCurrency } from '../../utils';
import { Button } from '../../components/ui/button';
import {
    Users, UserPlus, Search, Phone, MapPin,
    History, CreditCard, ExternalLink, Activity,
    Layers, Package
} from 'lucide-react';
import { Input } from '../../components/ui/input';

const PharmacyCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await pharmacyApi.getCustomers();
            setCustomers(res.data || []);
        } catch (e) {
            console.error('Failed to fetch customers', e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    );

    const getCustomerTypeBadge = (type) => {
        switch (type) {
            case 'WHOLESALE': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Wholesale</Badge>;
            case 'PARTNER_FARM': return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Partner Farm</Badge>;
            default: return <Badge variant="secondary">Retail</Badge>;
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Activity className="animate-spin text-indigo-600 h-8 w-8" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <PageHeader
                title="Customer CRM"
                subtitle="Manage commercial clients, credit accounts, and purchase history"
            />

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or phone..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Commercial Clients</CardTitle>
                        <CardDescription>Directory of all registered farmers and corporate partners</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Customer Code</TableHead>
                                    <TableHead>Name / Entity</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Outstanding Balance</TableHead>
                                    <TableHead>Credit Limit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-mono text-xs text-gray-500">{customer.customerCode}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{customer.name}</span>
                                                <span className="text-xs text-gray-500">{customer.farmName || 'Private Client'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getCustomerTypeBadge(customer.customerType)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-gray-600">
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer.address?.substring(0, 20)}...</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={customer.outstandingBalance > 0 ? "text-rose-600 font-bold" : "text-gray-400"}>
                                                {formatCurrency(customer.outstandingBalance)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-500">{formatCurrency(customer.creditLimit)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" className="h-8 border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                                    <History className="h-3.3 w-3 h-3 mr-1" /> History
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 text-gray-400">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-gray-500 italic">
                                            No customers found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PharmacyCustomers;
