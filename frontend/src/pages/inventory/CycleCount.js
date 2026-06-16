import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function CycleCount() {
    const [items, setItems] = useState([]);
    const [countedItem, setCountedItem] = useState('');
    const [countedQty, setCountedQty] = useState('');
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { axios.get('/api/inventory/items').then(r => setItems(r.data || [])).catch(() => { }); }, []);

    const startCount = async (e) => {
        e.preventDefault();
        if (!countedItem || !countedQty) return;
        setLoading(true); setMsg('');
        try {
            const res = await axios.post('/api/inventory/count', { itemId: parseInt(countedItem), countedQty: parseFloat(countedQty) });
            setResult(res.data);
        } catch (e) { setMsg('Error recording count.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">🔢 Cycle Count</h1>
            <p className="text-gray-500 text-sm mb-6">Physically count an item and record it to track variances.</p>

            <form onSubmit={startCount} className="bg-white border rounded-xl p-6 shadow-sm space-y-4 mb-6">
                <div>
                    <label className="text-sm font-medium text-gray-700">Item to Count *</label>
                    <select value={countedItem} onChange={e => setCountedItem(e.target.value)} className="w-full border p-2.5 rounded" required>
                        <option value="">Select item...</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.itemName} (Expected: {i.currentStock} {i.unit})</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Physical Count (Actual Qty) *</label>
                    <input type="number" step="0.01" value={countedQty} onChange={e => setCountedQty(e.target.value)} required className="w-full border p-2.5 rounded" placeholder="0.00" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Record Count'}
                </button>
            </form>

            {result && (
                <div className={`border rounded-xl p-6 ${result.variance === 0 ? 'bg-green-50 border-green-200' : result.variance < 0 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <h2 className="text-lg font-bold mb-3">Count Result</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Expected Qty</span><span className="font-semibold">{result.expectedQty}</span></div>
                        <div className="flex justify-between"><span>Counted Qty</span><span className="font-semibold">{result.countedQty}</span></div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-bold">Variance</span>
                            <span className={`font-bold text-lg ${result.variance === 0 ? 'text-green-600' : result.variance < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                {result.variance >= 0 ? '+' : ''}{result.variance}
                            </span>
                        </div>
                    </div>
                    {result.variance !== 0 && (
                        <button className="mt-4 w-full bg-white border py-2 rounded font-medium text-sm hover:bg-gray-50">
                            Request Adjustment Approval
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
