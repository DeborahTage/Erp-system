import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { flockApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const FlockList = () => {
  const { t } = useLanguage();
  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    flockApi.getAll().then(r => setFlocks(r.data.data)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'batchCode', label: t('flocks.batchCode') },
    { key: 'farmName', label: t('flocks.farm') },
    { key: 'birdType', label: t('flocks.birdType') },
    { key: 'initialBirdCount', label: t('flocks.initialCount') },
    { key: 'currentBirdCount', label: t('flocks.currentCount') },
    { key: 'startDate', label: t('flocks.startDate'), render: r => formatDate(r.startDate) },
    { key: 'status', label: t('flocks.status'), render: r => <StatusBadge status={r.status} /> },
    {
      key: 'actions', label: t('flocks.actions'),
      render: r => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/flocks/${r.id}/edit`)}>{t('common.edit')}</Button>
          {r.status === 'ACTIVE' && <Button size="sm" variant="outline-danger" onClick={() => flockApi.close(r.id).then(() => setFlocks(f => f.map(x => x.id === r.id ? { ...x, status: 'CLOSED' } : x)))}>{t('common.close')}</Button>}
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('flocks.title')}</h5>
        <Button variant="success" size="sm" onClick={() => navigate('/flocks/new')}>{t('flocks.add')}</Button>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <DataTable columns={columns} data={flocks} loading={loading} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default FlockList;
