import React, { useEffect, useState } from 'react';
import { crmApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await crmApi.getOrders();
                setOrders(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400 font-bold">Retrieving Orders...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <PageHeader title="Sales & Orders" subtitle="Manage customer egg and meat orders with live delivery status tracking." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-indigo-600 border-none rounded-3xl p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
                            <h3 className="text-3xl font-black">{orders.length}</h3>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-indigo-400 opacity-50" />
                    </div>
                </Card>
                {/* Stats cards omitted for brevity, would be added here */}
            </div>

            <div className="space-y-4">
                {orders.map(order => (
                    <Card key={order.id} className="border-none shadow-xl rounded-[2rem] bg-white group hover:scale-[1.01] transition-transform overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <ShoppingBag className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-gray-900">Order #{order.id}</h3>
                                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                </div>
                                <p className="text-sm font-bold text-gray-400">{order.client?.clientName} • {order.orderDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</p>
                                <p className="text-xl font-black text-indigo-600">${order.totalAmount?.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </button>
                                <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors">
                                    <Truck className="h-5 w-5 text-indigo-600" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default OrderDashboard;
