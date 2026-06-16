import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flockApi } from '../../api';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';
import StatsCard from '../../components/shared/StatsCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Layers, TrendingDown, Activity, Plus, Download, FileText } from 'lucide-react';
import { formatDate } from '../../utils';

const FlockList = () => {
  const { t } = useLanguage();
  const { canPerformAction } = useAuth();
  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    flockApi.getAll().then(r => setFlocks(r.data.data)).finally(() => setLoading(false));
  }, []);

  // Calculate analytics
  const totalFlocks = flocks.length;
  const activeFlocks = flocks.filter(f => f.status === 'ACTIVE').length;
  const totalBirds = flocks.reduce((sum, f) => sum + (Number(f.currentBirdCount) || 0), 0);
  const closedFlocks = flocks.filter(f => f.status === 'CLOSED').length;

  const kpiCards = [
    {
      title: 'Total Flocks',
      value: totalFlocks,
      icon: Layers,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Flocks',
      value: activeFlocks,
      icon: Activity,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Birds',
      value: totalBirds.toLocaleString(),
      icon: Activity,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Closed Flocks',
      value: closedFlocks,
      icon: TrendingDown,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const columns = [
    { key: 'batchCode', label: t('flocks.batchCode') },
    { key: 'farmName', label: t('flocks.farm') },
    { key: 'birdType', label: t('flocks.birdType') },
    { key: 'initialBirdCount', label: t('flocks.initialCount'), render: r => Number(r.initialBirdCount).toLocaleString() },
    { key: 'currentBirdCount', label: t('flocks.currentCount'), render: r => Number(r.currentBirdCount).toLocaleString() },
    { key: 'startDate', label: t('flocks.startDate'), render: r => formatDate(r.startDate) },
    { key: 'status', label: t('flocks.status'), render: r => <StatusBadge status={r.status} /> },
    {
      key: 'actions', label: t('flocks.actions'),
      render: r => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/flocks/${r.id}`)}
          >
            View
          </Button>
          {canPerformAction('edit', 'flocks') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/flocks/${r.id}/edit`)}
            >
              Edit
            </Button>
          )}
          {r.status === 'ACTIVE' && canPerformAction('edit', 'flocks') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => flockApi.close(r.id).then(() => setFlocks(f => f.map(x => x.id === r.id ? { ...x, status: 'CLOSED' } : x)))}
            >
              Close
            </Button>
          )}
        </div>
      )
    },
  ];

  const actions = [
    {
      label: 'Add Flock',
      icon: Plus,
      onClick: () => navigate('/flocks/new'),
      show: canPerformAction('create', 'flocks')
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export flocks'),
      show: true
    },
    {
      label: 'Generate Report',
      icon: FileText,
      onClick: () => console.log('Generate report'),
      show: true
    }
  ].filter(a => a.show);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Flock Management"
        description="Monitor flock performance, mortality trends, and growth analytics."
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
          <CardTitle>All Flocks</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={flocks} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FlockList;
