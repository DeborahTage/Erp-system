import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api';
import { formatCurrency } from '../../utils';
import StatsCard from '../../components/shared/StatsCard';
import AlertCard from '../../components/shared/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Building2, 
  Users, 
  Activity, 
  AlertTriangle, 
  DollarSign, 
  UserCheck,
  TrendingUp,
  Package,
  HeartPulse,
  ShoppingCart,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.admin();
        setData(res.data.data || {});
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Total Farms',
      value: data.totalFarms || 0,
      icon: Building2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      trendValue: '+12% from last month'
    },
    {
      title: 'Total Users',
      value: data.totalUsers || 0,
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up',
      trendValue: '+5% from last month'
    },
    {
      title: 'Active Disease Cases',
      value: data.activeDiseaseCases || 0,
      icon: Activity,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: 'down',
      trendValue: '-8% from last week'
    },
    {
      title: 'Inventory Alerts',
      value: data.inventoryAlerts || 0,
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'up',
      trendValue: '+3 new alerts'
    },
    {
      title: 'Revenue Overview',
      value: formatCurrency(data.totalRevenue || 0),
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up',
      trendValue: '+15% from last month'
    },
    {
      title: 'Active Clients',
      value: data.activeClients || 0,
      icon: UserCheck,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: 'up',
      trendValue: '+10% from last month'
    }
  ];

  const alerts = [
    {
      title: 'Low Stock Alert',
      description: '15 items are below minimum stock level',
      type: 'critical',
      icon: Package,
      timestamp: '2 hours ago'
    },
    {
      title: 'Expiring Drugs',
      description: '8 pharmaceutical items expiring within 30 days',
      type: 'warning',
      icon: Clock,
      timestamp: '5 hours ago'
    },
    {
      title: 'High Mortality Rate',
      description: 'Farm A showing 12% mortality rate this week',
      type: 'critical',
      icon: Activity,
      timestamp: '1 day ago'
    },
    {
      title: 'Missed Vaccinations',
      description: '23 flocks overdue for scheduled vaccinations',
      type: 'warning',
      icon: HeartPulse,
      timestamp: '2 days ago'
    }
  ];

  const recentActivities = [
    {
      title: 'New Farm Record Created',
      description: 'Daily record submitted for Farm B - Flock 3',
      type: 'info',
      icon: TrendingUp,
      timestamp: '30 minutes ago'
    },
    {
      title: 'Stock Movement',
      description: 'Stock in: 500 units of Animal Feed',
      type: 'success',
      icon: Package,
      timestamp: '1 hour ago'
    },
    {
      title: 'Treatment Administered',
      description: 'Antibiotic treatment for Disease Case #452',
      type: 'info',
      icon: HeartPulse,
      timestamp: '2 hours ago'
    },
    {
      title: 'Pharmacy Sale',
      description: 'Sale #1234 - $450.00 completed',
      type: 'success',
      icon: ShoppingCart,
      timestamp: '3 hours ago'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.fullName || 'Admin'}. Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Recent Activity
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
              Alert Center
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
            <CardTitle>Farm Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Veterinary Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <HeartPulse className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
