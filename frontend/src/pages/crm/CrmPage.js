import React, { useEffect, useState } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const CrmPage = () => {
  const { t } = useLanguage();
  const [clients, setClients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([crmApi.getClients(), crmApi.getVisits({}), crmApi.getFollowUps()])
      .then(([clientsRes, visitsRes, followUpsRes]) => {
        setClients(clientsRes.data.data || []);
        setVisits(visitsRes.data.data || []);
        setFollowUps(followUpsRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const clientCols = [
    { key: 'clientName', label: t('crm.name') },
    { key: 'phone', label: t('crm.phone') },
    { key: 'location', label: t('crm.location') },
    { key: 'farmType', label: t('crm.farmType') },
    { key: 'numberOfBirds', label: t('crm.birds') },
    { key: 'status', label: t('crm.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'assignedExtensionWorkerName', label: t('crm.extensionWorker') },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/crm/clients/${row.id}/edit`)}>
            {t('common.edit')}
          </Button>
          <Button size="sm" variant="outline-success" onClick={() => navigate('/crm/visits/new', { state: { clientId: row.id } })}>
            {t('crm.visit')}
          </Button>
        </div>
      )
    },
  ];

  const visitCols = [
    { key: 'clientName', label: t('crm.client') },
    { key: 'visitDate', label: t('crm.visitDate'), render: (row) => formatDate(row.visitDate) },
    { key: 'visitedBy', label: t('crm.visitedBy') },
    { key: 'purpose', label: t('crm.purpose') },
    { key: 'nextFollowUpDate', label: t('crm.nextFollowUp'), render: (row) => formatDate(row.nextFollowUpDate) },
  ];

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('crm.title')}</h5>
      {followUps.length > 0 && (
        <div className="alert alert-warning py-2 small mb-3">
          <strong>{followUps.length}</strong> {t('crm.followupsDue', { count: followUps.length })}
        </div>
      )}
      <Tab.Container defaultActiveKey="clients">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="clients">{t('crm.clients')} ({clients.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="visits">{t('crm.farmVisits')} ({visits.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="followups">{t('crm.followups')} <span className="badge bg-warning text-dark">{followUps.length}</span></Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="clients">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/crm/clients/new')}>{t('crm.addClient')}</Button>
            </div>
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={clientCols} data={clients} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="visits">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/crm/visits/new')}>{t('crm.recordVisit')}</Button>
            </div>
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={visitCols} data={visits} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="followups">
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={visitCols} data={followUps} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default CrmPage;
