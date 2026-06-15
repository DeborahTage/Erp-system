import React from 'react';

function ReportCard({ title, description, onClick }) {
    return (
        <div className="bg-white p-6 rounded shadow-sm border hover:shadow-md cursor-pointer transition" onClick={onClick}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
            <div className="mt-4 text-blue-600 text-sm font-semibold">Generate &rarr;</div>
        </div>
    );
}

export default function PharmacyReports() {

    const generateReport = (type) => {
        alert(`Generating ${type} report... (Feature in development)`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Pharmacy Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard title="Sales Report" description="Overview of Daily, Weekly, and Monthly over-the-counter and Rx sales." onClick={() => generateReport('sales')} />
                <ReportCard title="Drug Utilization" description="Analyze the most and least utilized veterinary drugs." onClick={() => generateReport('utilization')} />
                <ReportCard title="Inventory Valuation" description="Calculated value of current stock within the pharmacy." onClick={() => generateReport('valuation')} />
                <ReportCard title="Expiry Report" description="Upcoming expiries and expired drugs ready for disposal." onClick={() => generateReport('expiry')} />
                <ReportCard title="Prescription Analysis" description="Aggregated trends of prescriptions by veterinary officers and flock patterns." onClick={() => generateReport('prescriptions')} />
                <ReportCard title="Financial Summary" description="High-level dashboard metric extracts (Revenue, Costs, Profit margins)." onClick={() => generateReport('financial')} />
            </div>
        </div>
    );
}
