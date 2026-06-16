import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';
import FarmList from './pages/farm/FarmList';
import FarmForm from './pages/farm/FarmForm';
import FlockList from './pages/farm/FlockList';
import FlockForm from './pages/farm/FlockForm';
import DailyFarmRecordList from './pages/farm/DailyFarmRecordList';
import DailyFarmRecordForm from './pages/farm/DailyFarmRecordForm';
import InventoryItemList from './pages/inventory/InventoryItemList';
import InventoryItemForm from './pages/inventory/InventoryItemForm';
import StockInForm from './pages/inventory/StockInForm';
import StockOutForm from './pages/inventory/StockOutForm';
import VeterinaryPage from './pages/veterinary/VeterinaryPage';
import VaccinationForm from './pages/veterinary/VaccinationForm';
import HealthIssueReportForm from './pages/veterinary/HealthIssueReportForm';
import DiseaseCaseForm from './pages/veterinary/DiseaseCaseForm';
import TreatmentForm from './pages/veterinary/TreatmentForm';
import PrescriptionForm from './pages/veterinary/PrescriptionForm';
import PharmacyPage from './pages/pharmacy/PharmacyPage';
import PharmacySaleForm from './pages/pharmacy/PharmacySaleForm';
import CustomerForm from './pages/pharmacy/CustomerForm';
import ReceiptView from './pages/pharmacy/ReceiptView';
import FinancePage from './pages/finance/FinancePage';
import TransactionForm from './pages/finance/TransactionForm';
import CrmPage from './pages/crm/CrmPage';
import CrmClientForm from './pages/crm/CrmClientForm';
import FarmVisitForm from './pages/crm/FarmVisitForm';
import TrainingPage from './pages/training/TrainingPage';
import TrainerForm from './pages/training/TrainerForm';
import TrainingSessionForm from './pages/training/TrainingSessionForm';
import TrainingParticipantForm from './pages/training/TrainingParticipantForm';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

const ADMIN_ROLES = ['ADMIN', 'GENERAL_MANAGER'];
const FARM_MANAGEMENT_ROLES = ['ADMIN', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER'];
const TRAINING_ROLES = ['ADMIN', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER'];

function App() {
  useEffect(() => {
    const getHttpStatus = (reason) => (
      reason?.response?.status
      || reason?.status
      || reason?.cause?.response?.status
      || reason?.error?.response?.status
      || null
    );

    const handleUnhandledRejection = (event) => {
      const reason = event.reason;
      const status = getHttpStatus(reason);
      const message = String(
        reason?.message
        || reason?.toString?.()
        || ''
      );

      const looksLikeAuthHttpError = [401, 403].includes(status)
        || (/status code 401/i.test(message))
        || (/status code 403/i.test(message));

      if (!looksLikeAuthHttpError) {
        return;
      }

      event.preventDefault();

      if (status === 401 || /status code 401/i.test(message)) {
        return;
      }

      if (status === 403 || /status code 403/i.test(message)) {
        toast.error('You do not have permission to access that resource.', {
          toastId: 'forbidden-request',
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="users" element={<ProtectedRoute roles={[...ADMIN_ROLES, 'OPERATIONS_MANAGER']}><UserList /></ProtectedRoute>} />
              <Route path="users/new" element={<ProtectedRoute roles={['ADMIN']}><UserForm /></ProtectedRoute>} />
              <Route path="users/:id/edit" element={<ProtectedRoute roles={['ADMIN']}><UserForm /></ProtectedRoute>} />

              <Route path="farms" element={<FarmList />} />
              <Route path="farms/new" element={<ProtectedRoute roles={FARM_MANAGEMENT_ROLES}><FarmForm /></ProtectedRoute>} />
              <Route path="farms/:id/edit" element={<ProtectedRoute roles={FARM_MANAGEMENT_ROLES}><FarmForm /></ProtectedRoute>} />

              <Route path="flocks" element={<FlockList />} />
              <Route path="flocks/new" element={<FlockForm />} />
              <Route path="flocks/:id/edit" element={<FlockForm />} />

              <Route path="daily-records" element={<DailyFarmRecordList />} />
              <Route path="daily-records/new" element={<DailyFarmRecordForm />} />
              <Route path="daily-records/:id/edit" element={<DailyFarmRecordForm />} />

              <Route path="inventory" element={<InventoryItemList />} />
              <Route path="inventory/items/new" element={<InventoryItemForm />} />
              <Route path="inventory/items/:id/edit" element={<InventoryItemForm />} />
              <Route path="inventory/stock-in" element={<StockInForm />} />
              <Route path="inventory/stock-out" element={<StockOutForm />} />

              <Route path="veterinary" element={<VeterinaryPage />} />
              <Route path="veterinary/vaccinations/new" element={<VaccinationForm />} />
              <Route path="veterinary/health-reports/new" element={<HealthIssueReportForm />} />
              <Route path="veterinary/disease-cases/new" element={<DiseaseCaseForm />} />
              <Route path="veterinary/treatments/new" element={<TreatmentForm />} />
              <Route path="veterinary/prescriptions/new" element={<PrescriptionForm />} />

              <Route path="pharmacy" element={<PharmacyPage />} />
              <Route path="pharmacy/sales/new" element={<PharmacySaleForm />} />
              <Route path="pharmacy/sales/:id/receipt" element={<ReceiptView />} />
              <Route path="pharmacy/customers/new" element={<CustomerForm />} />

              <Route path="finance" element={<FinancePage />} />
              <Route path="finance/new" element={<TransactionForm />} />

              <Route path="crm" element={<CrmPage />} />
              <Route path="crm/clients/new" element={<CrmClientForm />} />
              <Route path="crm/clients/:id/edit" element={<CrmClientForm />} />
              <Route path="crm/visits/new" element={<FarmVisitForm />} />

              <Route path="training" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainingPage /></ProtectedRoute>} />
              <Route path="training/trainers/new" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainerForm /></ProtectedRoute>} />
              <Route path="training/trainers/:id/edit" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainerForm /></ProtectedRoute>} />
              <Route path="training/sessions/new" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainingSessionForm /></ProtectedRoute>} />
              <Route path="training/sessions/:id/edit" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainingSessionForm /></ProtectedRoute>} />
              <Route path="training/participants/new" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainingParticipantForm /></ProtectedRoute>} />
              <Route path="training/participants/:id/edit" element={<ProtectedRoute roles={TRAINING_ROLES}><TrainingParticipantForm /></ProtectedRoute>} />

              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
