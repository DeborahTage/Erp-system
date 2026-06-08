import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(t('settings.newPasswordsDoNotMatch'));
      return;
    }
    setLoading(true);
    try {
      toast.success(t('settings.passwordUpdated'));
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(t('settings.failedToUpdatePassword'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('settings.title')}</h5>
      <Row className="g-3">
        <Col xs={12} md={5}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3">{t('settings.profile')}</h6>
              <div className="mb-2"><span className="text-muted small">{t('settings.name')}:</span><div className="fw-semibold">{user?.fullName}</div></div>
              <div className="mb-2"><span className="text-muted small">{t('settings.email')}:</span><div>{user?.email}</div></div>
              <div className="mb-2"><span className="text-muted small">{t('settings.role')}:</span><div><span className="badge bg-success">{user?.role ? t(`roles.${user.role}`) : ''}</span></div></div>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3">{t('settings.changePassword')}</h6>
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">{t('settings.currentPassword')}</Form.Label>
                  <Form.Control type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">{t('settings.newPassword')}</Form.Label>
                  <Form.Control type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">{t('settings.confirmNewPassword')}</Form.Label>
                  <Form.Control type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
                </Form.Group>
                <Button type="submit" variant="success" disabled={loading}>{loading ? t('settings.updating') : t('settings.updatePassword')}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
