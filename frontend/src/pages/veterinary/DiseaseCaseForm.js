import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vetApi, farmApi, flockApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const DiseaseCaseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const healthReport = location.state?.healthReport;
  const [form, setForm] = useState({
    farmId: healthReport?.farmId || '',
    flockId: healthReport?.flockId || '',
    dateDetected: healthReport?.reportDate || '',
    symptoms: healthReport?.symptoms || '',
    suspectedDisease: healthReport?.suspectedDiagnosis || '',
    numberAffected: healthReport?.numberAffected ?? '',
    numberDead: healthReport?.mortalityObserved ?? '',
    severity: healthReport?.severity || 'LOW',
  });
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    farmApi.getAll().then((r) => setFarms(r.data.data?.filter((farm) => farm.status === 'ACTIVE') || []));
  }, []);

  const handleFarmChange = (farmId) => {
    setForm((prev) => ({ ...prev, farmId, flockId: '' }));
    if (farmId) {
      flockApi.getAll().then((r) => setFlocks(r.data.data?.filter((flock) => String(flock.farmId) === String(farmId) && flock.status === 'ACTIVE') || []));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await vetApi.createDiseaseCase({
        ...form,
        farmId: Number(form.farmId),
        flockId: Number(form.flockId),
        numberAffected: form.numberAffected ? Number(form.numberAffected) : null,
        numberDead: form.numberDead ? Number(form.numberDead) : null,
      });
      if (healthReport?.id) {
        await vetApi.reviewHealthReport(healthReport.id, {
          suspectedDiagnosis: form.suspectedDisease,
          severity: form.severity,
          treatmentPlan: healthReport.treatmentPlan,
          status: 'REVIEWED',
          diseaseCaseId: res.data.data?.id,
        });
      }
      toast.success(t('diseaseCaseForm.success'));
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || t('diseaseCaseForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('diseaseCaseForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => handleFarmChange(e.target.value)} required><option value="">{t('forms.select')}</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm({ ...form, flockId: e.target.value })} required><option value="">{t('forms.select')}</option>{flocks.map((f) => <option key={f.id} value={f.id}>{f.batchCode}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.dateDetected')}</Form.Label><Form.Control type="date" value={form.dateDetected} onChange={(e) => setForm({ ...form, dateDetected: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.suspectedDisease')}</Form.Label><Form.Control value={form.suspectedDisease} onChange={(e) => setForm({ ...form, suspectedDisease: e.target.value })} /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.symptoms')}</Form.Label><Form.Control as="textarea" rows={2} value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.affected')}</Form.Label><Form.Control type="number" min="0" value={form.numberAffected} onChange={(e) => setForm({ ...form, numberAffected: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.dead')}</Form.Label><Form.Control type="number" min="0" value={form.numberDead} onChange={(e) => setForm({ ...form, numberDead: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('diseaseCaseForm.severity')}</Form.Label><Form.Select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>{['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="success" disabled={loading}>{loading ? t('forms.saving') : t('forms.save')}</Button>
              <Button variant="outline-secondary" onClick={() => navigate('/veterinary')}>{t('forms.cancel')}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DiseaseCaseForm;
