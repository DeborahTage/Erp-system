import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function StockIn() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ itemId: '', quantity: '', batchNumber: '', unitCost: '', expiryDate: '', storageZone: '', shelfLocation: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/inventory/items')
            .then(r => {
                const data = r.data;
                if (Array.isArray(data)) setItems(data);
                else if (data && Array.isArray(data.content)) setItems(data.content);
                else setItems([]);
            })
            .catch(() => setItems([]));
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.itemId || !form.quantity) return setError('Item and quantity are required.');
        setLoading(true); setMsg(''); setError('');
        try {
            await axios.post('/api/inventory/stock-in', { ...form, itemId: parseInt(form.itemId), quantity: parseFloat(form.quantity), unitCost: parseFloat(form.unitCost) || undefined });
            setMsg(`✓ Stock received! ${form.quantity} units added.`);
            setForm({ itemId: '', quantity: '', batchNumber: '', unitCost: '', expiryDate: '', storageZone: '', shelfLocation: '' });
        } catch (e) { setError(e.response?.data?.message || 'Stock in failed.'); }
        finally { setLoading(false); }
    };

    const inp = 'w-full border p-2.5 rounded focus:ring-2 focus:ring-green-400 focus:outline-none';

    return (
        <div className="p-6 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">➕ Stock In (Receive)</h1>
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 text-sm">{msg}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-4 bg-white border rounded-xl p-6 shadow-sm">
                <div>
                    <label className="text-sm font-medium text-gray-700">Item *</label>
                    <select value={form.itemId} onChange={e => setForm({ ...form, itemId: e.target.value })} className={inp} required>
                        <option value="">Select item...</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.itemName} ({i.sku})</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-gray-700">Quantity *</label><input type="number" step="0.01" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required className={inp} placeholder="0.00" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Unit Cost (Birr)</label><input type="number" step="0.01" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: e.target.value })} className={inp} placeholder="0.00" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-gray-700">Batch Number</label><input value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })} className={inp} placeholder="Optional" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Expiry Date</label><input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className={inp} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-gray-700">Storage Zone</label><input value={form.storageZone} onChange={e => setForm({ ...form, storageZone: e.target.value })} className={inp} placeholder="e.g. Cold Room A" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Shelf Location</label><input value={form.shelfLocation} onChange={e => setForm({ ...form, shelfLocation: e.target.value })} className={inp} placeholder="e.g. A-12-3" /></div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition">
                    {loading ? 'Recording Receipt...' : 'Receive Stock'}
                </button>
            </form>
        </div>
    );
}
