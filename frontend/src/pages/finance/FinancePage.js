import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../api';
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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download, FileText, Wallet } from 'lucide-react';
import { PERMISSIONS } from '../../lib/permissions';

const FinancePage = () => {
  const { t } = useLanguage();
  const { hasAnyPermission } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [profitLoss, setProfitLoss] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([financeApi.getAll(), financeApi.getProfitLoss({})])
      .then(([tRes, plRes]) => {
        setTransactions(tRes.data.data || []);
        setProfitLoss(plRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const income = transactions.filter((transaction) => transaction.transactionType === 'INCOME');
  const expenses = transactions.filter((transaction) => transaction.transactionType === 'EXPENSE');

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: profitLoss ? formatCurrency(profitLoss.totalIncome) : formatCurrency(0),
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Expenses',
      value: profitLoss ? formatCurrency(profitLoss.totalExpenses) : formatCurrency(0),
      icon: TrendingDown,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Net Profit/Loss',
      value: profitLoss ? formatCurrency(profitLoss.netProfitLoss) : formatCurrency(0),
      icon: DollarSign,
      iconColor: profitLoss && profitLoss.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: profitLoss && profitLoss.netProfitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Cash Flow',
      value: profitLoss ? formatCurrency(profitLoss.netProfitLoss * 0.8) : formatCurrency(0),
      icon: Wallet,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const actions = [
    {
      label: 'Add Transaction',
      icon: Plus,
      onClick: () => navigate('/finance/new'),
      show: hasAnyPermission([PERMISSIONS.CREATE_INCOME, PERMISSIONS.CREATE_EXPENSES])
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export finance data'),
      show: true
    },
    {
      label: 'Generate Report',
      icon: FileText,
      onClick: () => console.log('Generate report'),
      show: true
    }
  ].filter(a => a.show);

  const cols = [
    { key: 'transactionDate', label: t('finance.date'), render: (row) => formatDate(row.transactionDate) },
    {
      key: 'transactionType',
      label: t('finance.type'),
      render: (row) => (
        <Badge variant={row.transactionType === 'INCOME' ? 'success' : 'destructive'}>
          {t(`status.${row.transactionType}`)}
        </Badge>
      )
    },
    { key: 'category', label: t('finance.category') },
    { key: 'amount', label: t('finance.amount'), render: (row) => formatCurrency(row.amount) },
    { key: 'paymentMethod', label: t('finance.payment') },
    { key: 'description', label: t('finance.description') },
    { key: 'recordedBy', label: t('finance.recordedBy') },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Finance Management"
        description="Monitor revenue, expenses, profit, and cash flow with professional accounting insights."
        actions={actions}
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="income">
                Income ({income.length})
              </TabsTrigger>
              <TabsTrigger value="expenses">
                Expenses ({expenses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <DataTable columns={cols} data={transactions} loading={loading} searchable pagination />
            </TabsContent>

            <TabsContent value="income">
              <DataTable columns={cols} data={income} loading={loading} searchable pagination />
            </TabsContent>

            <TabsContent value="expenses">
              <DataTable columns={cols} data={expenses} loading={loading} searchable pagination />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancePage;
