import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal, Nav, Row, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vetApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';
import './VeterinaryPage.css';

const VeterinaryPage = () => {
  const { t } = useLanguage();
  const [vaccinations, setVaccinations] = useState([]);
  const [healthReports, setHealthReports] = useState([]);
  const [diseaseCases, setDiseaseCases] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewForm, setReviewForm] = useState({ suspectedDiagnosis: '', severity: 'LOW', treatmentPlan: '', status: 'REVIEWED' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      vetApi.getVaccinations(),
      vetApi.getHealthReports(),
      vetApi.getDiseaseCases(),
      vetApi.getTreatments(),
      vetApi.getPrescriptions()
    ]).then((results) => {
      const [
        vaccinationsRes,
        healthReportsRes,
        diseaseCasesRes,
        treatmentsRes,
        prescriptionsRes,
      ] = results;

      setVaccinations(vaccinationsRes.status === 'fulfilled' ? vaccinationsRes.value.data.data || [] : []);
      setHealthReports(healthReportsRes.status === 'fulfilled' ? healthReportsRes.value.data.data || [] : []);
      setDiseaseCases(diseaseCasesRes.status === 'fulfilled' ? diseaseCasesRes.value.data.data || [] : []);
      setTreatments(treatmentsRes.status === 'fulfilled' ? treatmentsRes.value.data.data || [] : []);
      setPrescriptions(prescriptionsRes.status === 'fulfilled' ? prescriptionsRes.value.data.data || [] : []);

      const rejectedResult = results.find((result) => result.status === 'rejected');
      setLoadError(rejectedResult?.reason?.response?.data?.message || (rejectedResult ? 'Some veterinary data could not be loaded.' : ''));
    }).finally(() => setLoading(false));
  }, []);

  const completeVaccination = async (id) => {
    try {
      await vetApi.completeVaccination(id);
      setVaccinations((prev) => prev.map((item) => item.id === id ? { ...item, status: 'COMPLETED' } : item));
      toast.success(t('veterinary.vaccinationMarkedComplete'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('veterinary.unableToCompleteVaccination'));
    }
  };

  const openReviewModal = (report) => {
    setSelectedReport(report);
    setReviewForm({
      suspectedDiagnosis: report.suspectedDiagnosis || '',
      severity: report.severity || 'LOW',
      treatmentPlan: report.treatmentPlan || '',
      status: report.status === 'CLOSED' ? 'CLOSED' : 'REVIEWED',
    });
    setReviewError('');
  };

  const submitReview = async () => {
    if (!selectedReport) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await vetApi.reviewHealthReport(selectedReport.id, reviewForm);
      setHealthReports((prev) => prev.map((report) => report.id === selectedReport.id ? res.data.data : report));
      toast.success(t('veterinary.healthReportReviewed'));
      setSelectedReport(null);
    } catch (err) {
      setReviewError(err.response?.data?.message || t('veterinary.unableToReviewReport'));
    } finally {
      setReviewLoading(false);
    }
  };

  const vaccinationCols = [
    { key: 'farmName', label: t('veterinary.farm') },
    { key: 'batchCode', label: t('veterinary.batch') },
    { key: 'vaccineName', label: t('veterinary.vaccine') },
    { key: 'scheduledDate', label: t('veterinary.scheduled'), render: (row) => formatDate(row.scheduledDate) },
    { key: 'actualDate', label: t('veterinary.actual'), render: (row) => formatDate(row.actualDate) },
    { key: 'status', label: t('farms.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: '', render: (row) => row.status === 'SCHEDULED' && <Button size="sm" variant="outline-success" onClick={() => completeVaccination(row.id)}>{t('common.complete')}</Button> },
  ];

  const healthReportCols = [
    { key: 'farmName', label: t('veterinary.farm') },
    { key: 'batchCode', label: t('veterinary.batch') },
    { key: 'reportDate', label: t('veterinary.reportDate'), render: (row) => formatDate(row.reportDate) },
    { key: 'mortalityObserved', label: t('veterinary.mortality') },
    { key: 'numberAffected', label: t('veterinary.affected') },
    { key: 'status', label: t('farms.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'suspectedDiagnosis', label: t('veterinary.suspectedDiagnosis') },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="d-flex gap-1 flex-wrap">
          <Button size="sm" variant="outline-primary" onClick={() => openReviewModal(row)}>{t('common.review')}</Button>
          <Button size="sm" variant="outline-warning" onClick={() => navigate('/veterinary/disease-cases/new', { state: { healthReport: row } })}>{t('common.createCase')}</Button>
          <Button size="sm" variant="outline-success" onClick={() => navigate('/veterinary/prescriptions/new', { state: { healthReport: row } })}>{t('common.createPrescription')}</Button>
        </div>
      ),
    },
  ];

  const diseaseCols = [
    { key: 'farmName', label: t('veterinary.farm') },
    { key: 'suspectedDisease', label: t('veterinary.disease') },
    { key: 'dateDetected', label: t('veterinary.detected'), render: (row) => formatDate(row.dateDetected) },
    { key: 'severity', label: t('veterinary.severity'), render: (row) => <StatusBadge status={row.severity} /> },
    { key: 'status', label: t('farms.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'numberAffected', label: t('veterinary.affected') },
  ];

  const treatmentCols = [
    { key: 'farmName', label: t('veterinary.farm') },
    { key: 'drugName', label: t('veterinary.drug') },
    { key: 'dosage', label: t('veterinary.dosage') },
    { key: 'startDate', label: t('veterinary.start'), render: (row) => formatDate(row.startDate) },
    { key: 'endDate', label: t('veterinary.end'), render: (row) => formatDate(row.endDate) },
    { key: 'vetOfficer', label: t('veterinary.vetOfficer') },
    { key: 'outcome', label: t('veterinary.outcome') },
  ];

  const prescriptionCols = [
    { key: 'prescriptionNumber', label: t('veterinary.rxNo') },
    { key: 'prescriptionType', label: t('veterinary.type'), render: (row) => t(`status.${row.prescriptionType}`) },
    { key: 'farmName', label: t('veterinary.farm') },
    { key: 'batchCode', label: t('veterinary.batch') },
    { key: 'drugName', label: t('veterinary.drug') },
    { key: 'quantity', label: t('veterinary.qty') },
    { key: 'dosageInstruction', label: t('veterinary.instructions') },
    { key: 'createdByVet', label: t('veterinary.vet') },
    { key: 'status', label: t('farms.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: '', render: (row) => row.status === 'PENDING' && <span className="text-muted small">{t('common.visibleInPharmacy')}</span> },
  ];

  return (
    <div className="veterinary-page">
      <h5 className="fw-bold mb-3 veterinary-page-title">{t('veterinary.title')}</h5>
      {loadError && <Alert variant="warning" className="py-2 small">{loadError}</Alert>}
      <Tab.Container defaultActiveKey="vaccinations">
        <Nav variant="tabs" className="mb-3 veterinary-tabs">
          <Nav.Item><Nav.Link eventKey="vaccinations">{t('veterinary.vaccinations')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="healthReports">{t('veterinary.healthReports')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="disease">{t('veterinary.diseaseCases')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="treatments">{t('veterinary.treatments')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="prescriptions">{t('veterinary.prescriptions')}</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="vaccinations">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" className="veterinary-primary-button" onClick={() => navigate('/veterinary/vaccinations/new')}>{t('veterinary.scheduleVaccination')}</Button>
            </div>
            <Card className="border-0 shadow-sm veterinary-record-card"><Card.Body><DataTable columns={vaccinationCols} data={vaccinations} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="healthReports">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="text-muted small">{t('veterinary.healthReportHelp')}</div>
              <Button size="sm" variant="danger" className="veterinary-danger-button" onClick={() => navigate('/veterinary/health-reports/new')}>{t('veterinary.newHealthReport')}</Button>
            </div>
            <Card className="border-0 shadow-sm veterinary-record-card"><Card.Body><DataTable columns={healthReportCols} data={healthReports} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="disease">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" className="veterinary-primary-button" onClick={() => navigate('/veterinary/disease-cases/new')}>{t('veterinary.recordDiseaseCase')}</Button>
            </div>
            <Card className="border-0 shadow-sm veterinary-record-card"><Card.Body><DataTable columns={diseaseCols} data={diseaseCases} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="treatments">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" className="veterinary-primary-button" onClick={() => navigate('/veterinary/treatments/new')}>{t('veterinary.recordTreatment')}</Button>
            </div>
            <Card className="border-0 shadow-sm veterinary-record-card"><Card.Body><DataTable columns={treatmentCols} data={treatments} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="prescriptions">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" className="veterinary-primary-button" onClick={() => navigate('/veterinary/prescriptions/new')}>{t('veterinary.createPrescription')}</Button>
            </div>
            <Card className="border-0 shadow-sm veterinary-record-card"><Card.Body><DataTable columns={prescriptionCols} data={prescriptions} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Modal show={!!selectedReport} onHide={() => setSelectedReport(null)} centered dialogClassName="veterinary-review-modal">
        <Modal.Header closeButton>
          <Modal.Title>{t('veterinary.reviewHealthReport')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewError && <Alert variant="danger" className="py-2 small">{reviewError}</Alert>}
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">{t('veterinary.suspectedDiagnosis')}</Form.Label>
                <Form.Control value={reviewForm.suspectedDiagnosis} onChange={(e) => setReviewForm((prev) => ({ ...prev, suspectedDiagnosis: e.target.value }))} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">{t('veterinary.severity')}</Form.Label>
                <Form.Select value={reviewForm.severity} onChange={(e) => setReviewForm((prev) => ({ ...prev, severity: e.target.value }))}>
                  {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((status) => <option key={status}>{t(`status.${status}`)}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">{t('veterinary.reportStatus')}</Form.Label>
                <Form.Select value={reviewForm.status} onChange={(e) => setReviewForm((prev) => ({ ...prev, status: e.target.value }))}>
                  {['REVIEWED', 'CLOSED'].map((status) => <option key={status}>{t(`status.${status}`)}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">{t('veterinary.treatmentPlan')}</Form.Label>
                <Form.Control as="textarea" rows={3} value={reviewForm.treatmentPlan} onChange={(e) => setReviewForm((prev) => ({ ...prev, treatmentPlan: e.target.value }))} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setSelectedReport(null)}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={submitReview} disabled={reviewLoading}>{reviewLoading ? t('common.saving') : t('common.save')}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VeterinaryPage;
