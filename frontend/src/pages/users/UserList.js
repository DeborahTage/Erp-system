import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils';

const UserList = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getAll().then(r => setUsers(r.data.data)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'fullName', label: t('users.name') },
    { key: 'email', label: t('users.email') },
    { key: 'phone', label: t('users.phone') },
    { key: 'role', label: t('users.role'), render: r => <span className="badge bg-primary">{t(`roles.${r.role}`)}</span> },
    { key: 'status', label: t('users.status'), render: r => <StatusBadge status={r.status} /> },
    { key: 'createdAt', label: t('users.created'), render: r => formatDate(r.createdAt) },
    {
      key: 'actions', label: t('users.actions'),
      render: r => (
        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/users/${r.id}/edit`)}>
          {t('common.edit')}
        </Button>
      )
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{t('users.title')}</h5>
        <Button variant="success" size="sm" onClick={() => navigate('/users/new')}>{t('users.add')}</Button>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <DataTable columns={columns} data={users} loading={loading} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserList;
