import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { crmApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';
import AlertCard from '../../components/shared/AlertCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Activity, 
  AlertTriangle,
  BarChart3,
  Phone,
  Building2,
  Target
} from 'lucide-react';

const CRMDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [clientsRes, visitsRes, followUpsRes] = await Promise.all([
          crmApi.getClients(),
          crmApi.getVisits({}),
          crmApi.getFollowUps()
        ]);
        
        const clients = clientsRes.data.data || [];
        const visits = visitsRes.data.data || [];
        const followUps = followUpsRes.data.data || [];
        
        // Calculate analytics
        const activeClients = clients.filter(c => c.status === 'ACTIVE').length;
        const totalBirds = clients.reduce((sum, c) => sum + (Number(c.numberOfBirds) || 0), 0);
        const upcomingFollowUps = followUps.filter(f => new Date(f.nextFollowUpDate) >= new Date()).length;
        const visitsThisMonth = visits.filter(v => new Date(v.visitDate).getMonth() === new Date().getMonth()).length;
        
        setData({
          totalClients: clients.length,
          activeClients,
          totalBirds,
          upcomingFollowUps,
          visitsThisMonth,
          clients,
          visits,
          followUps
        });
      } catch (e) {
        console.error('Failed to fetch CRM dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'Active Clients',
      value: data.activeClients || 0,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      trendValue: '+5 new this month'
    },
    {
      title: 'Total Birds',
      value: (data.totalBirds || 0).toLocaleString(),
      icon: Building2,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up',
      trendValue: '+12% from last month'
    },
    {
      title: 'Upcoming Follow-ups',
      value: data.upcomingFollowUps || 0,
      icon: Calendar,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'stable',
      trendValue: 'This week'
    },
    {
      title: 'Visits This Month',
      value: data.visitsThisMonth || 0,
      icon: Activity,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up',
      trendValue: '+8 from last month'
    }
  ];

  const alerts = [
    {
      title: 'Follow-up Due',
      description: '3 client follow-ups scheduled for today',
      type: 'warning',
      icon: AlertTriangle,
      timestamp: '1 hour ago'
    },
    {
      title: 'New Lead',
      description: 'Potential client "Green Farms" interested',
      type: 'info',
      icon: Target,
      timestamp: '2 hours ago'
    }
  ];

  const recentActivities = [
    {
      title: 'Client Visit Completed',
      description: 'Farm visit completed for "Agro Farm"',
      type: 'success',
      icon: Activity,
      timestamp: '30 minutes ago'
    },
    {
      title: 'New Client Added',
      description: 'Client "Sunrise Poultry" registered',
      type: 'success',
      icon: Users,
      timestamp: '1 hour ago'
    },
    {
      title: 'Follow-up Scheduled',
      description: 'Follow-up set for "Valley Farms"',
      type: 'info',
      icon: Calendar,
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">CRM Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage client relationships, lead pipeline, and follow-up schedules.
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
            <CardTitle>Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-2" />
                <p>Lead funnel chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Revenue Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue by client chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2" />
                <p>Visit frequency chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-up Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p>Follow-up schedule chart</p>
                <p className="text-sm">(Recharts integration available)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
