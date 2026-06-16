import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { farmApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const FarmList = () => {
  const { t } = useLanguage();
  const { hasRole } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canManageFarms = hasRole('ADMIN', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER');

  useEffect(() => {
    farmApi.getAll().then(r => setFarms(r.data.data)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'farmName', label: t('farms.farmName') },
    { key: 'location', label: t('farms.location') },
    { key: 'farmType', label: t('farms.type') },
    { key: 'capacity', label: t('farms.capacity') },
    { key: 'assignedFarmManagerName', label: t('farms.manager') },
    { key: 'status', label: t('farms.status'), render: r => <StatusBadge status={r.status} /> },
    ...(canManageFarms ? [{
      key: 'actions', label: t('farms.actions'),
      render: r => (
        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/farms/${r.id}/edit`)}>{t('common.edit')}</Button>
      )
    }] : []),
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('farms.title')}</h5>
        {canManageFarms && (
          <Button variant="success" size="sm" onClick={() => navigate('/farms/new')}>{t('farms.add')}</Button>
        )}
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <DataTable columns={columns} data={farms} loading={loading} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default FarmList;
