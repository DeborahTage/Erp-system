import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import trustLogo from '../../assets/trust-logo.jpg';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const brandLines = ['Trust Agro', 'Farm Operations', 'Management System'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'ECONNABORTED' || !err.response) {
        setError(t('login.backendError'));
      } else {
        setError(err.response?.data?.message || t('login.loginError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="login-shell">
        <Row className="g-0 login-layout">
          <Col lg={6} className="login-brand-panel">
            <div className="login-brand-inner">
              <div className="login-brand-mark">
                <img src={trustLogo} alt="Trust Agro logo" className="login-brand-logo" />
              </div>
              <div className="login-brand-copy">
                <div className="login-brand-badge">{t('login.badge')}</div>
                <h1 className="login-brand-title">
                  {brandLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h1>
                <p className="login-brand-text">{t('login.tagline')}</p>
              </div>
            </div>
          </Col>

          <Col lg={6} className="login-form-column">
            <div className="login-form-panel">
              <div className="login-form-inner">
                <div className="login-copy">
                  <p className="login-panel-kicker">{t('login.signIn')}</p>
                  <h2 className="login-panel-title">{t('login.eyebrow')}</h2>
                </div>

                {error && <Alert variant="danger" className="login-alert py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="login-form">
                  <Form.Group className="login-group">
                    <Form.Label className="small fw-semibold login-label">{t('login.email')}</Form.Label>
                    <div className="login-field-shell">
                      <span className="login-field-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M3 7.5h18v9H3z" />
                          <path d="m4 8 8 6 8-6" />
                        </svg>
                      </span>
                      <Form.Control
                        type="email"
                        placeholder={t('login.emailPlaceholder')}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="login-input login-input-with-icon"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="login-group">
                    <Form.Label className="small fw-semibold login-label">{t('login.password')}</Form.Label>
                    <div className="login-field-shell">
                      <span className="login-field-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <rect x="4" y="11" width="16" height="10" rx="2" />
                          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                        </svg>
                      </span>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('login.passwordPlaceholder')}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="login-input login-input-with-icon login-input-with-toggle"
                        required
                      />
                      <Button
                        type="button"
                        variant="link"
                        className="login-visibility-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 4.5 19.5 21" />
                            <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
                            <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.91c5.05 0 9.27 3.11 10.5 7.09a11.8 11.8 0 0 1-3.04 4.75" />
                            <path d="M6.61 6.62A11.84 11.84 0 0 0 1.5 12c1.23 3.98 5.45 7.09 10.5 7.09a11 11 0 0 0 4.16-.81" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M1.5 12S5.73 4.91 12 4.91 22.5 12 22.5 12 18.27 19.09 12 19.09 1.5 12 1.5 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="login-submit-button w-100"
                    disabled={loading}
                  >
                    {loading ? t('login.signingIn') : t('login.signIn')}
                  </Button>
                </Form>

                <p className="login-access-note">Only authorized accounts can access the portal.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
