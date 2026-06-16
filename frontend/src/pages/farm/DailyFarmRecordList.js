import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dailyRecordApi } from '../../api';
import DataTable from '../../components/shared/DataTable';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, TrendingDown, Activity, Plus, Download, FileText as FileIcon, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils';

const DailyFarmRecordList = () => {
  const { t } = useLanguage();
  const { canPerformAction } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dailyRecordApi.getAll().then(r => setRecords(r.data.data)).finally(() => setLoading(false));
  }, []);

  // Calculate analytics
  const totalRecords = records.length;
  const todayRecords = records.filter(r => r.date === new Date().toISOString().split('T')[0]).length;
  const totalMortality = records.reduce((sum, r) => sum + (Number(r.mortality) || 0), 0);
  const totalEggs = records.reduce((sum, r) => sum + (Number(r.eggProduction) || 0), 0);
  const highMortalityRecords = records.filter(r => r.mortality > 10).length;

  const kpiCards = [
    {
      title: 'Total Records',
      value: totalRecords,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's Records",
      value: todayRecords,
      icon: Activity,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Mortality',
      value: totalMortality,
      icon: TrendingDown,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Eggs',
      value: totalEggs.toLocaleString(),
      icon: FileIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const columns = [
    { key: 'date', label: t('dailyRecordList.date'), render: r => formatDate(r.date) },
    { key: 'farmName', label: t('dailyRecordList.farm') },
    { key: 'batchCode', label: t('dailyRecordList.batch') },
    { key: 'openingBirdCount', label: t('dailyRecordList.opening'), render: r => Number(r.openingBirdCount).toLocaleString() },
    { key: 'mortality', label: t('dailyRecordList.mortality'), render: r => r.mortality || 0 },
    { key: 'feedConsumed', label: t('dailyRecordList.feed'), render: r => `${r.feedConsumed || 0} kg` },
    { key: 'eggProduction', label: t('dailyRecordList.eggs'), render: r => r.eggProduction || 0 },
    { key: 'mortalityRate', label: t('dailyRecordList.mortalityRate'), render: r => r.mortalityRate ? `${r.mortalityRate.toFixed(2)}%` : '-' },
    { key: 'recordedBy', label: t('dailyRecordList.recordedBy') },
    {
      key: 'actions', label: t('dailyRecordList.actions'),
      render: r => (
        <div className="flex gap-2">
          {canPerformAction('edit', 'dailyRecords') && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/daily-records/${r.id}/edit`)}
          >
            Edit
          </Button>
          )}
          {(r.mortality > 0 || r.symptomsOrRemarks) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/veterinary/health-reports/new', { state: { dailyRecord: r } })}
            >
              Health Report
            </Button>
          )}
        </div>
      )
    },
  ];

  const actions = [
    {
      label: 'Add Record',
      icon: Plus,
      onClick: () => navigate('/daily-records/new'),
      show: canPerformAction('create', 'dailyRecords')
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export records'),
      show: true
    },
    {
      label: 'Generate Report',
      icon: FileIcon,
      onClick: () => console.log('Generate report'),
      show: true
    }
  ].filter(a => a.show);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Daily Operations"
        description="Monitor daily farm operations, mortality analytics, and production trends."
        actions={actions}
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Alert Banner */}
      {highMortalityRecords > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">High Mortality Alert</p>
                <p className="text-sm text-red-700">{highMortalityRecords} records show mortality above 10 birds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Daily Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyFarmRecordList;
