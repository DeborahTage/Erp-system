import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { dailyRecordApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const DailyFarmRecordList = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dailyRecordApi.getAll().then(r => setRecords(r.data.data)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'date', label: t('dailyRecordList.date'), render: r => formatDate(r.date) },
    { key: 'farmName', label: t('dailyRecordList.farm') },
    { key: 'batchCode', label: t('dailyRecordList.batch') },
    { key: 'openingBirdCount', label: t('dailyRecordList.opening') },
    { key: 'mortality', label: t('dailyRecordList.mortality') },
    { key: 'feedConsumed', label: t('dailyRecordList.feed') },
    { key: 'eggProduction', label: t('dailyRecordList.eggs') },
    { key: 'mortalityRate', label: t('dailyRecordList.mortalityRate'), render: r => r.mortalityRate ? `${r.mortalityRate.toFixed(2)}%` : '-' },
    { key: 'recordedBy', label: t('dailyRecordList.recordedBy') },
    {
      key: 'actions', label: t('dailyRecordList.actions'),
      render: r => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/daily-records/${r.id}/edit`)}>{t('common.edit')}</Button>
          {(r.mortality > 0 || r.symptomsOrRemarks) && (
            <Button size="sm" variant="outline-danger" onClick={() => navigate('/veterinary/health-reports/new', { state: { dailyRecord: r } })}>
              {t('dailyRecordList.createHealthReport')}
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('dailyRecordList.title')}</h5>
        <Button variant="success" size="sm" onClick={() => navigate('/daily-records/new')}>{t('dailyRecordList.add')}</Button>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <DataTable columns={columns} data={records} loading={loading} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default DailyFarmRecordList;
