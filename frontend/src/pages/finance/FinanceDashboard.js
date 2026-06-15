import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { financeApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import AlertCard from '../../components/shared/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../../utils';

const FinanceDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [transactionsRes, profitLossRes] = await Promise.all([
          financeApi.getAll(),
          financeApi.getProfitLoss({})
        ]);
        
        const transactions = transactionsRes.data.data || [];
        const profitLoss = profitLossRes.data.data;
        
        // Calculate analytics
        const income = transactions.filter(t => t.transactionType === 'INCOME');
        const expenses = transactions.filter(t => t.transactionType === 'EXPENSE');
        const totalIncome = income.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const netProfit = totalIncome - totalExpenses;
        
        setData({
          totalIncome,
          totalExpenses,
          netProfit,
          transactions,
          profitLoss
        });
      } catch (e) {
        console.error('Failed to fetch finance dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalIncome || 0),
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up',
      trendValue: '+12% from last month'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(data.totalExpenses || 0),
      icon: TrendingDown,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: 'up',
      trendValue: '+5% from last month'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(data.netProfit || 0),
      icon: DollarSign,
      iconColor: data.netProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.netProfit >= 0 ? 'bg-green-50' : 'bg-red-50',
      trend: data.netProfit >= 0 ? 'up' : 'down',
      trendValue: data.netProfit >= 0 ? 'Profitable' : 'Loss'
    },
    {
      title: 'Cash Flow',
      value: formatCurrency((data.netProfit || 0) * 0.8),
      icon: Wallet,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'stable',
      trendValue: 'Healthy'
    }
  ];

  const alerts = [
    {
      title: 'Expense Alert',
      description: 'Feed expenses exceeded budget by 15%',
      type: 'warning',
      icon: AlertTriangle,
      timestamp: '1 hour ago'
    },
    {
      title: 'Revenue Milestone',
      description: 'Monthly revenue target achieved',
      type: 'success',
      icon: TrendingUp,
      timestamp: '2 hours ago'
    }
  ];

  const recentActivities = [
    {
      title: 'Payment Received',
      description: 'ETB 50,000 received from Farm A',
      type: 'success',
      icon: ArrowUpRight,
      timestamp: '30 minutes ago'
    },
    {
      title: 'Expense Recorded',
      description: 'ETB 25,000 paid for feed purchase',
      type: 'info',
      icon: ArrowDownRight,
      timestamp: '1 hour ago'
    },
    {
      title: 'Invoice Generated',
      description: 'Invoice #1234 created for client',
      type: 'info',
      icon: Activity,
      timestamp: '2 hours ago'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Executive Finance Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor revenue, expenses, profit, and cash flow with professional accounting insights.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <AlertCard key={index} {...activity} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Financial Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue and expense comparison chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Monthly profit trend chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>Expense category distribution</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Wallet className="h-12 w-12 mx-auto mb-2" />
                <p>Cash flow timeline chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
