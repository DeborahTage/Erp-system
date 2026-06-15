import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useLocation } from 'react-router-dom';

export default function ProcessPrescription() {
    const [rxCode, setRxCode] = useState('');
    const [rx, setRx] = useState(null);
    const [durResults, setDurResults] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRxId = queryParams.get('rxId');

    useEffect(() => {
        if (initialRxId) {
            processPrescriptionById(initialRxId);
        }
    }, [initialRxId]);

    const processPrescriptionById = async (id) => {
        try {
            const res = await axios.post(`/api/pharmacy/prescriptions/${id}/process`, {});
            setRx(res.data.prescription);
            setDurResults(res.data.durWarnings || []);
        } catch (err) {
            alert("Failed to process prescription. Ensure Vet ID is valid.");
        }
    };

    const processByCode = async () => {
        // If user typed in Vet Prescription ID manually
        processPrescriptionById(rxCode);
    };

    const handleDispense = async () => {
        try {
            // In a real scenario we'd specify items. Here we'll just trigger the sale flow.
            const saleData = {
                prescriptionId: rx.id,
                paymentMethod: 'Credit',
                customerName: rx.patient?.farmManagerName || 'Farm Manager',
                customerPhone: rx.patient?.contactPhone || '-',
                items: [] // usually you fetch items associated, dummy for now to make sale
            };
            const res = await axios.post(`/api/pharmacy/sales`, saleData);
            alert(`Dispensed successfully! Sale ID: ${res.data.saleCode}`);
            setRx(null);
            setDurResults([]);
        } catch (error) {
            alert("Error dispensing. Make sure stock is sufficient.");
        }
    };

    const generateLabel = async (itemId) => {
        try {
            const res = await axios.post(`/api/pharmacy/labels/${itemId}`);
            alert("Label printed:\n" + res.data.labelContent);
        } catch (e) {
            alert("Error generating label");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Process Prescription</h1>

            {!rx && (
                <div className="bg-white p-6 rounded shadow border">
                    <h2 className="font-semibold mb-4 text-lg">Load Veterinary Prescription</h2>
                    <div className="flex space-x-2">
                        <input
                            placeholder="Enter Vet Prescription ID (Number)"
                            value={rxCode}
                            onChange={(e) => setRxCode(e.target.value)}
                            className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={processByCode} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Load Prescription
                        </button>
                    </div>
                </div>
            )}

            {rx && durResults.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded mb-6 mt-4">
                    <h3 className="font-bold text-red-700 mb-2">DUR Alerts — Review Required</h3>
                    {durResults.map((alert, idx) => (
                        <div key={idx} className={`p-2 mb-2 rounded ${alert.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <strong>{alert.type}:</strong> {alert.message}
                        </div>
                    ))}
                    <button onClick={() => setDurResults([])} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 mt-2">
                        Acknowledge & Continue
                    </button>
                </div>
            )}

            {rx && durResults.length === 0 && (
                <div className="bg-white p-6 rounded shadow border mt-4">
                    <h3 className="font-bold text-lg mb-4">Dispense Items for {rx.prescriptionCode}</h3>

                    <div className="border p-4 rounded mb-4 bg-gray-50">
                        <p><strong>Patient:</strong> {rx.patient?.patientName}</p>
                        <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                    </div>

                    <div className="flex justify-end mt-6">
                        {/* Actual item dispensing UI would map over rx.prescriptionItems. We omit items mapping because we auto-process them */}
                        <button onClick={() => alert("Label functionality requires items loaded")} className="text-blue-600 mr-4 font-semibold px-4 py-2">
                            Print Labels
                        </button>
                        <button onClick={handleDispense} className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700">
                            Verify & Complete Dispense
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
