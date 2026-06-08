import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { farmApi, inventoryApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const StockOutForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    itemId: location.state?.itemId || '',
    quantity: '',
    reason: '',
    issuedToType: 'INTERNAL',
    farmId: '',
    department: '',
    referenceType: '',
    referenceId: '',
    movementDate: new Date().toISOString().split('T')[0],
  });
  const [items, setItems] = useState([]);
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inventoryApi.getItems().then(r => setItems(r.data.data || []));
    farmApi.getAll().then(r => setFarms(r.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inventoryApi.stockOut({
        ...form,
        itemId: Number(form.itemId),
        quantity: Number(form.quantity),
        farmId: form.farmId ? Number(form.farmId) : null,
        referenceId: form.referenceId ? Number(form.referenceId) : null,
        department: form.department || null,
        referenceType: form.referenceType || null,
      });
      toast.success(t('stockOutForm.success'));
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.message || t('stockOutForm.error'));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('stockOutForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 500 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('stockOutForm.item')}</Form.Label><Form.Select value={form.itemId} onChange={e => setForm({ ...form, itemId: e.target.value })} required><option value="">{t('forms.selectItem')}</option>{items.map(i => <option key={i.id} value={i.id}>{i.itemName} ({t('stockOutForm.stockLabel')}: {i.currentStock})</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('stockOutForm.quantity')}</Form.Label><Form.Control type="number" min="0.01" step="0.01" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('stockOutForm.issuedTo')}</Form.Label><Form.Select value={form.issuedToType} onChange={e => setForm({ ...form, issuedToType: e.target.value, farmId: '', department: '' })}>{['FARM','DEPARTMENT','CUSTOMER','INTERNAL'].map(option => <option key={option} value={option}>{t(`options.${option}`)}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">Movement Date</Form.Label><Form.Control type="date" value={form.movementDate} onChange={e => setForm({ ...form, movementDate: e.target.value })} /></Form.Group></Col>
              {form.issuedToType === 'FARM' && (
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('farmEditForm.farmName')}</Form.Label><Form.Select value={form.farmId} onChange={e => setForm({ ...form, farmId: e.target.value })}><option value="">{t('forms.selectFarm')}</option>{farms.map(f => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
              )}
              {form.issuedToType === 'DEPARTMENT' && (
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">Department</Form.Label><Form.Control value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></Form.Group></Col>
              )}
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">Reference Type</Form.Label><Form.Control value={form.referenceType} onChange={e => setForm({ ...form, referenceType: e.target.value })} placeholder="Optional" /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">Reference ID</Form.Label><Form.Control type="number" min="1" value={form.referenceId} onChange={e => setForm({ ...form, referenceId: e.target.value })} placeholder="Optional" /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('stockOutForm.reason')}</Form.Label><Form.Control value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></Form.Group></Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="warning" disabled={loading}>{loading ? t('forms.saving') : t('stockOutForm.submit')}</Button>
              <Button variant="outline-secondary" onClick={() => navigate('/inventory')}>{t('forms.cancel')}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StockOutForm;
