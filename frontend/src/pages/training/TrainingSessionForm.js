import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingApi } from '../../api';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const TrainingSessionForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    topic: '',
    trainingDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    venue: '',
    capacity: '',
    trainerId: '',
    status: 'PLANNED',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trainingApi.getTrainers()
      .then((res) => setTrainers(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    trainingApi.getSession(id)
      .then((res) => {
        const session = res.data.data;
        setForm({
          title: session.title || '',
          topic: session.topic || '',
          trainingDate: session.trainingDate || new Date().toISOString().split('T')[0],
          startTime: session.startTime || '',
          endTime: session.endTime || '',
          venue: session.venue || '',
          capacity: session.capacity || '',
          trainerId: session.trainerId || '',
          status: session.status || 'PLANNED',
          description: session.description || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || t('trainingForm.loadError')));
  }, [id, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
        trainerId: form.trainerId ? Number(form.trainerId) : null,
      };
      if (isEdit) {
        await trainingApi.updateSession(id, payload);
        toast.success(t('trainingSessionForm.successUpdate'));
      } else {
        await trainingApi.createSession(payload);
        toast.success(t('trainingSessionForm.successCreate'));
      }
      navigate('/training');
    } catch (err) {
      setError(err.response?.data?.message || t('trainingSessionForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{isEdit ? t('trainingSessionForm.editTitle') : t('trainingSessionForm.addTitle')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 860 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.title')}</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.topic')}</Form.Label><Form.Control value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.trainer')}</Form.Label><Form.Select value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}><option value="">{t('forms.none')}</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.fullName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.trainingDate')}</Form.Label><Form.Control type="date" value={form.trainingDate} onChange={(e) => setForm({ ...form, trainingDate: e.target.value })} required /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.startTime')}</Form.Label><Form.Control type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></Form.Group></Col>
              <Col xs={4}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.endTime')}</Form.Label><Form.Control type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.venue')}</Form.Label><Form.Control value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Form.Group></Col>
              <Col xs={3}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.capacity')}</Form.Label><Form.Control type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></Form.Group></Col>
              <Col xs={3}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.status')}</Form.Label><Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainingSessionForm.description')}</Form.Label><Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group></Col>
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

export default TrainingSessionForm;
