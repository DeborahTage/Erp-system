import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Forecasting() {
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/inventory/items').then(r => setItems(r.data || [])).catch(() => { });
    }, []);

    const loadForecast = async (id) => {
        if (!id) return;
        setSelectedId(id); setLoading(true);
        try {
            const res = await axios.get(`/api/inventory/forecast/${id}`);
            setForecast(res.data);
        } catch (e) { setForecast(null); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Demand Forecasting</h1>

            <select onChange={e => loadForecast(e.target.value)} value={selectedId}
                className="w-full mb-6 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">-- Select an inventory item --</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.itemName} ({i.sku})</option>)}
            </select>

            {loading && <div className="text-center py-10 text-gray-400">Calculating forecast...</div>}

            {forecast && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border rounded shadow-sm p-4">
                        <h2 className="text-lg font-bold mb-4">Forecast Summary</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Predicted Demand (next month)', value: forecast.predictedDemand?.toFixed(2) },
                                { label: 'Trend', value: `${forecast.trend >= 0 ? '↑ +' : '↓ '}${Math.abs(forecast.trend || 0).toFixed(2)}`, color: forecast.trend >= 0 ? 'text-green-600' : 'text-red-600' },
                                { label: 'Confidence Score', value: `${((forecast.confidenceScore || 0) * 100).toFixed(0)}%` },
                                { label: 'Recommended Order Qty', value: forecast.recommendedOrder?.toFixed(2), color: 'text-blue-700 font-bold text-lg' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b">
                                    <span className="text-gray-600 text-sm">{label}</span>
                                    <span className={`font-semibold ${color || ''}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => alert('Creating Draft PO for recommended quantity...')}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium">
                            Create PO for Recommended Qty
                        </button>
                    </div>

                    <div className="bg-white border rounded shadow-sm p-4">
                        <h2 className="text-lg font-bold mb-4">Projected Demand</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={[
                                { month: 'Now', qty: forecast.predictedDemand || 0 },
                                { month: '+1mo', qty: (forecast.predictedDemand || 0) + (forecast.trend || 0) },
                                { month: '+2mo', qty: (forecast.predictedDemand || 0) + (forecast.trend || 0) * 2 },
                                { month: '+3mo', qty: (forecast.predictedDemand || 0) + (forecast.trend || 0) * 3 },
                            ]}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="qty" stroke="#3b82f6" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-gray-400 mt-2 text-center">Based on moving average algorithm using 90-day sales data</p>
                    </div>
                </div>
            )}

            {!forecast && !loading && selectedId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-6 text-yellow-800 text-center">
                    No historical sales data found for forecasting. Add stock movements to enable predictions.
                </div>
            )}
        </div>
    );
}
