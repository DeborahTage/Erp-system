import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS, canPerformAction } from '../../lib/permissions';

function StatCard({ title, value, color }) {
    const bg = { green: 'bg-green-50 border-green-200', yellow: 'bg-yellow-50 border-yellow-200', red: 'bg-red-50 border-red-200', orange: 'bg-orange-50 border-orange-200' };
    const text = { green: 'text-green-800', yellow: 'text-yellow-800', red: 'text-red-800', orange: 'text-orange-800' };
    return (
        <div className={`p-4 rounded-lg shadow-sm border ${bg[color] || 'bg-white border-gray-200'}`}>
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">{title}</h3>
            <p className={`text-2xl font-bold mt-1 ${text[color] || 'text-gray-800'}`}>{value}</p>
        </div>
    );
}

export default function InventoryOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [lowStock, setLowStock] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('/api/inventory/stats'),
            axios.get('/api/inventory/low-stock'),
            axios.get('/api/inventory/expiring'),
            axios.get('/api/inventory/movements/recent')
        ]).then(([s, l, e, m]) => {
            setStats(s.data || {});
            setLowStock(l.data || []);
            setExpiring(e.data || []);
            setMovements((m.data || []).slice(0, 7).map(mv => ({
                name: mv.item?.itemName || 'Unknown',
                qty: mv.quantity || 0
            })));
        }).catch(err => console.error(err));
    }, []);

    const createQuickPO = (itemId) => alert(`Creating draft PO for item ${itemId}...`);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Command Center</h1>
                <div className="flex gap-2">
                    {canPerformAction(user?.role, 'stockIn', 'inventoryItems') && (
                        <>
                            <a href="/inventory/scan" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Scan Station</a>
                            <a href="/inventory/stock-in" className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">Stock In</a>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total SKUs" value={stats.totalSkus || 0} color="green" />
                <StatCard title="Total Value" value={`${(stats.totalValue || 0).toFixed(2)} Birr`} color="green" />
                <StatCard title="Low Stock Alerts" value={stats.lowStockCount || 0} color="red" />
                <StatCard title="Expiring (30d)" value={stats.expiringCount || 0} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded shadow-sm border p-4">
                    <h2 className="text-lg font-bold mb-4">Recent Stock Movements</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={movements}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="qty" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded shadow-sm border p-4">
                    <h2 className="text-lg font-bold mb-4 text-red-700">⚠ Critical Stock Alerts</h2>
                    <div className="overflow-y-auto max-h-52">
                        <table className="w-full text-left text-sm">
                            <thead><tr className="border-b"><th className="py-1">SKU</th><th className="py-1">Item</th><th className="py-1">Stock</th><th className="py-1">Reorder At</th><th className="py-1"></th></tr></thead>
                            <tbody>
                                {lowStock.map(item => (
                                    <tr key={item.id} className="border-b hover:bg-red-50">
                                        <td className="py-2 font-mono text-xs">{item.sku}</td>
                                        <td className="py-2">{item.itemName}</td>
                                        <td className="py-2 font-bold text-red-600">{item.currentStock}</td>
                                        <td className="py-2 text-gray-500">{item.reorderPoint}</td>
                                        <td className="py-2">
                                            <button onClick={() => createQuickPO(item.id)} className="text-blue-600 text-xs font-medium hover:underline">Create PO</button>
                                        </td>
                                    </tr>
                                ))}
                                {lowStock.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-400">All stock levels healthy ✓</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border p-4">
                <h2 className="text-lg font-bold mb-4 text-orange-700">⏰ Expiring Batches (Next 30 Days)</h2>
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b"><th className="py-2">Item</th><th className="py-2">Batch #</th><th className="py-2">Qty Remaining</th><th className="py-2">Expiry Date</th><th className="py-2">Location</th></tr></thead>
                    <tbody>
                        {expiring.map(b => (
                            <tr key={b.id} className="border-b hover:bg-orange-50">
                                <td className="py-2">{b.item?.itemName}</td>
                                <td className="py-2 font-mono text-xs">{b.batchNumber}</td>
                                <td className="py-2">{b.quantityRemaining}</td>
                                <td className="py-2 text-orange-600 font-medium">{b.expiryDate}</td>
                                <td className="py-2 text-gray-500">{b.storageZone}</td>
                            </tr>
                        ))}
                        {expiring.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-400">No items expiring within 30 days ✓</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
