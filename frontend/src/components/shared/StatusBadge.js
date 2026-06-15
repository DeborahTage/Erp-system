import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    // General
    active: { variant: 'success', label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' },
    inactive: { variant: 'secondary', label: 'Inactive', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    pending: { variant: 'warning', label: 'Pending', className: 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100' },
    completed: { variant: 'success', label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    cancelled: { variant: 'destructive', label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-100' },
    draft: { variant: 'secondary', label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    approved: { variant: 'success', label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    rejected: { variant: 'destructive', label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-100' },
    open: { variant: 'warning', label: 'Open', className: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' },
    closed: { variant: 'secondary', label: 'Closed', className: 'bg-gray-100 text-gray-700 border-gray-200' },
    in_progress: { variant: 'info', label: 'In Progress', className: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },

    // Severity
    urgent: { variant: 'destructive', label: 'Urgent', className: 'bg-rose-50 text-rose-700 border-rose-100 font-black tracking-widest uppercase' },
    low: { variant: 'success', label: 'Low', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    medium: { variant: 'warning', label: 'Medium', className: 'bg-orange-50 text-orange-700 border-orange-100' },
    high: { variant: 'destructive', label: 'High', className: 'bg-red-50 text-red-700 border-red-100' },
    critical: { variant: 'destructive', label: 'Critical', className: 'bg-black text-white border-black' },

    // Inventory/Pharmacy
    in_stock: { variant: 'success', label: 'In Stock', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    low_stock: { variant: 'warning', label: 'Low Stock', className: 'bg-orange-50 text-orange-700 border-orange-100' },
    out_of_stock: { variant: 'destructive', label: 'Out of Stock', className: 'bg-red-50 text-red-700 border-red-100' },
    expired: { variant: 'destructive', label: 'Expired', className: 'bg-black text-white border-black' },
    expiring_soon: { variant: 'warning', label: 'Expiring Soon', className: 'bg-amber-50 text-amber-700 border-amber-100' },

    // Financial
    paid: { variant: 'success', label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    unpaid: { variant: 'destructive', label: 'Unpaid', className: 'bg-red-50 text-red-700 border-red-100' },
    overdue: { variant: 'destructive', label: 'Overdue', className: 'bg-rose-100 text-rose-900 border-rose-200' },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    variant: 'outline',
    label: status || 'Unknown',
    className: 'text-gray-500'
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-tight rounded-full border shadow-none transition-all",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
