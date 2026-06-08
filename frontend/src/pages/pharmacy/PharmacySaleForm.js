import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { crmApi, farmApi, flockApi, inventoryApi, pharmacyApi, vetApi } from '../../api';
import { Card, Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils';
import { useLanguage } from '../../context/LanguageContext';

const PharmacySaleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const selectedPrescription = location.state?.prescription;

  const [form, setForm] = useState({
    receiptNumber: `SALE-${Date.now()}`,
    dispensingType: selectedPrescription?.prescriptionType === 'INTERNAL_FARM' ? 'INTERNAL_FARM_USE' : 'EXTERNAL_CUSTOMER_SALE',
    customerId: '',
    farmId: selectedPrescription?.farmId || '',
    flockId: selectedPrescription?.flockId || '',
    clientId: selectedPrescription?.clientId || '',
    saleDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    prescriptionId: selectedPrescription?.id || '',
  });
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [clients, setClients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    inventoryItemId: selectedPrescription?.inventoryItemId || '',
    quantity: selectedPrescription?.quantity || '',
    unitPrice: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pharmacyApi.getCustomers().then((r) => setCustomers(r.data.data || []));
    farmApi.getAll().then((r) => setFarms(r.data.data?.filter((farm) => farm.status === 'ACTIVE') || []));
    crmApi.getClients().then((r) => setClients(r.data.data || []));
    vetApi.getPrescriptions().then((r) => setPrescriptions((r.data.data || []).filter((prescription) => prescription.status === 'PENDING')));
    inventoryApi.getItems().then((r) => setInventoryItems(r.data.data?.filter((item) => item.status === 'ACTIVE') || []));
  }, []);

  useEffect(() => {
    if (form.farmId) {
      flockApi.getAll().then((r) => setFlocks(r.data.data?.filter((flock) => String(flock.farmId) === String(form.farmId) && flock.status === 'ACTIVE') || []));
    } else {
      setFlocks([]);
    }
  }, [form.farmId]);

  const applyPrescription = (prescriptionId) => {
    const prescription = prescriptions.find((item) => String(item.id) === String(prescriptionId)) || selectedPrescription;
    if (!prescription) return;
    setForm((prev) => ({
      ...prev,
      prescriptionId: prescription.id,
      dispensingType: prescription.prescriptionType === 'INTERNAL_FARM' ? 'INTERNAL_FARM_USE' : 'EXTERNAL_CUSTOMER_SALE',
      farmId: prescription.farmId || '',
      flockId: prescription.flockId || '',
      clientId: prescription.clientId || '',
    }));
    setCurrentItem((prev) => ({
      ...prev,
      inventoryItemId: prescription.inventoryItemId || prev.inventoryItemId,
      quantity: prescription.quantity || prev.quantity,
    }));
  };

  const addItem = () => {
    if (!currentItem.inventoryItemId || !currentItem.quantity || !currentItem.unitPrice) return;
    const inv = inventoryItems.find((item) => String(item.id) === String(currentItem.inventoryItemId));
    setItems((prev) => [
      ...prev,
      {
        ...currentItem,
        itemName: inv?.itemName,
        total: Number(currentItem.quantity) * Number(currentItem.unitPrice),
      },
    ]);
    setCurrentItem({ inventoryItemId: '', quantity: '', unitPrice: '' });
  };

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError(t('pharmacySale.addAtLeastOne'));
      return;
    }
    setLoading(true);
    try {
      await pharmacyApi.createSale({
        ...form,
        customerId: form.customerId ? Number(form.customerId) : null,
        farmId: form.farmId ? Number(form.farmId) : null,
        flockId: form.flockId ? Number(form.flockId) : null,
        clientId: form.clientId ? Number(form.clientId) : null,
        paymentMethod: form.dispensingType === 'INTERNAL_FARM_USE' ? null : form.paymentMethod,
        prescriptionId: form.prescriptionId ? Number(form.prescriptionId) : null,
        items: items.map((item) => ({
          inventoryItemId: Number(item.inventoryItemId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
      toast.success(t('pharmacySale.success'));
      navigate('/pharmacy');
    } catch (err) {
      setError(err.response?.data?.message || t('pharmacySale.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('pharmacySale.title')}</h5>
      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
      <Row className="g-3">
        <Col xs={12} lg={7}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3">{t('pharmacySale.details')}</h6>
              <Row className="g-3">
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.dispensingType')}</Form.Label><Form.Select value={form.dispensingType} onChange={(e) => setForm({ ...form, dispensingType: e.target.value })}><option value="EXTERNAL_CUSTOMER_SALE">{t('options.EXTERNAL_CUSTOMER_SALE')}</option><option value="INTERNAL_FARM_USE">{t('options.INTERNAL_FARM_USE')}</option></Form.Select></Form.Group></Col>
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.receiptNumber')}</Form.Label><Form.Control value={form.receiptNumber} onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })} required /></Form.Group></Col>
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.date')}</Form.Label><Form.Control type="date" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} /></Form.Group></Col>
                <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.prescription')}</Form.Label><Form.Select value={form.prescriptionId} onChange={(e) => applyPrescription(e.target.value)}><option value="">{t('forms.optional')}</option>{prescriptions.map((p) => <option key={p.id} value={p.id}>{p.prescriptionNumber} - {p.drugName}</option>)}</Form.Select></Form.Group></Col>
                {form.dispensingType === 'INTERNAL_FARM_USE' ? (
                  <>
                    <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.farm')}</Form.Label><Form.Select value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value, flockId: '' })} required><option value="">{t('forms.selectFarm')}</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.farmName}</option>)}</Form.Select></Form.Group></Col>
                    <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.flock')}</Form.Label><Form.Select value={form.flockId} onChange={(e) => setForm({ ...form, flockId: e.target.value })}><option value="">{t('forms.selectFlock')}</option>{flocks.map((f) => <option key={f.id} value={f.id}>{f.batchCode}</option>)}</Form.Select></Form.Group></Col>
                  </>
                ) : (
                  <>
                    <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.customer')}</Form.Label><Form.Select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}><option value="">{t('pharmacySale.walkIn')}</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.customerName}</option>)}</Form.Select></Form.Group></Col>
                    <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.linkedClient')}</Form.Label><Form.Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">{t('pharmacySale.linkedClientOptional')}</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.clientName}</option>)}</Form.Select></Form.Group></Col>
                    <Col xs={6}><Form.Group><Form.Label className="small fw-semibold">{t('pharmacySale.paymentMethod')}</Form.Label><Form.Select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>{['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CREDIT'].map((m) => <option key={m} value={m}>{t(`options.${m}`)}</option>)}</Form.Select></Form.Group></Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3">{t('pharmacySale.addItems')}</h6>
              <Row className="g-2 align-items-end">
                <Col xs={5}><Form.Select value={currentItem.inventoryItemId} onChange={(e) => setCurrentItem({ ...currentItem, inventoryItemId: e.target.value })}><option value="">{t('forms.selectItem')}</option>{inventoryItems.map((i) => <option key={i.id} value={i.id}>{i.itemName} ({i.currentStock} {i.unit})</option>)}</Form.Select></Col>
                <Col xs={3}><Form.Control type="number" min="0.01" step="0.01" placeholder={t('pharmacySale.qtyPlaceholder')} value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })} /></Col>
                <Col xs={3}><Form.Control type="number" min="0.01" step="0.01" placeholder={t('pharmacySale.unitPricePlaceholder')} value={currentItem.unitPrice} onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })} /></Col>
                <Col xs={1}><Button variant="success" onClick={addItem}>+</Button></Col>
              </Row>
              <div className="text-muted small mt-2">{t('pharmacySale.help')}</div>
              {items.length > 0 && (
                <Table size="sm" className="mt-3">
                  <thead><tr><th>{t('pharmacySale.item')}</th><th>{t('pharmacySale.qty')}</th><th>{t('pharmacySale.price')}</th><th>{t('pharmacySale.total')}</th><th></th></tr></thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{formatCurrency(item.total)}</td>
                        <td><Button size="sm" variant="outline-danger" onClick={() => removeItem(i)}>x</Button></td>
                      </tr>
                    ))}
                    <tr className="fw-bold"><td colSpan={3}>{t('pharmacySale.total')}</td><td>{formatCurrency(total)}</td><td></td></tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="fw-semibold mb-3">{t('pharmacySale.summary')}</h6>
              <div className="d-flex justify-content-between mb-2"><span>{t('pharmacySale.items')}:</span><span>{items.length}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>{t('pharmacySale.mode')}:</span><span>{form.dispensingType === 'INTERNAL_FARM_USE' ? t('options.INTERNAL_FARM_USE') : t('options.EXTERNAL_CUSTOMER_SALE')}</span></div>
              <div className="d-flex justify-content-between mb-3 fw-bold fs-5"><span>{t('pharmacySale.total')}:</span><span className="text-success">{formatCurrency(total)}</span></div>
              <Button variant="success" className="w-100" onClick={handleSubmit} disabled={loading || items.length === 0}>
                {loading ? t('pharmacySale.processing') : t('pharmacySale.complete')}
              </Button>
              <Button variant="outline-secondary" className="w-100 mt-2" onClick={() => navigate('/pharmacy')}>{t('common.cancel')}</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PharmacySaleForm;
