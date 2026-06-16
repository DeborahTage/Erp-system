import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dashboardApi } from '../../api';
import { ROLES, formatCurrency } from '../../utils';
import AdminDashboard from './AdminDashboard';
import StatsCard from '../../components/shared/StatsCard';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Building2, 
  Users, 
  Activity, 
  Package, 
  DollarSign, 
  HeartPulse,
  ShoppingCart,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let res;
        if (hasRole(ROLES.ADMIN, ROLES.GENERAL_MANAGER)) res = await dashboardApi.admin();
        else if (hasRole(ROLES.FARM_MANAGER, ROLES.OPERATIONS_MANAGER)) res = await dashboardApi.farmManager();
        else if (hasRole(ROLES.STORE_KEEPER)) res = await dashboardApi.store();
        else if (hasRole(ROLES.VETERINARY_OFFICER)) res = await dashboardApi.vet();
        else if (hasRole(ROLES.PHARMACY_SALES)) res = await dashboardApi.pharmacy();
        else if (hasRole(ROLES.FINANCE_OFFICER)) res = await dashboardApi.finance();
        if (res) setData(res.data.data || {});
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRole]);

  // Show Admin Dashboard for admin users
  if (hasRole(ROLES.ADMIN, ROLES.GENERAL_MANAGER)) {
    return <AdminDashboard />;
  }

  const farmCards = [
    {
      title: t('dashboard.activeFarms'),
      value: data.totalFarms ?? '-',
      icon: Building2,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.activeFlocks'),
      value: data.activeFlocks ?? '-',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.todaysMortality'),
      value: data.todayMortality ?? 0,
      icon: Activity,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: t('dashboard.upcomingVaccinations'),
      value: data.upcomingVaccinations ?? 0,
      icon: HeartPulse,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: t('dashboard.openHealthReports'),
      value: data.openHealthReports ?? 0,
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const storeCards = [
    {
      title: t('dashboard.totalItems'),
      value: data.totalItems ?? '-',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.expiringItems'),
      value: data.expiringItems ?? 0,
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const vetCards = [
    {
      title: t('dashboard.upcomingVaccinations'),
      value: data.upcomingVaccinations ?? 0,
      icon: HeartPulse,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.missedVaccinations'),
      value: data.missedVaccinations ?? 0,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: t('dashboard.activeDiseaseCases'),
      value: data.activeDiseaseCases ?? 0,
      icon: Activity,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: t('dashboard.openHealthReports'),
      value: data.openHealthReports ?? 0,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: t('dashboard.pendingPrescriptions'),
      value: data.pendingPrescriptions ?? 0,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const pharmacyCards = [
    {
      title: t('dashboard.todaysSales'),
      value: formatCurrency(data.todaySales),
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.totalSales'),
      value: data.totalSalesCount ?? 0,
      icon: ShoppingCart,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.pendingPrescriptions'),
      value: data.pendingPrescriptions ?? 0,
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: t('dashboard.internalDrugUsage'),
      value: data.internalDrugUsage ?? 0,
      icon: Package,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const financeCards = [
    {
      title: t('dashboard.totalIncome'),
      value: formatCurrency(data.totalIncome),
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.totalExpenses'),
      value: formatCurrency(data.totalExpenses),
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: t('dashboard.netProfitLoss'),
      value: formatCurrency(data.netProfitLoss),
      icon: TrendingUp,
      iconColor: data.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.netProfitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
  ];

  let cards = [];
  if (hasRole(ROLES.FARM_MANAGER, ROLES.OPERATIONS_MANAGER)) cards = farmCards;
  else if (hasRole(ROLES.STORE_KEEPER)) cards = storeCards;
  else if (hasRole(ROLES.VETERINARY_OFFICER)) cards = vetCards;
  else if (hasRole(ROLES.PHARMACY_SALES)) cards = pharmacyCards;
  else if (hasRole(ROLES.FINANCE_OFFICER)) cards = financeCards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mt-1">{t('dashboard.welcomeBack', { name: user?.fullName || '' })}</p>
      </div>
      
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <StatsCard key={i} {...card} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
