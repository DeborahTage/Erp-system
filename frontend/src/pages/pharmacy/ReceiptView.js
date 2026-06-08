import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pharmacyApi } from '../../api';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';
import { formatDate, formatCurrency } from '../../utils';
import { useLanguage } from '../../context/LanguageContext';

const ReceiptView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    pharmacyApi.getReceipt(id).then((r) => setSale(r.data.data));
  }, [id]);

  if (!sale) return <p>{t('common.loading')}</p>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-3">
            <div className="fs-4">TR</div>
            <h5 className="fw-bold text-success">Trust Agro</h5>
            <p className="text-muted small mb-0">{t('receiptView.title')}</p>
          </div>
          <hr />
          <Row className="mb-2">
            <Col xs={6}><small className="text-muted">{t('receiptView.receiptNumber')}</small><div className="fw-semibold">{sale.receiptNumber}</div></Col>
            <Col xs={6}><small className="text-muted">{t('receiptView.date')}</small><div className="fw-semibold">{formatDate(sale.saleDate)}</div></Col>
          </Row>
          <Row className="mb-3">
            <Col xs={6}><small className="text-muted">{t('receiptView.customer')}</small><div>{sale.customerName || t('receiptView.walkIn')}</div></Col>
            <Col xs={6}><small className="text-muted">{t('receiptView.payment')}</small><div>{sale.paymentMethod ? t(`options.${sale.paymentMethod}`) : '-'}</div></Col>
          </Row>
          <Table size="sm" bordered>
            <thead className="table-light"><tr><th>{t('receiptView.item')}</th><th>{t('receiptView.qty')}</th><th>{t('receiptView.price')}</th><th>{t('receiptView.total')}</th></tr></thead>
            <tbody>
              {sale.items?.map((item, i) => (
                <tr key={i}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={3} className="fw-bold text-end">{t('receiptView.total')}</td><td className="fw-bold">{formatCurrency(sale.totalAmount)}</td></tr></tfoot>
          </Table>
          <div className="text-center mt-3 text-muted small">{t('receiptView.thankYou')}</div>
          <div className="d-flex gap-2 mt-3">
            <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/pharmacy')}>{t('common.back')}</Button>
            <Button variant="success" className="w-100" onClick={() => window.print()}>{t('common.print')}</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReceiptView;
