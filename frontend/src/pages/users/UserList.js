import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils';
import { PERMISSIONS } from '../../lib/permissions';
import { Button } from '../../components/ui/button';
import { MoreHorizontal, Edit, UserCheck, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const UserList = () => {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getAll().then(r => setUsers(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (user) => {
    const activating = user.status !== 'ACTIVE';
    if (activating && !hasPermission(PERMISSIONS.ACTIVATE_USERS)) return;
    if (!activating && !hasPermission(PERMISSIONS.DEACTIVATE_USERS)) return;
    try {
      const newStatus = activating ? 'ACTIVE' : 'INACTIVE';
      await userApi.updateStatus(user.id, newStatus);
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const columns = [
    { key: 'fullName', label: t('users.name') },
    { key: 'email', label: t('users.email') },
    { key: 'phone', label: t('users.phone') },
    { 
      key: 'role', 
      label: t('users.role'), 
      render: r => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {r.role}
        </span>
      )
    },
    { key: 'status', label: t('users.status'), render: r => <StatusBadge status={r.status?.toLowerCase()} /> },
    { key: 'createdAt', label: t('users.created'), render: r => formatDate(r.createdAt) },
    {
      key: 'actions', 
      label: t('users.actions'),
      render: r => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hasPermission(PERMISSIONS.EDIT_USERS) && (
              <DropdownMenuItem onClick={() => navigate(`/users/${r.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>
            )}
            {(hasPermission(PERMISSIONS.ACTIVATE_USERS) || hasPermission(PERMISSIONS.DEACTIVATE_USERS)) && (
              <DropdownMenuItem onClick={() => handleToggleStatus(r)}>
                {r.status === 'ACTIVE' ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('users.title')}
        subtitle="Manage system users and their permissions"
        actionLabel={t('users.add')}
        onAction={() => navigate('/users/new')}
        showAction={hasPermission(PERMISSIONS.CREATE_USERS)}
      />
      <DataTable 
        columns={columns} 
        data={users} 
        loading={loading}
        searchable={true}
        pagination={true}
        pageSize={10}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default UserList;
