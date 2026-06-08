import React, { useEffect, useState } from 'react';
import { Button, Card, Nav, Tab, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { financeApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatCurrency } from '../../utils';

const FinancePage = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [profitLoss, setProfitLoss] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([financeApi.getAll(), financeApi.getProfitLoss({})])
      .then(([tRes, plRes]) => {
        setTransactions(tRes.data.data || []);
        setProfitLoss(plRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key: 'transactionDate', label: t('finance.date'), render: (row) => formatDate(row.transactionDate) },
    {
      key: 'transactionType',
      label: t('finance.type'),
      render: (row) => (
        <span className={`badge bg-${row.transactionType === 'INCOME' ? 'success' : 'danger'}`}>
          {t(`status.${row.transactionType}`)}
        </span>
      )
    },
    { key: 'category', label: t('finance.category') },
    { key: 'amount', label: t('finance.amount'), render: (row) => formatCurrency(row.amount) },
    { key: 'paymentMethod', label: t('finance.payment') },
    { key: 'description', label: t('finance.description') },
    { key: 'recordedBy', label: t('finance.recordedBy') },
  ];

  const income = transactions.filter((transaction) => transaction.transactionType === 'INCOME');
  const expenses = transactions.filter((transaction) => transaction.transactionType === 'EXPENSE');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('finance.title')}</h5>
        <Button variant="success" size="sm" onClick={() => navigate('/finance/new')}>
          {t('finance.add')}
        </Button>
      </div>
      {profitLoss && (
        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <StatCard title={t('finance.totalIncome')} value={formatCurrency(profitLoss.totalIncome)} icon="Income" color="success" />
          </Col>
          <Col xs={12} sm={4}>
            <StatCard title={t('finance.totalExpenses')} value={formatCurrency(profitLoss.totalExpenses)} icon="Expenses" color="danger" />
          </Col>
          <Col xs={12} sm={4}>
            <StatCard
              title={t('finance.netProfitLoss')}
              value={formatCurrency(profitLoss.netProfitLoss)}
              icon="Profit"
              color={profitLoss.netProfitLoss >= 0 ? 'success' : 'danger'}
            />
          </Col>
        </Row>
      )}
      <Tab.Container defaultActiveKey="all">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="all">{t('finance.all')} ({transactions.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="income">{t('finance.income')} ({income.length})</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="expenses">{t('finance.expenses')} ({expenses.length})</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="all"><Card className="border-0 shadow-sm"><Card.Body><DataTable columns={cols} data={transactions} loading={loading} /></Card.Body></Card></Tab.Pane>
          <Tab.Pane eventKey="income"><Card className="border-0 shadow-sm"><Card.Body><DataTable columns={cols} data={income} loading={loading} /></Card.Body></Card></Tab.Pane>
          <Tab.Pane eventKey="expenses"><Card className="border-0 shadow-sm"><Card.Body><DataTable columns={cols} data={expenses} loading={loading} /></Card.Body></Card></Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default FinancePage;
