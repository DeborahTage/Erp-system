import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

function StatCard({ title, value, color }) {
    const bgColors = {
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        orange: 'bg-orange-100 text-orange-800'
    };
    return (
        <div className={`p-4 rounded-lg shadow-sm border border-gray-200 bg-white`}>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className={`text-2xl font-bold mt-2 py-1 px-2 inline-block rounded ${bgColors[color] || 'bg-gray-100 text-gray-800'}`}>
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ value }) {
    const colors = {
        Pending: 'bg-yellow-200 text-yellow-800',
        Dispensed: 'bg-green-200 text-green-800',
        Verified: 'bg-blue-200 text-blue-800'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[value] || 'bg-gray-200'}`}>{value}</span>;
}

function SeverityBadge({ value }) {
    const colors = {
        Low: 'bg-gray-200 text-gray-800',
        Medium: 'bg-yellow-200 text-yellow-800',
        High: 'bg-orange-200 text-orange-800',
        Critical: 'bg-red-200 text-red-800'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[value] || 'bg-gray-200'}`}>{value}</span>;
}

export default function PharmacyOverview() {
    const [pendingRx, setPendingRx] = useState([]);
    const [todaySales, setTodaySales] = useState({ total: 0 });
    const [lowStock, setLowStock] = useState([]);
    const [durAlerts, setDurAlerts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rxRes, salesRes, durRes] = await Promise.all([
                axios.get('/api/pharmacy/prescriptions?status=Pending'),
                axios.get('/api/pharmacy/sales/today'),
                // low-stock might not be an endpoint yet, ignore or mock
                // axios.get('/api/pharmacy/low-stock'),
                axios.get('/api/pharmacy/dur-alerts?resolved=false')
            ]);
            setPendingRx(rxRes.data);
            setTodaySales(salesRes.data || { total: 0 });
            setDurAlerts(durRes.data || []);
        } catch (error) {
            console.error('Error fetching pharmacy data:', error);
        }
    };

    const processPrescription = (id) => {
        window.location.href = `/pharmacy/process-rx?rxId=${id}`;
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Pharmacy Overview</h1>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard title="Pending Prescriptions" value={pendingRx.length} color="yellow" />
                <StatCard title="Today's Sales" value={`${todaySales.total?.toFixed(2) || 0} Birr`} color="green" />
                <StatCard title="Low Stock Alerts" value={lowStock.length} color="red" />
                <StatCard title="DUR Warnings" value={durAlerts.length} color="orange" />
            </div>

            <div className="bg-white rounded shadow-sm border p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Pending Prescriptions</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Rx Code</th>
                            <th className="py-2">Patient</th>
                            <th className="py-2">Diagnosis</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRx.map(rx => (
                            <tr key={rx.id} className="border-b">
                                <td className="py-2">{rx.prescriptionCode}</td>
                                <td className="py-2">{rx.patient?.patientName}</td>
                                <td className="py-2">{rx.diagnosis}</td>
                                <td className="py-2"><StatusBadge value={rx.status} /></td>
                                <td className="py-2">
                                    <button onClick={() => processPrescription(rx.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                        Process
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pendingRx.length === 0 && <tr><td colSpan="5" className="py-4 text-center text-gray-500">No pending prescriptions</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded shadow-sm border p-4">
                <h2 className="text-lg font-bold mb-4">Drug Utilization Review Alerts</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Type</th>
                            <th className="py-2">Severity</th>
                            <th className="py-2">Message</th>
                            <th className="py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {durAlerts.map(alert => (
                            <tr key={alert.id} className="border-b">
                                <td className="py-2">{alert.alertType}</td>
                                <td className="py-2"><SeverityBadge value={alert.severity} /></td>
                                <td className="py-2">{alert.message}</td>
                                <td className="py-2">{new Date(alert.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {durAlerts.length === 0 && <tr><td colSpan="4" className="py-4 text-center text-gray-500">No DUR alerts</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
