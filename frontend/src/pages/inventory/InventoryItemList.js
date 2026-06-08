import React, { useEffect, useState } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const InventoryItemList = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiry, setExpiry] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      inventoryApi.getItems(),
      inventoryApi.getLowStock(),
      inventoryApi.getExpiryAlerts(),
      inventoryApi.getMovements(),
    ]).then(([itemsRes, lowStockRes, expiryRes, movementsRes]) => {
      setItems(itemsRes.data.data || []);
      setLowStock(lowStockRes.data.data || []);
      setExpiry(expiryRes.data.data || []);
      setMovements(movementsRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const itemColumns = [
    { key: 'itemName', label: t('inventory.itemName') },
    { key: 'category', label: t('inventory.category') },
    { key: 'unit', label: t('inventory.unit') },
    { key: 'currentStock', label: t('inventory.currentStock') },
    { key: 'minimumStockLevel', label: t('inventory.minLevel') },
    { key: 'status', label: t('inventory.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: t('inventory.actions'),
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/inventory/items/${row.id}/edit`)}>{t('common.edit')}</Button>
          <Button size="sm" variant="outline-success" onClick={() => navigate('/inventory/stock-in', { state: { itemId: row.id } })}>{t('common.stockIn')}</Button>
          <Button size="sm" variant="outline-warning" onClick={() => navigate('/inventory/stock-out', { state: { itemId: row.id } })}>{t('common.stockOut')}</Button>
        </div>
      )
    },
  ];

  const expiryColumns = [
    { key: 'item', label: t('inventory.item'), render: (row) => row.item?.itemName },
    { key: 'batchNumber', label: t('inventory.batch') },
    { key: 'quantityRemaining', label: t('inventory.qtyRemaining') },
    { key: 'expiryDate', label: t('inventory.expiryDate'), render: (row) => formatDate(row.expiryDate) },
    { key: 'supplier', label: t('inventory.supplier') },
  ];

  const movementColumns = [
    { key: 'movementDate', label: 'Date', render: (row) => formatDate(row.movementDate) },
    { key: 'itemName', label: t('inventory.item') },
    { key: 'movementType', label: 'Movement' },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'destination',
      label: 'Destination',
      render: (row) => row.issuedToType || row.department || row.referenceType || '-',
    },
    { key: 'reason', label: t('finance.description'), render: (row) => row.reason || '-' },
    { key: 'performedByName', label: 'Performed By', render: (row) => row.performedByName || '-' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('inventory.title')}</h5>
        <Button variant="success" size="sm" onClick={() => navigate('/inventory/items/new')}>{t('inventory.add')}</Button>
      </div>
      <Tab.Container defaultActiveKey="all">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="all">{t('inventory.allItems')}</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="low">{t('inventory.lowStock')} <span className="badge bg-warning text-dark">{lowStock.length}</span></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="expiry">{t('inventory.expiring')} <span className="badge bg-danger">{expiry.length}</span></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="movements">Stock Movements <span className="badge bg-info">{movements.length}</span></Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="all">
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={itemColumns} data={items} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="low">
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={itemColumns} data={lowStock} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="expiry">
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={expiryColumns} data={expiry} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
          <Tab.Pane eventKey="movements">
            <Card className="border-0 shadow-sm"><Card.Body><DataTable columns={movementColumns} data={movements} loading={loading} /></Card.Body></Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default InventoryItemList;
