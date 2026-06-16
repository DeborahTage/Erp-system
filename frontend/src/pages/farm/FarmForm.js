import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { farmApi, userApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';
import { Building2, MapPin, Users, Settings } from 'lucide-react';

const FarmForm = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ farmName: '', location: '', farmType: 'BROILER', capacity: '', assignedFarmManagerId: '' });
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userApi.getAll().then(r => setManagers(r.data.data?.filter(u => u.role === 'FARM_MANAGER') || []));
    if (isEdit) {
      farmApi.getById(id).then(r => {
        const f = r.data.data;
        setForm({ farmName: f.farmName, location: f.location || '', farmType: f.farmType, capacity: f.capacity || '', assignedFarmManagerId: f.assignedFarmManagerId || '' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity), assignedFarmManagerId: form.assignedFarmManagerId || null };
      if (isEdit) await farmApi.update(id, payload);
      else await farmApi.create(payload);
      toast.success(isEdit ? t('farmEditForm.successUpdate') : t('farmEditForm.successCreate'));
      navigate('/farms');
    } catch (err) {
      setError(err.response?.data?.message || t('farmEditForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEdit ? t('farmEditForm.editTitle') : t('farmEditForm.addTitle')}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? 'Update farm information and settings' : 'Add a new farm to the system'}
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
          <CardTitle>Farm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="farmName">{t('farmEditForm.farmName')} *</Label>
                  <Input
                    id="farmName"
                    value={form.farmName}
                    onChange={e => setForm({ ...form, farmName: e.target.value })}
                    required
                    placeholder="Enter farm name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('farmEditForm.location')}</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmType">{t('farmEditForm.farmType')}</Label>
                  <Select value={form.farmType} onValueChange={value => setForm({ ...form, farmType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BROILER">{t('options.BROILER')}</SelectItem>
                      <SelectItem value="LAYER">{t('options.LAYER')}</SelectItem>
                      <SelectItem value="MIXED">{t('options.MIXED')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Capacity & Management Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Capacity & Management</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t('farmEditForm.capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                    placeholder="Enter capacity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">{t('farmEditForm.manager')}</Label>
                  <Select value={form.assignedFarmManagerId} onValueChange={value => setForm({ ...form, assignedFarmManagerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('forms.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('forms.select')}</SelectItem>
                      {managers.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={loading}>
                {loading ? t('forms.saving') : t('forms.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/farms')}>
                {t('forms.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmForm;
