import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vetApi, farmApi, flockApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const TreatmentForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ farmId: '', flockId: '', diseaseCaseId: '', drugName: '', dosage: '', route: '', duration: '', startDate: '', endDate: '', outcome: '' });
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.allSettled([farmApi.getAll(), vetApi.getDiseaseCases()]).then(([farmsRes, casesRes]) => {
      setFarms(farmsRes.status === 'fulfilled' ? farmsRes.value.data.data?.filter((f) => f.status === 'ACTIVE') || [] : []);
      setCases(casesRes.status === 'fulfilled' ? casesRes.value.data.data?.filter((c) => c.status === 'ACTIVE') || [] : []);
      const rejectedResult = [farmsRes, casesRes].find((result) => result.status === 'rejected');
      if (rejectedResult) {
        setError(rejectedResult.reason?.response?.data?.message || t('treatmentForm.error'));
      }
    });
  }, [t]);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll()
        .then((r) => setFlocks(r.data.data?.filter((f) => String(f.farmId) === String(form.farmId) && f.status === 'ACTIVE') || []))
        .catch((err) => {
          setFlocks([]);
          setError(err.response?.data?.message || t('treatmentForm.error'));
        });
    } else {
      setFlocks([]);
    }
  }, [form.farmId, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vetApi.createTreatment({ ...form, farmId: Number(form.farmId), flockId: Number(form.flockId), diseaseCaseId: form.diseaseCaseId ? Number(form.diseaseCaseId) : null });
      toast.success(t('treatmentForm.success'));
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || t('treatmentForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('treatmentForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => setForm((f) => ({ ...f, farmId: e.target.value, flockId: '' }))} required><option value="">{t('forms.select')}</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm({ ...form, flockId: e.target.value })} required><option value="">{t('forms.select')}</option>{flocks.map((f) => <option key={f.id} value={f.id}>{f.batchCode}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.diseaseCase')}</Form.Label><Form.Select value={form.diseaseCaseId} onChange={(e) => setForm({ ...form, diseaseCaseId: e.target.value })}><option value="">{t('forms.none')}</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.suspectedDisease} - {c.farmName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.drugName')}</Form.Label><Form.Control value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.dosage')}</Form.Label><Form.Control value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.route')}</Form.Label><Form.Control value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.duration')}</Form.Label><Form.Control value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.outcome')}</Form.Label><Form.Control value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.startDate')}</Form.Label><Form.Control type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('treatmentForm.endDate')}</Form.Label><Form.Control type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Form.Group></Col>
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

export default TreatmentForm;
