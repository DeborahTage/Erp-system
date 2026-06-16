import React, { useEffect, useState } from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import { Activity, ClipboardCheck, HeartPulse, TriangleAlert, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dashboardApi } from '../../api';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, ROLES } from '../../utils';
import './Dashboard.css';

const VetMetricCard = ({ title, value, icon: Icon, accentClass }) => (
  <div className={`vet-dashboard-card ${accentClass}`}>
    <div className="vet-dashboard-card-copy">
      <div className="vet-dashboard-card-title">{title}</div>
      <div className="vet-dashboard-card-value">{value}</div>
    </div>
    <div className="vet-dashboard-card-icon">
      <Icon size={16} strokeWidth={2.1} />
    </div>
  </div>
);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadError('');
        let res;
        if (hasRole(ROLES.ADMIN, ROLES.GENERAL_MANAGER)) res = await dashboardApi.admin();
        else if (hasRole(ROLES.FARM_MANAGER, ROLES.OPERATIONS_MANAGER)) res = await dashboardApi.farmManager();
        else if (hasRole(ROLES.STORE_KEEPER)) res = await dashboardApi.store();
        else if (hasRole(ROLES.VETERINARY_OFFICER)) res = await dashboardApi.vet();
        else if (hasRole(ROLES.PHARMACY_SALES)) res = await dashboardApi.pharmacy();
        else if (hasRole(ROLES.FINANCE_OFFICER)) res = await dashboardApi.finance();
        if (res) setData(res.data.data);
      } catch (e) {
        setLoadError(e.response?.data?.message || 'Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const adminCards = [
    { title: t('dashboard.activeFarms'), value: data.totalFarms ?? '-', icon: 'Farm', color: 'success' },
    { title: t('dashboard.activeFlocks'), value: data.totalActiveFlocks ?? '-', icon: 'Flocks', color: 'primary' },
    { title: t('dashboard.todaysMortality'), value: data.todayMortality ?? 0, icon: 'Mortality', color: 'danger' },
    { title: t('dashboard.todaysSales'), value: formatCurrency(data.todayPharmacySales), icon: 'Sales', color: 'info' },
    { title: t('dashboard.totalRevenue'), value: formatCurrency(data.totalRevenue), icon: 'Revenue', color: 'success' },
    { title: t('dashboard.totalExpenses'), value: formatCurrency(data.totalExpenses), icon: 'Expenses', color: 'warning' },
    { title: t('dashboard.netProfitLoss'), value: formatCurrency(data.netProfitLoss), icon: 'Profit', color: data.netProfitLoss >= 0 ? 'success' : 'danger' },
    { title: t('dashboard.openHealthReports'), value: data.openHealthReports ?? 0, icon: 'Health', color: 'danger' },
    { title: t('dashboard.activeDiseaseCases'), value: data.activeDiseaseCases ?? 0, icon: 'Cases', color: 'warning' },
    { title: t('dashboard.pendingPrescriptions'), value: data.pendingPrescriptions ?? 0, icon: 'Rx', color: 'primary' },
    { title: t('dashboard.pendingAlerts'), value: data.pendingAlerts ?? 0, icon: 'Alerts', color: 'warning' },
  ];

  const farmCards = [
    { title: t('dashboard.activeFarms'), value: data.totalFarms ?? '-', icon: 'Farm', color: 'success' },
    { title: t('dashboard.activeFlocks'), value: data.activeFlocks ?? '-', icon: 'Flocks', color: 'primary' },
    { title: t('dashboard.todaysMortality'), value: data.todayMortality ?? 0, icon: 'Mortality', color: 'danger' },
    { title: t('dashboard.upcomingVaccinations'), value: data.upcomingVaccinations ?? 0, icon: 'Vaccines', color: 'info' },
    { title: t('dashboard.openHealthReports'), value: data.openHealthReports ?? 0, icon: 'Health', color: 'warning' },
  ];

  const storeCards = [
    { title: t('dashboard.totalItems'), value: data.totalItems ?? '-', icon: 'Inventory', color: 'primary' },
    { title: t('dashboard.expiringItems'), value: data.expiringItems ?? 0, icon: 'Expiry', color: 'warning' },
  ];

  const vetCards = [
    { title: t('dashboard.upcomingVaccinations'), value: data.upcomingVaccinations ?? 0, icon: 'Vaccines', color: 'primary' },
    { title: t('dashboard.missedVaccinations'), value: data.missedVaccinations ?? 0, icon: 'Missed', color: 'danger' },
    { title: t('dashboard.activeDiseaseCases'), value: data.activeDiseaseCases ?? 0, icon: 'Cases', color: 'warning' },
    { title: t('dashboard.openHealthReports'), value: data.openHealthReports ?? 0, icon: 'Health', color: 'danger' },
    { title: t('dashboard.pendingPrescriptions'), value: data.pendingPrescriptions ?? 0, icon: 'Rx', color: 'info' },
  ];

  const pharmacyCards = [
    { title: t('dashboard.todaysSales'), value: formatCurrency(data.todaySales), icon: 'Sales', color: 'success' },
    { title: t('dashboard.totalSales'), value: data.totalSalesCount ?? 0, icon: 'Receipts', color: 'primary' },
    { title: t('dashboard.pendingPrescriptions'), value: data.pendingPrescriptions ?? 0, icon: 'Rx', color: 'warning' },
    { title: t('dashboard.internalDrugUsage'), value: data.internalDrugUsage ?? 0, icon: 'Usage', color: 'info' },
  ];

  const financeCards = [
    { title: t('dashboard.totalIncome'), value: formatCurrency(data.totalIncome), icon: 'Income', color: 'success' },
    { title: t('dashboard.totalExpenses'), value: formatCurrency(data.totalExpenses), icon: 'Expenses', color: 'danger' },
    { title: t('dashboard.netProfitLoss'), value: formatCurrency(data.netProfitLoss), icon: 'Profit', color: 'primary' },
  ];

  const vetDashboardCards = [
    {
      title: t('dashboard.upcomingVaccinations'),
      value: data.upcomingVaccinations ?? 0,
      icon: HeartPulse,
      accentClass: 'is-blue',
    },
    {
      title: t('dashboard.missedVaccinations'),
      value: data.missedVaccinations ?? 0,
      icon: TriangleAlert,
      accentClass: 'is-red',
    },
    {
      title: t('dashboard.activeDiseaseCases'),
      value: data.activeDiseaseCases ?? 0,
      icon: Activity,
      accentClass: 'is-orange',
    },
    {
      title: t('dashboard.openHealthReports'),
      value: data.openHealthReports ?? 0,
      icon: ClipboardCheck,
      accentClass: 'is-red',
    },
    {
      title: t('dashboard.pendingPrescriptions'),
      value: data.pendingPrescriptions ?? 0,
      icon: TrendingUp,
      accentClass: 'is-purple',
    },
  ];

  let cards = [];
  if (hasRole(ROLES.ADMIN, ROLES.GENERAL_MANAGER)) cards = adminCards;
  else if (hasRole(ROLES.FARM_MANAGER, ROLES.OPERATIONS_MANAGER)) cards = farmCards;
  else if (hasRole(ROLES.STORE_KEEPER)) cards = storeCards;
  else if (hasRole(ROLES.VETERINARY_OFFICER)) cards = vetCards;
  else if (hasRole(ROLES.PHARMACY_SALES)) cards = pharmacyCards;
  else if (hasRole(ROLES.FINANCE_OFFICER)) cards = financeCards;

  return (
    <div className={`dashboard-page ${hasRole(ROLES.VETERINARY_OFFICER) ? 'vet-dashboard-theme' : ''}`}>
      <h5 className="fw-bold mb-1 dashboard-title">{t('dashboard.title')}</h5>
      <p className="small mb-4 dashboard-subtitle">{t('dashboard.welcomeBack', { name: user?.fullName || '' })}</p>
      {loadError && <Alert variant="warning" className="py-2 small">{loadError}</Alert>}
      {loading ? (
        <p className="dashboard-subtitle">{t('common.loading')}</p>
      ) : hasRole(ROLES.VETERINARY_OFFICER) ? (
        <div className="vet-dashboard-grid">
          {vetDashboardCards.map((card, index) => (
            <VetMetricCard key={index} {...card} />
          ))}
        </div>
      ) : (
        <Row className="g-2">
          {cards.map((card, i) => (
            <Col key={i} xs={12} sm={6} lg={3}>
              <StatCard {...card} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
