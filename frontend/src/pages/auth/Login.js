import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import trustLogo from '../../assets/trust-logo.jpg';
import loginSlide1 from '../../assets/login-slide-1.webp';
import loginSlide2 from '../../assets/login-slide-2.jpg';
import loginSlide3 from '../../assets/login-slide-3.jpg';
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
  const backgroundSlides = [loginSlide1, loginSlide2, loginSlide3];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 5000);
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
      setError(err.response?.data?.message || t('login.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-slideshow">
        {backgroundSlides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
        <div className="overlay" />
      </div>

      <div className="login-card-container">
        <div className="login-box">
          <div className="flex justify-center mb-6">
            <img src={trustLogo} alt="Logo" className="w-20 h-20 rounded-2xl shadow-xl border-2 border-white" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('login.title')}</h1>
            <p className="text-gray-500 mt-2 font-medium">{t('login.tagline')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center">
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">{t('login.email')}</label>
              <input
                type="email"
                placeholder={t('login.emailPlaceholder')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">{t('login.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.passwordPlaceholder')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all outline-none text-gray-900 font-medium pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#forgot" className="text-xs font-bold text-green-700 hover:text-green-800 hover:underline">{t('login.forgotPassword')}</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:shadow-green-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
            >
              {loading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">© 2026 Trust Agro Consulting. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
