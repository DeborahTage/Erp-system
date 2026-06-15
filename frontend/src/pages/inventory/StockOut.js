import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function StockOut() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ itemId: '', quantity: '', reason: 'ISSUE', destination: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/inventory/items')
            .then(r => {
                const data = r.data;
                // Handle paginated Spring response {content: [...]} or plain array
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
            const res = await axios.post('/api/inventory/stock-out', { ...form, itemId: parseInt(form.itemId), quantity: parseFloat(form.quantity) });
            setMsg(`✓ Issued ${form.quantity} units. New stock: ${res.data.newStock}`);
            setForm({ itemId: '', quantity: '', reason: 'ISSUE', destination: '' });
        } catch (e) { setError(e.response?.data?.message || 'Insufficient stock or error.'); }
        finally { setLoading(false); }
    };

    const inp = 'w-full border p-2.5 rounded focus:ring-2 focus:ring-red-400 focus:outline-none';

    return (
        <div className="p-6 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">➖ Stock Out (Issue)</h1>
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 text-sm">{msg}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-4 bg-white border rounded-xl p-6 shadow-sm">
                <div>
                    <label className="text-sm font-medium text-gray-700">Item *</label>
                    <select value={form.itemId} onChange={e => setForm({ ...form, itemId: e.target.value })} className={inp} required>
                        <option value="">Select item...</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.itemName} (Stock: {i.currentStock} {i.unit})</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Quantity *</label>
                        <input type="number" step="0.01" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required className={inp} placeholder="0.00" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Reason</label>
                        <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className={inp}>
                            <option value="ISSUE">Issue to Barn</option>
                            <option value="SALE">Sale</option>
                            <option value="RETURN">Return</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="DAMAGED">Damaged</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Destination / Notes</label>
                    <input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className={inp} placeholder="e.g. Barn 3, Pharmacy, etc." />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition">
                    {loading ? 'Processing...' : 'Issue Stock'}
                </button>
            </form>
        </div>
    );
}
