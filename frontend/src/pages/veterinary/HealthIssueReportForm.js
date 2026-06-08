import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { farmApi, flockApi, vetApi } from '../../api';
import { useLanguage } from '../../context/LanguageContext';

const HealthIssueReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const dailyRecord = location.state?.dailyRecord;

  const [form, setForm] = useState({
    farmId: dailyRecord?.farmId || '',
    flockId: dailyRecord?.flockId || '',
    dailyFarmRecordId: dailyRecord?.id || null,
    reportDate: dailyRecord?.date || new Date().toISOString().split('T')[0],
    symptoms: dailyRecord?.symptomsOrRemarks || '',
    mortalityObserved: dailyRecord?.mortality ?? '',
    numberAffected: '',
    remarks: '',
  });
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    farmApi.getAll().then((r) => setFarms(r.data.data?.filter((farm) => farm.status === 'ACTIVE') || []));
  }, []);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll().then((r) => setFlocks(r.data.data?.filter((flock) => String(flock.farmId) === String(form.farmId) && flock.status === 'ACTIVE') || []));
    } else {
      setFlocks([]);
    }
  }, [form.farmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await vetApi.createHealthReport({
        ...form,
        farmId: Number(form.farmId),
        flockId: Number(form.flockId),
        dailyFarmRecordId: form.dailyFarmRecordId ? Number(form.dailyFarmRecordId) : null,
        mortalityObserved: form.mortalityObserved ? Number(form.mortalityObserved) : null,
        numberAffected: form.numberAffected ? Number(form.numberAffected) : null,
      });
      toast.success(t('healthReportForm.success'));
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || t('healthReportForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('healthReportForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 760 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => setForm((prev) => ({ ...prev, farmId: e.target.value, flockId: '' }))} required><option value="">{t('forms.selectFarm')}</option>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.farmName}</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm((prev) => ({ ...prev, flockId: e.target.value }))} required><option value="">{t('forms.selectFlock')}</option>{flocks.map((flock) => <option key={flock.id} value={flock.id}>{flock.batchCode}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.reportDate')}</Form.Label><Form.Control type="date" value={form.reportDate} onChange={(e) => setForm((prev) => ({ ...prev, reportDate: e.target.value }))} /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.mortalityObserved')}</Form.Label><Form.Control type="number" min="0" value={form.mortalityObserved} onChange={(e) => setForm((prev) => ({ ...prev, mortalityObserved: e.target.value }))} /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.numberAffected')}</Form.Label><Form.Control type="number" min="0" value={form.numberAffected} onChange={(e) => setForm((prev) => ({ ...prev, numberAffected: e.target.value }))} /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.symptoms')}</Form.Label><Form.Control as="textarea" rows={3} value={form.symptoms} onChange={(e) => setForm((prev) => ({ ...prev, symptoms: e.target.value }))} /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('healthReportForm.remarks')}</Form.Label><Form.Control as="textarea" rows={2} value={form.remarks} onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))} /></Form.Group></Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="danger" disabled={loading}>{loading ? t('healthReportForm.submitting') : t('healthReportForm.submit')}</Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>{t('forms.cancel')}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HealthIssueReportForm;
