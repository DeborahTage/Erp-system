import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency } from '../../utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Package,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Edit,
  ArrowUp,
  ArrowDown,
  Plus,
  Download,
  FileText,
  DollarSign,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PERMISSIONS } from '../../lib/permissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const InventoryItemList = () => {
  const { t } = useLanguage();
  const { hasPermission, canPerformAction } = useAuth();
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiry, setExpiry] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      inventoryApi.getItems(),
      inventoryApi.getLowStock(),
      inventoryApi.getExpiryAlerts(),
      inventoryApi.getMovements(),
    ]).then(([itemsRes, lowStockRes, expiryRes, movementsRes]) => {
      setItems(itemsRes.data.data || []);
      setLowStock(lowStockRes.data.data || []);
      setExpiry(expiryRes.data.data || []);
      setMovements(movementsRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  // Calculate analytics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, i) => sum + (Number(i.currentStock || 0) * Number(i.unitCost || 0)), 0);
  const lowStockCount = lowStock.length;
  const expiringCount = expiry.length;

  const kpiCards = [
    {
      title: 'Active SKUs',
      value: totalItems,
      description: 'Unique items in catalog',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      description: 'Require immediate reorder',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Expiry Alerts',
      value: expiringCount,
      description: 'Batches expiring soon',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Stock Valuation',
      value: formatCurrency(totalValue),
      description: 'Total wholesale value',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const headerActions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="rounded-xl border-gray-200">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      {canPerformAction('create', 'inventoryItems') && (
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl" onClick={() => navigate('/inventory/items/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      )}
    </div>
  );

  const itemColumns = [
    {
      key: 'itemName',
      label: 'Item Name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-tight">{row.itemName}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{row.category}</span>
        </div>
      )
    },
    { key: 'unit', label: 'UoM' },
    {
      key: 'currentStock',
      label: 'On Hand',
      render: (row) => (
        <div className="flex flex-col">
          <span className={cn("font-black", row.currentStock <= row.minimumStockLevel ? "text-rose-600" : "text-gray-900")}>
            {row.currentStock}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">Min: {row.minimumStockLevel}</span>
        </div>
      )
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      render: (row) => <span className="font-medium text-gray-600">{formatCurrency(row.unitCost)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        let status = 'in_stock';
        if (row.currentStock <= 0) status = 'out_of_stock';
        else if (row.currentStock <= row.minimumStockLevel) status = 'low_stock';
        return <StatusBadge status={status} />
      }
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl">
              {canPerformAction('edit', 'inventoryItems') && (
                <DropdownMenuItem onClick={() => navigate(`/inventory/items/${row.id}/edit`)} className="rounded-lg">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
              )}
              {canPerformAction('stockIn', 'inventoryItems') && (
                <DropdownMenuItem onClick={() => navigate('/inventory/stock-in', { state: { itemId: row.id } })} className="rounded-lg">
                  <ArrowUp className="mr-2 h-4 w-4 text-emerald-500" />
                  Receive Stock
                </DropdownMenuItem>
              )}
              {canPerformAction('stockOut', 'inventoryItems') && (
                <DropdownMenuItem onClick={() => navigate('/inventory/stock-out', { state: { itemId: row.id } })} className="rounded-lg">
                  <ArrowDown className="mr-2 h-4 w-4 text-rose-500" />
                  Issue Stock
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Warehouse Stock"
        subtitle="End-to-end inventory control and movement tracking."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => navigate('/inventory/reports')}>
            <FileText className="mr-2 h-4 w-4 text-indigo-500" />
            Audit Log
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl" onClick={() => navigate('/inventory/stock-in')}>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </PageHeader>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Alert Banner */}
      {(lowStockCount > 0 || expiringCount > 0) && (
        <Card className="border-none bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <AlertTriangle className="h-6 w-6 stroke-[3px]" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">Active Stock Alerts</p>
                  <p className="text-sm text-white/80 font-medium italic">
                    {lowStockCount > 0 && `${lowStockCount} items low stock. `}
                    {expiringCount > 0 && `${expiringCount} items expiring soon.`}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-none text-white font-bold rounded-xl" onClick={() => navigate('/inventory/expiry')}>
                Review All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white p-1 border border-gray-100 rounded-xl shadow-sm h-11">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg transition-all px-6 font-bold text-xs">
                All Items
              </TabsTrigger>
              <TabsTrigger value="low" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white rounded-lg transition-all px-6 font-bold text-xs">
                Low Stock
                {lowStock.length > 0 && (
                  <span className="ml-2 bg-white/20 px-1.5 rounded-md text-[10px]">{lowStock.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="expiry" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all px-6 font-bold text-xs">
                Expirations
                {expiry.length > 0 && (
                  <span className="ml-2 bg-white/20 px-1.5 rounded-md text-[10px]">{expiry.length}</span>
                )}
              </TabsTrigger>
            </TabsList>
            {headerActions}
          </div>

          <TabsContent value="all" className="mt-0 focus-visible:outline-none outline-none">
            <DataTable columns={itemColumns} data={items} loading={loading} searchable pagination emptyMessage="No inventory items found." />
          </TabsContent>

          <TabsContent value="low" className="mt-0 focus-visible:outline-none outline-none">
            <DataTable columns={itemColumns} data={lowStock} loading={loading} searchable pagination emptyMessage="No low stock alerts today." />
          </TabsContent>

          <TabsContent value="expiry" className="mt-0 focus-visible:outline-none outline-none">
            <DataTable
              columns={[
                { key: 'itemName', label: 'Item', render: (row) => row.item?.itemName },
                { key: 'batchNumber', label: 'Batch/Lot' },
                { key: 'quantityRemaining', label: 'Rem. Qty' },
                { key: 'expiryDate', label: 'Expiry', render: (row) => <span className="font-bold text-rose-600">{formatDate(row.expiryDate)}</span> },
                { key: 'status', label: 'Severity', render: () => <StatusBadge status="expiring_soon" /> }
              ]}
              data={expiry}
              loading={loading}
              searchable
              pagination
              emptyMessage="All batches are safe."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryItemList;
