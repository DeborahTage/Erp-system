import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dailyRecordApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import AlertCard from '../../components/shared/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  HeartPulse,
  BarChart3,
  Egg
} from 'lucide-react';

const DailyRecordsDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dailyRecordApi.getAll();
        const records = res.data.data || [];
        
        // Calculate analytics from recent records
        const todayRecords = records.filter(r => r.date === new Date().toISOString().split('T')[0]);
        const totalRecords = records.length;
        const totalMortality = records.reduce((sum, r) => sum + (Number(r.mortality) || 0), 0);
        const totalEggs = records.reduce((sum, r) => sum + (Number(r.eggProduction) || 0), 0);
        const avgMortalityRate = records.length > 0 ? (totalMortality / records.length * 100).toFixed(2) : 0;
        
        setData({
          totalRecords,
          todayRecords: todayRecords.length,
          totalMortality,
          totalEggs,
          avgMortalityRate,
          records
        });
      } catch (e) {
        console.error('Failed to fetch daily records dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Total Records',
      value: data.totalRecords || 0,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      trendValue: '+12 this week'
    },
    {
      title: "Today's Records",
      value: data.todayRecords || 0,
      icon: Activity,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'stable',
      trendValue: 'On track'
    },
    {
      title: 'Total Mortality',
      value: data.totalMortality || 0,
      icon: TrendingDown,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: data.avgMortalityRate > 3 ? 'up' : 'down',
      trendValue: `${data.avgMortalityRate}% avg rate`
    },
    {
      title: 'Total Eggs',
      value: (data.totalEggs || 0).toLocaleString(),
      icon: Egg,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up',
      trendValue: '+8% from last week'
    }
  ];

  const alerts = [
    {
      title: 'High Mortality Alert',
      description: 'Farm A - Flock B-003: 15 birds died today',
      type: 'critical',
      icon: AlertTriangle,
      timestamp: '2 hours ago'
    },
    {
      title: 'Low Egg Production',
      description: 'Farm C - Flock C-001: Below expected production',
      type: 'warning',
      icon: TrendingDown,
      timestamp: '5 hours ago'
    }
  ];

  const recentActivities = [
    {
      title: 'Daily Record Submitted',
      description: 'Farm B - Flock B-002 daily record completed',
      type: 'info',
      icon: FileText,
      timestamp: '30 minutes ago'
    },
    {
      title: 'Health Report Created',
      description: 'Health report generated for Farm A - Flock A-001',
      type: 'success',
      icon: HeartPulse,
      timestamp: '2 hours ago'
    },
    {
      title: 'Feed Consumption Updated',
      description: 'Farm C - Flock C-003: 500kg feed recorded',
      type: 'info',
      icon: Activity,
      timestamp: '3 hours ago'
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daily Operations</h1>
        <p className="text-gray-500 mt-1">
          Monitor daily farm operations, mortality analytics, and production trends.
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
              Alerts
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
            <CardTitle>Mortality Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingDown className="h-12 w-12 mx-auto mb-2" />
                <p>Mortality rate chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feed Consumption Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Feed efficiency chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Egg production chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Daily records timeline</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyRecordsDashboard;
