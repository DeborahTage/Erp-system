import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';
import { ROLES } from '../../utils';
import { User, Mail, Phone, Shield, Lock } from 'lucide-react';

const ROLE_OPTIONS = Object.values(ROLES);

const UserForm = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'FARM_MANAGER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      userApi.getById(id).then(r => {
        const u = r.data.data;
        setForm({ fullName: u.fullName, email: u.email, phone: u.phone || '', password: '', role: u.role });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await userApi.update(id, form);
      else await userApi.create(form);
      toast.success(isEdit ? t('userForm.successUpdate') : t('userForm.successCreate'));
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || t('userForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEdit ? t('userForm.editTitle') : t('userForm.addTitle')}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? 'Update user information and access permissions' : 'Add a new user to the system'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">{t('userForm.fullName')} *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">{t('userForm.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={isEdit}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('userForm.phone')}</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('userForm.role')}</Label>
                  <Select value={form.role} onValueChange={value => setForm({ ...form, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map(r => (
                        <SelectItem key={r} value={r}>{t(`roles.${r}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{isEdit ? t('userForm.newPassword') : t('userForm.password')} {!isEdit && '*'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required={!isEdit}
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                />
                {isEdit && (
                  <p className="text-sm text-gray-500">Leave blank to keep current password</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={loading}>
                {loading ? t('forms.saving') : t('forms.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                {t('forms.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
