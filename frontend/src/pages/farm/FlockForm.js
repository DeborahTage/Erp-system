import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flockApi, farmApi } from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { useMasterData } from '../../context/MasterDataContext';
import { toast } from 'react-toastify';
import { Hash, Building2, Feather, Calendar, TrendingUp } from 'lucide-react';

const FlockForm = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ batchCode: '', farmId: '', birdType: '', initialBirdCount: '', startDate: '', expectedEndDate: '' });
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { options: breedOptions } = useMasterData('BREED');

  useEffect(() => {
    farmApi.getAll().then(r => setFarms(r.data.data?.filter(f => f.status === 'ACTIVE') || []));
    if (isEdit) {
      flockApi.getById(id).then(r => {
        const f = r.data.data;
        setForm({ batchCode: f.batchCode, farmId: f.farmId, birdType: f.birdType || '', initialBirdCount: f.initialBirdCount || '', startDate: f.startDate || '', expectedEndDate: f.expectedEndDate || '' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, farmId: Number(form.farmId), initialBirdCount: Number(form.initialBirdCount) };
      if (isEdit) await flockApi.update(id, payload);
      else await flockApi.create(payload);
      toast.success(isEdit ? t('flockForm.successUpdate') : t('flockForm.successCreate'));
      navigate('/flocks');
    } catch (err) {
      setError(err.response?.data?.message || t('flockForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEdit ? t('flockForm.editTitle') : t('flockForm.addTitle')}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? 'Update flock information and tracking' : 'Add a new flock to the system'}
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
          <CardTitle>Flock Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchCode">{t('flockForm.batchCode')} *</Label>
                  <Input
                    id="batchCode"
                    value={form.batchCode}
                    onChange={e => setForm({ ...form, batchCode: e.target.value })}
                    required
                    disabled={isEdit}
                    placeholder="Enter batch code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmId">{t('flockForm.farm')} *</Label>
                  <Select value={form.farmId} onValueChange={value => setForm({ ...form, farmId: value })} disabled={isEdit}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('forms.selectFarm')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('forms.selectFarm')}</SelectItem>
                      {farms.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.farmName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birdType">{t('flockForm.birdType')}</Label>
                  <Select value={form.birdType} onValueChange={value => setForm({ ...form, birdType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Breed Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select Breed Phase</SelectItem>
                      {breedOptions.map(b => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBirdCount">{t('flockForm.initialBirdCount')}</Label>
                  <Input
                    id="initialBirdCount"
                    type="number"
                    value={form.initialBirdCount}
                    onChange={e => setForm({ ...form, initialBirdCount: e.target.value })}
                    disabled={isEdit}
                    placeholder="Enter initial bird count"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Timeline</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('flockForm.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedEndDate">{t('flockForm.expectedEndDate')}</Label>
                  <Input
                    id="expectedEndDate"
                    type="date"
                    value={form.expectedEndDate}
                    onChange={e => setForm({ ...form, expectedEndDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={loading}>
                {loading ? t('forms.saving') : t('forms.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/flocks')}>
                {t('forms.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlockForm;
