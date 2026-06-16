import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingApi } from '../../api';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const TrainerForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    organization: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    trainingApi.getTrainer(id)
      .then((res) => {
        const trainer = res.data.data;
        setForm({
          fullName: trainer.fullName || '',
          email: trainer.email || '',
          phone: trainer.phone || '',
          specialization: trainer.specialization || '',
          organization: trainer.organization || '',
          status: trainer.status || 'ACTIVE',
          notes: trainer.notes || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || t('trainingForm.loadError')));
  }, [id, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await trainingApi.updateTrainer(id, form);
        toast.success(t('trainerForm.successUpdate'));
      } else {
        await trainingApi.createTrainer(form);
        toast.success(t('trainerForm.successCreate'));
      }
      navigate('/training');
    } catch (err) {
      setError(err.response?.data?.message || t('trainerForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{isEdit ? t('trainerForm.editTitle') : t('trainerForm.addTitle')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 760 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.fullName')}</Form.Label><Form.Control value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.email')}</Form.Label><Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.phone')}</Form.Label><Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.specialization')}</Form.Label><Form.Control value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.organization')}</Form.Label><Form.Control value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.status')}</Form.Label><Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['ACTIVE', 'INACTIVE'].map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainerForm.notes')}</Form.Label><Form.Control as="textarea" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Form.Group></Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="success" disabled={loading}>{loading ? t('forms.saving') : t('forms.save')}</Button>
              <Button variant="outline-secondary" onClick={() => navigate('/training')}>{t('forms.cancel')}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrainerForm;
