import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, Form, Button, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import trustLogo from '../../assets/trust-logo.jpg';
import loginSlide1 from '../../assets/login-slide-1.webp';
import loginSlide2 from '../../assets/login-slide-2.jpg';
import loginSlide3 from '../../assets/login-slide-3.jpg';
import loginSlide4 from '../../assets/login-slide-4.jpg';
import loginSlide5 from '../../assets/login-slide-5.jpg';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const backgroundSlides = [loginSlide1, loginSlide2, loginSlide3, loginSlide4, loginSlide5];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [backgroundSlides.length]);

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
      <div className="login-background-layer" aria-hidden="true">
        {backgroundSlides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            className={`login-background-image ${index === currentSlide ? 'is-active' : ''}`}
          />
        ))}
      </div>
      <Container className="login-shell">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="login-card border-0">
              <Card.Body className="login-card-body">
                <div className="text-center login-logo-wrap">
                  <img src={trustLogo} alt="Trust Agro logo" className="login-logo" />
                </div>

                <div className="text-center login-copy">
                  <div className="login-badge">{t('login.badge')}</div>
                  <p className="login-eyebrow mb-2">{t('login.eyebrow')}</p>
                  <h1 className="login-title mb-2">{t('login.title')}</h1>
                  <p className="login-tagline mb-0">{t('login.tagline')}</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold login-label">{t('login.email')}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="login-input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold login-label">{t('login.password')}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('login.passwordPlaceholder')}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="login-input login-password-input"
                        required
                      />
                      <Button
                        type="button"
                        variant="light"
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
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-end mb-4">
                    <a href="#forgot-password" className="login-forgot-link">
                      {t('login.forgotPassword')}
                    </a>
                  </div>

                  <Button type="submit" variant="success" className="w-100" disabled={loading}>
                    {loading ? t('login.signingIn') : t('login.signIn')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
