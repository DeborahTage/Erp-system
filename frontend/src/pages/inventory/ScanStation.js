import React, { useState, useRef } from 'react';
import axios from '../../api/axios';

const ACTIONS = ['RECEIVE', 'ISSUE', 'TRANSFER', 'COUNT', 'RETURN'];

export default function ScanStation() {
    const [input, setInput] = useState('');
    const [scanned, setScanned] = useState(null);
    const [action, setAction] = useState('RECEIVE');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef();

    const doScan = async () => {
        if (!input.trim()) return;
        setError(''); setSuccess('');
        setLoading(true);
        try {
            const res = await axios.get(`/api/inventory/scan/${input.trim()}`);
            setScanned(res.data);
        } catch (e) {
            setError('Item not found. Check barcode or SKU.');
            setScanned(null);
        } finally { setLoading(false); }
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') doScan(); };

    const submitAction = async (e) => {
        e.preventDefault();
        const form = e.target;
        const payload = {
            barcode: input,
            action,
            quantity: form.quantity.value,
            destination: form.destination?.value || '',
            batchNumber: form.batchNumber?.value || '',
            expiryDate: form.expiryDate?.value || '',
            unitCost: form.unitCost?.value || '',
            storageZone: form.storageZone?.value || '',
        };
        setLoading(true); setError('');
        try {
            await axios.post('/api/inventory/scan-action', payload);
            setSuccess(`${action} completed successfully!`);
            setScanned(null); setInput('');
            inputRef.current?.focus();
        } catch (e) {
            setError(e.response?.data?.message || `${action} failed — check stock levels.`);
        } finally { setLoading(false); }
    };

    const isExpiringSoon = (date) => date && new Date(date) < new Date(Date.now() + 30 * 86400000);

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-center">📦 Scan Station</h1>
            <p className="text-gray-500 text-center text-sm mb-6">Scan barcode, RFID tag, or enter SKU manually</p>

            <div className="flex gap-2 mb-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    autoFocus
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Scan barcode / RFID / SKU..."
                    className="flex-1 text-lg p-3 border-2 border-blue-400 rounded focus:outline-none focus:border-blue-600 text-center"
                />
                <button onClick={doScan} disabled={loading}
                    className="bg-blue-600 text-white px-5 py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? '...' : 'Scan'}
                </button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 text-sm">✓ {success}</div>}

            {scanned && (
                <div className="bg-white border rounded-lg p-6 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{scanned.item?.itemName}</h2>
                            <p className="text-gray-400 text-sm">SKU: {scanned.item?.sku} | Barcode: {scanned.item?.barcode || '—'}</p>
                            <p className="text-lg font-semibold mt-1">Current Stock: <span className="text-blue-700">{scanned.item?.currentStock} {scanned.item?.unit}</span></p>
                            <p className="text-sm text-gray-500">Location: {scanned.item?.storageZone || '—'} / {scanned.item?.shelfLocation || '—'}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">{scanned.item?.availableStock ?? scanned.item?.currentStock}</div>
                            <div className="text-xs text-gray-500">Available</div>
                        </div>
                    </div>

                    {/* Batch list */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2 text-sm text-gray-700">Available Batches (FEFO order)</h3>
                        {(scanned.batches || []).map(b => (
                            <div key={b.id} className={`flex justify-between px-3 py-2 rounded mb-1 text-sm ${isExpiringSoon(b.expiryDate) ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                                <span className="font-mono font-medium">{b.batchNumber}</span>
                                <span>Qty: <strong>{b.quantityRemaining}</strong></span>
                                {b.expiryDate && <span className={`text-xs ${isExpiringSoon(b.expiryDate) ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>Exp: {b.expiryDate}</span>}
                            </div>
                        ))}
                        {(!scanned.batches || scanned.batches.length === 0) && <p className="text-gray-400 text-sm">No available batches</p>}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-5 gap-1 mb-4">
                        {ACTIONS.map(a => (
                            <button key={a} onClick={() => setAction(a)}
                                className={`py-2 rounded text-xs font-semibold transition ${action === a ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {a}
                            </button>
                        ))}
                    </div>

                    {/* Action form */}
                    <form onSubmit={submitAction} className="space-y-3">
                        <input name="quantity" type="number" step="0.01" required placeholder="Quantity *" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                        {action === 'RECEIVE' && <>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="batchNumber" placeholder="Batch Number" className="border p-2 rounded focus:outline-none" />
                                <input name="unitCost" type="number" step="0.01" placeholder="Unit Cost (Birr)" className="border p-2 rounded focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="expiryDate" type="date" placeholder="Expiry Date" className="border p-2 rounded focus:outline-none" />
                                <input name="storageZone" placeholder="Storage Zone" className="border p-2 rounded focus:outline-none" />
                            </div>
                        </>}
                        {action === 'TRANSFER' && <input name="destination" placeholder="Destination Location" className="w-full border p-2 rounded focus:outline-none" />}
                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-700 text-white py-3 rounded font-bold hover:bg-blue-800 disabled:opacity-50 transition">
                            {loading ? 'Processing...' : `Confirm ${action}`}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
