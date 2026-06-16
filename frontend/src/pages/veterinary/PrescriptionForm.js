import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { crmApi, farmApi, flockApi, inventoryApi, vetApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const healthReport = location.state?.healthReport;
  const diseaseCase = location.state?.diseaseCase;

  const [form, setForm] = useState({
    prescriptionNumber: `RX-${Date.now()}`,
    prescriptionType: healthReport?.clientId ? 'EXTERNAL_CLIENT' : 'INTERNAL_FARM',
    drugName: '',
    quantity: '',
    dosageInstruction: healthReport?.treatmentPlan || '',
    farmId: healthReport?.farmId || diseaseCase?.farmId || '',
    flockId: healthReport?.flockId || diseaseCase?.flockId || '',
    clientId: healthReport?.clientId || '',
    diseaseCaseId: diseaseCase?.id || healthReport?.diseaseCaseId || '',
    inventoryItemId: '',
  });
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [clients, setClients] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.allSettled([farmApi.getAll(), crmApi.getClients(), inventoryApi.getItems()]).then(([farmsRes, clientsRes, inventoryRes]) => {
      setFarms(farmsRes.status === 'fulfilled' ? farmsRes.value.data.data?.filter((farm) => farm.status === 'ACTIVE') || [] : []);
      setClients(clientsRes.status === 'fulfilled' ? clientsRes.value.data.data || [] : []);
      setInventoryItems(inventoryRes.status === 'fulfilled' ? inventoryRes.value.data.data?.filter((item) => item.status === 'ACTIVE') || [] : []);
      const rejectedResult = [farmsRes, clientsRes, inventoryRes].find((result) => result.status === 'rejected');
      if (rejectedResult) {
        setError(rejectedResult.reason?.response?.data?.message || t('prescriptionForm.error'));
      }
    });
  }, []);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll()
        .then((r) => setFlocks(r.data.data?.filter((flock) => String(flock.farmId) === String(form.farmId) && flock.status === 'ACTIVE') || []))
        .catch((err) => {
          setFlocks([]);
          setError(err.response?.data?.message || t('prescriptionForm.error'));
        });
    } else {
      setFlocks([]);
    }
  }, [form.farmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vetApi.createPrescription({
        ...form,
        quantity: Number(form.quantity),
        farmId: form.farmId ? Number(form.farmId) : null,
        flockId: form.flockId ? Number(form.flockId) : null,
        clientId: form.clientId ? Number(form.clientId) : null,
        diseaseCaseId: form.diseaseCaseId ? Number(form.diseaseCaseId) : null,
        inventoryItemId: form.inventoryItemId ? Number(form.inventoryItemId) : null,
      });
      toast.success(t('prescriptionForm.success'));
      navigate('/veterinary');
    } catch (err) {
      setError(err.response?.data?.message || t('prescriptionForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('prescriptionForm.title')}</h5>
      <Card className="border-0 shadow-sm" style={{ maxWidth: 680 }}>
        <Card.Body className="p-4">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.prescriptionType')}</Form.Label><Form.Select value={form.prescriptionType} onChange={(e) => setForm({ ...form, prescriptionType: e.target.value })}><option value="INTERNAL_FARM">{t('prescriptionForm.internalFarm')}</option><option value="EXTERNAL_CLIENT">{t('prescriptionForm.externalClient')}</option></Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.rxNumber')}</Form.Label><Form.Control value={form.prescriptionNumber} onChange={(e) => setForm({ ...form, prescriptionNumber: e.target.value })} required /></Form.Group></Col>
              {form.prescriptionType === 'INTERNAL_FARM' ? (
                <>
                  <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value, flockId: '' })} required><option value="">{t('forms.select')}</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
                  <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm({ ...form, flockId: e.target.value })} required><option value="">{t('forms.select')}</option>{flocks.map((f) => <option key={f.id} value={f.id}>{f.batchCode}</option>)}</Form.Select></Form.Group></Col>
                </>
              ) : (
                <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.client')}</Form.Label><Form.Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">{t('forms.select')}</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.clientName}</option>)}</Form.Select></Form.Group></Col>
              )}
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.inventoryItem')}</Form.Label><Form.Select value={form.inventoryItemId} onChange={(e) => { const selected = inventoryItems.find((item) => String(item.id) === String(e.target.value)); setForm({ ...form, inventoryItemId: e.target.value, drugName: selected?.itemName || form.drugName }); }} required><option value="">{t('forms.selectItem')}</option>{inventoryItems.map((item) => <option key={item.id} value={item.id}>{item.itemName}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.drugName')}</Form.Label><Form.Control value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })} required /></Form.Group></Col>
              <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.quantity')}</Form.Label><Form.Control type="number" min="0.01" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></Form.Group></Col>
              <Col xs={12}><Form.Group><Form.Label className="small fw-semibold">{t('prescriptionForm.dosageInstructions')}</Form.Label><Form.Control as="textarea" rows={2} value={form.dosageInstruction} onChange={(e) => setForm({ ...form, dosageInstruction: e.target.value })} /></Form.Group></Col>
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

export default PrescriptionForm;
