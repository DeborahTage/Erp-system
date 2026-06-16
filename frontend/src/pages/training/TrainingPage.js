import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { trainingApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const TrainingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      trainingApi.getSummary(),
      trainingApi.getTrainers(),
      trainingApi.getSessions(),
      trainingApi.getParticipants(),
    ])
      .then(([summaryRes, trainersRes, sessionsRes, participantsRes]) => {
        setSummary(summaryRes.data.data || {});
        setTrainers(trainersRes.data.data || []);
        setSessions(sessionsRes.data.data || []);
        setParticipants(participantsRes.data.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || t('training.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  const trainerCols = [
    { key: 'fullName', label: t('training.trainerName') },
    { key: 'specialization', label: t('training.specialization') },
    { key: 'organization', label: t('training.organization') },
    { key: 'phone', label: t('training.phone') },
    { key: 'status', label: t('training.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/training/trainers/${row.id}/edit`)}>
          {t('common.edit')}
        </Button>
      )
    },
  ];

  const sessionCols = [
    { key: 'title', label: t('training.sessionTitle') },
    { key: 'topic', label: t('training.topic') },
    { key: 'trainingDate', label: t('training.trainingDate'), render: (row) => formatDate(row.trainingDate) },
    { key: 'trainerName', label: t('training.trainer') },
    { key: 'venue', label: t('training.venue') },
    { key: 'registeredParticipants', label: t('training.registeredCount') },
    { key: 'status', label: t('training.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/training/sessions/${row.id}/edit`)}>
          {t('common.edit')}
        </Button>
      )
    },
  ];

  const participantCols = [
    { key: 'fullName', label: t('training.participantName') },
    { key: 'sessionTitle', label: t('training.session') },
    { key: 'organization', label: t('training.organization') },
    { key: 'participantRole', label: t('training.participantRole') },
    { key: 'phone', label: t('training.phone') },
    { key: 'status', label: t('training.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/training/participants/${row.id}/edit`)}>
          {t('common.edit')}
        </Button>
      )
    },
  ];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h5 className="fw-bold mb-1">{t('training.title')}</h5>
          <div className="text-muted small">{t('training.help')}</div>
        </div>
      </div>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <Row className="g-3 mb-4">
        <Col xs={12} md={6} xl={3}><StatCard title={t('training.totalTrainers')} value={summary.totalTrainers ?? 0} icon="T" color="success" /></Col>
        <Col xs={12} md={6} xl={3}><StatCard title={t('training.activeTrainers')} value={summary.activeTrainers ?? 0} icon="A" color="primary" /></Col>
        <Col xs={12} md={6} xl={3}><StatCard title={t('training.plannedSessions')} value={summary.plannedSessions ?? 0} icon="P" color="warning" /></Col>
        <Col xs={12} md={6} xl={3}><StatCard title={t('training.registeredParticipants')} value={summary.registeredParticipants ?? 0} icon="R" color="info" /></Col>
      </Row>

      <Tab.Container defaultActiveKey="sessions">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="sessions">{t('training.sessions')} ({sessions.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="trainers">{t('training.trainers')} ({trainers.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="participants">{t('training.participants')} ({participants.length})</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="sessions">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/training/sessions/new')}>
                {t('training.addSession')}
              </Button>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body><DataTable columns={sessionCols} data={sessions} loading={loading} /></Card.Body>
            </Card>
          </Tab.Pane>
          <Tab.Pane eventKey="trainers">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/training/trainers/new')}>
                {t('training.addTrainer')}
              </Button>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body><DataTable columns={trainerCols} data={trainers} loading={loading} /></Card.Body>
            </Card>
          </Tab.Pane>
          <Tab.Pane eventKey="participants">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/training/participants/new')}>
                {t('training.addParticipant')}
              </Button>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body><DataTable columns={participantCols} data={participants} loading={loading} /></Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default TrainingPage;
