import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

function StatusBadge({ value }) {
    const colors = { Draft: 'bg-gray-100 text-gray-700', Sent: 'bg-blue-100 text-blue-700', Partial: 'bg-yellow-100 text-yellow-700', Received: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-500', Cancelled: 'bg-red-100 text-red-700' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[value] || 'bg-gray-100'}`}>{value}</span>;
}

export default function PurchaseOrders() {
    const [pos, setPos] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ poNumber: '', supplierId: '', itemId: '', qty: '', unitPrice: '' });

    useEffect(() => {
        fetchPOs();
        axios.get('/api/inventory/items').then(r => setItems(r.data || [])).catch(() => { });
    }, []);

    const fetchPOs = () => axios.get('/api/inventory/purchase-orders').then(r => setPos(r.data || [])).catch(() => { });

    const createPO = async () => {
        try {
            await axios.post('/api/inventory/purchase-orders', {
                poNumber: form.poNumber || 'PO-' + Date.now(),
                supplier: { id: parseInt(form.supplierId) }
            });
            setShowCreate(false);
            fetchPOs();
        } catch (e) { alert('Failed to create PO'); }
    };

    const sendPO = async (id) => {
        await axios.put(`/api/inventory/purchase-orders/${id}/send`);
        fetchPOs();
    };

    const receivePO = async (id) => {
        await axios.put(`/api/inventory/purchase-orders/${id}/receive`);
        fetchPOs();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
                <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">+ Create PO</button>
            </div>

            {showCreate && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">New Purchase Order</h2>
                        <div className="space-y-3">
                            <input placeholder="PO Number (leave blank to auto-generate)" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, poNumber: e.target.value })} />
                            <input placeholder="Supplier ID" type="number" className="w-full border p-2 rounded" onChange={e => setForm({ ...form, supplierId: e.target.value })} />
                            <div className="flex gap-2 mt-4">
                                <button onClick={createPO} className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Create</button>
                                <button onClick={() => setShowCreate(false)} className="flex-1 border py-2 rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded shadow-sm border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {['PO Number', 'Supplier', 'Status', 'Total Amount', 'Expected Delivery', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-gray-600">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pos.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs font-bold text-blue-700">{po.poNumber}</td>
                                <td className="px-4 py-3">{po.supplier?.name || '—'}</td>
                                <td className="px-4 py-3"><StatusBadge value={po.status} /></td>
                                <td className="px-4 py-3">{po.totalAmount ? `${po.totalAmount.toFixed(2)} Birr` : '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{po.expectedDelivery || '—'}</td>
                                <td className="px-4 py-3 space-x-2">
                                    {po.status === 'Draft' && <button onClick={() => sendPO(po.id)} className="text-blue-600 hover:underline text-xs font-medium">Send</button>}
                                    {po.status === 'Sent' && <button onClick={() => receivePO(po.id)} className="text-green-600 hover:underline text-xs font-medium">Receive</button>}
                                    {po.status === 'Received' && <span className="text-green-600 text-xs">✓ Received</span>}
                                </td>
                            </tr>
                        ))}
                        {pos.length === 0 && <tr><td colSpan="6" className="py-10 text-center text-gray-400">No purchase orders yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
