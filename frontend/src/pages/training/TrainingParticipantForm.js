import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingApi } from '../../api';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const TrainingParticipantForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    participantRole: '',
    location: '',
    sessionId: '',
    status: 'REGISTERED',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trainingApi.getSessions()
      .then((res) => setSessions(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    trainingApi.getParticipant(id)
      .then((res) => {
        const participant = res.data.data;
        setForm({
          fullName: participant.fullName || '',
          email: participant.email || '',
          phone: participant.phone || '',
          organization: participant.organization || '',
          participantRole: participant.participantRole || '',
          location: participant.location || '',
          sessionId: participant.sessionId || '',
          status: participant.status || 'REGISTERED',
          notes: participant.notes || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || t('trainingForm.loadError')));
  }, [id, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, sessionId: Number(form.sessionId) };
      if (isEdit) {
        await trainingApi.updateParticipant(id, payload);
        toast.success(t('trainingParticipantForm.successUpdate'));
      } else {
        await trainingApi.createParticipant(payload);
        toast.success(t('trainingParticipantForm.successCreate'));
      }
      navigate('/training');
    } catch (err) {
      setError(err.response?.data?.message || t('trainingParticipantForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{isEdit ? t('trainingParticipantForm.editTitle') : t('trainingParticipantForm.addTitle')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 860 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.fullName')}</Form.Label><Form.Control value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.email')}</Form.Label><Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.phone')}</Form.Label><Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.organization')}</Form.Label><Form.Control value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.participantRole')}</Form.Label><Form.Control value={form.participantRole} onChange={(e) => setForm({ ...form, participantRole: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.location')}</Form.Label><Form.Control value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.session')}</Form.Label><Form.Select value={form.sessionId} onChange={(e) => setForm({ ...form, sessionId: e.target.value })} required><option value="">{t('forms.select')}</option>{sessions.map((session) => <option key={session.id} value={session.id}>{session.title}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.status')}</Form.Label><Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['REGISTERED', 'ATTENDED', 'CANCELLED'].map((status) => <option key={status} value={status}>{t(`status.${status}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('trainingParticipantForm.notes')}</Form.Label><Form.Control as="textarea" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Form.Group></Col>
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

export default TrainingParticipantForm;
