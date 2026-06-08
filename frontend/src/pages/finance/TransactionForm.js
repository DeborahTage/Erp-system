import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const INCOME_CATS = ['PHARMACY_SALES','EGG_SALES','CHICKEN_SALES','CONSULTING_SERVICE','TRAINING_FEE','OTHER_INCOME'];
const EXPENSE_CATS = ['FEED_PURCHASE','DRUG_PURCHASE','VACCINE_PURCHASE','LABOR','TRANSPORT','UTILITIES','EQUIPMENT','MAINTENANCE','MARKETING','OTHER_EXPENSE'];

const TransactionForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ transactionType: 'INCOME', category: 'OTHER_INCOME', amount: '', paymentMethod: 'CASH', description: '', transactionDate: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = form.transactionType === 'INCOME' ? INCOME_CATS : EXPENSE_CATS;

  const handleTypeChange = (type) => {
    setForm(f => ({ ...f, transactionType: type, category: type === 'INCOME' ? 'OTHER_INCOME' : 'OTHER_EXPENSE' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeApi.create({ ...form, amount: Number(form.amount) });
      toast.success(t('transactionForm.success'));
      navigate('/finance');
    } catch (err) {
      setError(err.response?.data?.message || t('transactionForm.error'));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('transactionForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 500 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.type')}</Form.Label><Form.Select value={form.transactionType} onChange={e => handleTypeChange(e.target.value)}><option value="INCOME">{t('status.INCOME')}</option><option value="EXPENSE">{t('status.EXPENSE')}</option></Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.category')}</Form.Label><Form.Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{t(`options.${c}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.amount')}</Form.Label><Form.Control type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.paymentMethod')}</Form.Label><Form.Select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>{['CASH','BANK_TRANSFER','MOBILE_MONEY','CREDIT'].map(m => <option key={m}>{t(`options.${m}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.date')}</Form.Label><Form.Control type="date" value={form.transactionDate} onChange={e => setForm({ ...form, transactionDate: e.target.value })} /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('transactionForm.description')}</Form.Label><Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Form.Group></Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="success" disabled={loading}>{loading ? t('forms.saving') : t('forms.save')}</Button>
              <Button variant="outline-secondary" onClick={() => navigate('/finance')}>{t('forms.cancel')}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TransactionForm;
