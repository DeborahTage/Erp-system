import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { dailyRecordApi, inventoryApi, financeApi, pharmacyApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatCurrency } from '../../utils';

const PERIOD_OPTIONS = ['daily', 'weekly', 'monthly'];

const getPeriodRange = (period) => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  if (period === 'weekly') {
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(today.getDate() + diffToMonday);
    end.setDate(start.getDate() + 6);
  } else if (period === 'monthly') {
    start.setDate(1);
    end.setMonth(today.getMonth() + 1, 0);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const normalizeDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const Reports = () => {
  const { t } = useLanguage();
  const [activeReport, setActiveReport] = useState('mortality');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('daily');

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        let res;
        if (activeReport === 'mortality' || activeReport === 'daily') res = await dailyRecordApi.getAll();
        else if (activeReport === 'stock') res = await inventoryApi.getCurrentStock();
        else if (activeReport === 'lowstock') res = await inventoryApi.getLowStock();
        else if (activeReport === 'expiry') res = await inventoryApi.getExpiryAlerts();
        else if (activeReport === 'sales') res = await pharmacyApi.getSales();
        else if (activeReport === 'income') res = await financeApi.getIncome();
        else if (activeReport === 'expenses') res = await financeApi.getExpenses();
        setData(res?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [activeReport]);

  const getReportDateValue = (row) => {
    if (['daily', 'mortality'].includes(activeReport)) return row.date;
    if (activeReport === 'sales') return row.saleDate;
    if (['income', 'expenses'].includes(activeReport)) return row.transactionDate;
    if (activeReport === 'expiry') return row.expiryDate;
    return null;
  };

  const reportTypes = [
    { key: 'daily', label: t('reportsPage.daily') },
    { key: 'mortality', label: t('reportsPage.mortality') },
    { key: 'stock', label: t('reportsPage.stock') },
    { key: 'lowstock', label: t('reportsPage.lowstock') },
    { key: 'expiry', label: t('reportsPage.expiry') },
    { key: 'sales', label: t('reportsPage.sales') },
    { key: 'income', label: t('reportsPage.income') },
    { key: 'expenses', label: t('reportsPage.expenses') },
  ];

  const dailyCols = [
    { key: 'date', label: t('reportsPage.date'), render: r => formatDate(r.date) },
    { key: 'farmName', label: t('reportsPage.farm') }, { key: 'batchCode', label: t('reportsPage.batch') },
    { key: 'openingBirdCount', label: t('reportsPage.opening') }, { key: 'mortality', label: t('reportsPage.mortalityCol') },
    { key: 'mortalityRate', label: t('reportsPage.rate'), render: r => r.mortalityRate ? `${r.mortalityRate.toFixed(2)}%` : '-' },
    { key: 'feedConsumed', label: t('reportsPage.feed') }, { key: 'eggProduction', label: t('reportsPage.eggs') },
  ];

  const stockCols = [
    { key: 'itemName', label: t('reportsPage.item') }, { key: 'category', label: t('reportsPage.category') },
    { key: 'unit', label: t('reportsPage.unit') }, { key: 'currentStock', label: t('reportsPage.currentStock') },
    { key: 'minimumStockLevel', label: t('reportsPage.minLevel') },
  ];

  const expiryCols = [
    { key: 'item', label: t('reportsPage.item'), render: r => r.item?.itemName },
    { key: 'batchNumber', label: t('reportsPage.batch') }, { key: 'quantityRemaining', label: t('reportsPage.qty') },
    { key: 'expiryDate', label: t('reportsPage.expiryCol'), render: r => formatDate(r.expiryDate) },
  ];

  const salesCols = [
    { key: 'receiptNumber', label: t('reportsPage.receipt') }, { key: 'customerName', label: t('reportsPage.customer') },
    { key: 'saleDate', label: t('reportsPage.date'), render: r => formatDate(r.saleDate) },
    { key: 'totalAmount', label: t('reportsPage.amount'), render: r => formatCurrency(r.totalAmount) },
    { key: 'paymentMethod', label: t('reportsPage.payment') },
  ];

  const financeCols = [
    { key: 'transactionDate', label: t('reportsPage.date'), render: r => formatDate(r.transactionDate) },
    { key: 'category', label: t('reportsPage.category') }, { key: 'amount', label: t('reportsPage.amount'), render: r => formatCurrency(r.amount) },
    { key: 'description', label: t('reportsPage.description') },
  ];

  const getColumns = () => {
    if (['daily', 'mortality'].includes(activeReport)) return dailyCols;
    if (['stock', 'lowstock'].includes(activeReport)) return stockCols;
    if (activeReport === 'expiry') return expiryCols;
    if (activeReport === 'sales') return salesCols;
    return financeCols;
  };

  const supportsPeriodFilter = ['daily', 'mortality', 'sales', 'income', 'expenses', 'expiry'].includes(activeReport);
  const periodRange = getPeriodRange(reportPeriod);
  const filteredData = supportsPeriodFilter
    ? data.filter((row) => {
      const rowDate = normalizeDate(getReportDateValue(row));
      return rowDate && rowDate >= periodRange.start && rowDate <= periodRange.end;
    })
    : data;
  const columns = getColumns();
  const selectedReportLabel = reportTypes.find((report) => report.key === activeReport)?.label || t('reportsPage.title');

  const getCellText = (row, column) => {
    const rawValue = column.render ? column.render(row) : row[column.key];
    if (rawValue === null || rawValue === undefined || rawValue === '') return '-';
    if (typeof rawValue === 'string' || typeof rawValue === 'number') return String(rawValue);
    return '-';
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const headerRow = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
    const bodyRows = filteredData.map((row) => (
      `<tr>${columns.map((column) => `<td>${escapeHtml(getCellText(row, column))}</td>`).join('')}</tr>`
    )).join('');
    const html = `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>${escapeHtml(selectedReportLabel)}</h2>
          <p>${escapeHtml(t(`reportsPage.${reportPeriod}Period`))}</p>
          <table border="1">
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>
    `;
    downloadFile(
      new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' }),
      `${activeReport}-${reportPeriod}-report.xls`
    );
  };

  const exportToPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) return;

    const headerRow = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
    const bodyRows = filteredData.map((row) => (
      `<tr>${columns.map((column) => `<td>${escapeHtml(getCellText(row, column))}</td>`).join('')}</tr>`
    )).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(selectedReportLabel)}</title>
          <style>
            body { font-family: "Times New Roman", serif; padding: 24px; color: #1f2937; }
            h2 { margin-bottom: 8px; }
            p { margin-top: 0; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; font-size: 12px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h2>${escapeHtml(selectedReportLabel)}</h2>
          <p>${escapeHtml(t(`reportsPage.${reportPeriod}Period`))}</p>
          <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{t('reportsPage.title')}</h5>
      <Row className="g-3">
        <Col xs={12} md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-2">
              {reportTypes.map(r => (
                <button key={r.key} className={`btn btn-sm w-100 text-start mb-1 ${activeReport === r.key ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setActiveReport(r.key)}>
                  {r.label}
                </button>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                <div>
                  <h6 className="fw-semibold mb-1">{selectedReportLabel}</h6>
                  <span className="text-muted small">{filteredData.length} {t('common.records')}</span>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
                  <Form.Select
                    size="sm"
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    style={{ minWidth: '180px' }}
                  >
                    {PERIOD_OPTIONS.map((period) => (
                      <option key={period} value={period}>
                        {t(`reportsPage.${period}Period`)}
                      </option>
                    ))}
                  </Form.Select>
                  <Button size="sm" variant="outline-success" onClick={exportToExcel}>
                    {t('reportsPage.exportExcel')}
                  </Button>
                  <Button size="sm" variant="success" onClick={exportToPdf}>
                    {t('reportsPage.exportPdf')}
                  </Button>
                </div>
              </div>
              <DataTable columns={columns} data={filteredData} loading={loading} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
