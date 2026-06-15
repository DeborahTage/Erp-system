import React from 'react';

function ReportCard({ title, description, onClick }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group" onClick={onClick}>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{description}</p>
            <div className="mt-5 text-blue-600 text-sm font-semibold flex items-center">Download CSV Report →</div>
        </div>
    );
}

export default function InventoryReports() {
    const handleDownload = (endpoint, filename) => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:8080/api/inventory/reports/${endpoint}/csv`;

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch report");
                return response.blob();
            })
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            })
            .catch(err => alert("Error generating report: " + err.message));
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Intelligence</h1>
                        <p className="text-gray-500 mt-2">Comprehensive reporting and analytics for stock management.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ReportCard
                        title="Stock Valuation"
                        description="Detailed breakdown of current stock value by category and SKU."
                        onClick={() => handleDownload('valuation', 'stock_valuation.csv')}
                    />
                    <ReportCard
                        title="Expiry Analysis"
                        description="Identify batches approaching their expiration date for FEFO compliance."
                        onClick={() => handleDownload('expiry', 'expiry_report.csv')}
                    />
                    <ReportCard
                        title="Inventory Movements"
                        description="Full audit trail of all receipts, issues, and adjustments."
                        onClick={() => alert("Movement ledger coming soon...")}
                    />
                    <ReportCard
                        title="Low Stock Alerts"
                        description="Snapshot of items currently below their defined safety stock levels."
                        onClick={() => alert("Low stock report coming soon...")}
                    />
                    <ReportCard
                        title="Supplier Performance"
                        description="Lead time analysis and fulfillment accuracy by supplier."
                        onClick={() => alert("Supplier performance coming soon...")}
                    />
                    <ReportCard
                        title="Demand Forecast"
                        description="Predictive usage trends based on historical movement data."
                        onClick={() => alert("Forecast report coming soon...")}
                    />
                </div>
            </div>
        </div>
    );
}
