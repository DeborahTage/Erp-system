import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vetApi, farmApi, flockApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const VaccinationForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ farmId: '', flockId: '', vaccineName: '', diseaseProtectedAgainst: '', scheduledDate: '', remarks: '' });
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    farmApi.getAll()
      .then((r) => setFarms(r.data.data?.filter((f) => f.status === 'ACTIVE') || []))
      .catch((err) => setError(err.response?.data?.message || t('vaccinationForm.error')));
  }, [t]);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll()
        .then((r) => setFlocks(r.data.data?.filter((f) => String(f.farmId) === String(form.farmId) && f.status === 'ACTIVE') || []))
        .catch((err) => {
          setFlocks([]);
          setError(err.response?.data?.message || t('vaccinationForm.error'));
        });
    } else {
      setFlocks([]);
    }
  }, [form.farmId, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vetApi.createVaccination({ ...form, farmId: Number(form.farmId), flockId: Number(form.flockId) });
      toast.success(t('vaccinationForm.success'));
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || t('vaccinationForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('vaccinationForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 550 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => setForm((f) => ({ ...f, farmId: e.target.value, flockId: '' }))} required><option value="">{t('forms.select')}</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm({ ...form, flockId: e.target.value })} required><option value="">{t('forms.select')}</option>{flocks.map((f) => <option key={f.id} value={f.id}>{f.batchCode}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.vaccineName')}</Form.Label><Form.Control value={form.vaccineName} onChange={(e) => setForm({ ...form, vaccineName: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.diseaseProtectedAgainst')}</Form.Label><Form.Control value={form.diseaseProtectedAgainst} onChange={(e) => setForm({ ...form, diseaseProtectedAgainst: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.scheduledDate')}</Form.Label><Form.Control type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('vaccinationForm.remarks')}</Form.Label><Form.Control as="textarea" rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></Form.Group></Col>
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

export default VaccinationForm;
