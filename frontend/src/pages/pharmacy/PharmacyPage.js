import React, { useEffect, useState } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { pharmacyApi, vetApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatCurrency } from '../../utils';

const PharmacyPage = () => {
  const { t } = useLanguage();
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([pharmacyApi.getSales(), pharmacyApi.getCustomers(), vetApi.getPrescriptions()])
      .then(([salesRes, customersRes, prescriptionsRes]) => {
        setSales(salesRes.data.data || []);
        setCustomers(customersRes.data.data || []);
        setPendingPrescriptions((prescriptionsRes.data.data || []).filter((item) => item.status === 'PENDING'));
      })
      .finally(() => setLoading(false));
  }, []);

  const salesCols = [
    { key: 'receiptNumber', label: t('receiptView.receiptNumber') },
    { key: 'customerName', label: t('pharmacy.customer') },
    { key: 'saleDate', label: t('pharmacy.date'), render: (r) => formatDate(r.saleDate) },
    { key: 'totalAmount', label: t('pharmacy.total'), render: (r) => formatCurrency(r.totalAmount) },
    { key: 'paymentMethod', label: t('pharmacy.payment') },
    { key: 'soldBy', label: t('pharmacy.soldBy') },
    { key: 'actions', label: '', render: (r) => <Button size="sm" variant="outline-primary" onClick={() => navigate(`/pharmacy/sales/${r.id}/receipt`)}>{t('pharmacy.receipt')}</Button> },
  ];

  const customerCols = [
    { key: 'customerName', label: t('pharmacy.name') },
    { key: 'phone', label: t('pharmacy.phone') },
    { key: 'location', label: t('pharmacy.location') },
    { key: 'customerType', label: t('pharmacy.type'), render: (r) => t(`options.${r.customerType}`) },
  ];

  const prescriptionCols = [
    { key: 'prescriptionNumber', label: t('veterinary.rxNo') },
    { key: 'prescriptionType', label: t('pharmacy.type'), render: (r) => t(`status.${r.prescriptionType}`) },
    { key: 'farmName', label: t('pharmacy.farm') },
    { key: 'batchCode', label: t('pharmacy.batch') },
    { key: 'drugName', label: t('pharmacy.drug') },
    { key: 'quantity', label: t('pharmacy.qty') },
    { key: 'dosageInstruction', label: t('pharmacy.instructions') },
    { key: 'status', label: t('farms.status'), render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <Button size="sm" variant="outline-success" onClick={() => navigate('/pharmacy/sales/new', { state: { prescription: r } })}>
          {t('pharmacy.completeDispensing')}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('pharmacy.title')}</h5>
      <Tab.Container defaultActiveKey="sales">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="sales">{t('pharmacy.sales')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="prescriptions">{t('pharmacy.pendingPrescriptions')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="customers">{t('pharmacy.customers')}</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="sales">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/pharmacy/sales/new')}>{t('pharmacy.newSale')}</Button>
            </div>
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={salesCols} data={sales} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="prescriptions">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="text-muted small">{t('pharmacy.help')}</div>
              <Button size="sm" variant="success" onClick={() => navigate('/pharmacy/sales/new')}>{t('pharmacy.newWalkIn')}</Button>
            </div>
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={prescriptionCols} data={pendingPrescriptions} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="customers">
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="success" onClick={() => navigate('/pharmacy/customers/new')}>{t('pharmacy.addCustomer')}</Button>
            </div>
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={customerCols} data={customers} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default PharmacyPage;
