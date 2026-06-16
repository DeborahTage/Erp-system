import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PATH_MODULE_MAP, FORM_ROUTE_PERMISSIONS } from '../lib/routeAccess';
import { hasPermission } from '../lib/permissions';
import {
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  FileText,
  Package,
  HeartPulse,
  Pill,
  DollarSign,
  Users2,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { path: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/users', labelKey: 'users', icon: Users },
  { path: '/farms', labelKey: 'farms', icon: Building2 },
  { path: '/flocks', labelKey: 'flocks', icon: Layers },
  { path: '/daily-records', labelKey: 'dailyRecords', icon: FileText },
  {
    path: '/inventory', labelKey: 'inventory', icon: Package, children: [
      { path: '/inventory/overview', label: 'Overview' },
      { path: '/inventory/scan', label: 'Scan Station' },
      { path: '/inventory/stock-in', label: 'Stock In' },
      { path: '/inventory/stock-out', label: 'Stock Out' },
      { path: '/inventory/po', label: 'Purchase Orders' },
      { path: '/inventory/count', label: 'Cycle Count' },
      { path: '/inventory/forecast', label: 'Forecasting' },
      { path: '/inventory/suppliers', label: 'Suppliers' },
      { path: '/inventory/reports', label: 'Reports' },
    ]
  },
  { path: '/veterinary', labelKey: 'veterinary', icon: HeartPulse },
  {
    path: '/pharmacy', labelKey: 'pharmacy', icon: Pill, children: [
      { path: '/pharmacy/overview', label: 'Overview' },
      { path: '/pharmacy/process-rx', label: 'Process Rx' },
      { path: '/pharmacy/pos', label: 'POS Sale' },
      { path: '/pharmacy/patients', label: 'Patients' },
      { path: '/pharmacy/reports', label: 'Reports' }
    ]
  },
  {
    path: '/finance', labelKey: 'finance', icon: DollarSign, children: [
      { path: '/finance/dashboard', label: 'Dashboard' },
      { path: '/finance/coa', label: 'Chart of Accounts' },
      { path: '/finance/invoices', label: 'Invoice Center' },
      { path: '/finance/wallets', label: 'Digital Wallets' },
      { path: '/finance/reconciliation', label: 'Cash Audit' },
      { path: '/finance/reports', label: 'Report Center' },
      { path: '/finance/flock-cogs', label: 'Flock COGS' },
    ]
  },
  { path: '/crm', labelKey: 'crm', icon: Users2 },
  { path: '/reports', labelKey: 'reports', icon: BarChart3 },
  { path: '/settings', labelKey: 'settings', icon: Settings, alwaysVisible: true },
];

const Sidebar = ({ show, onHide }) => {
  const navigate = useNavigate();
  const { canAccessModule, logout, user } = useAuth();
  const { t } = useLanguage();

  const visibleItems = menuItems.filter((item) => {
    // Pharmacy Role Special Case: Only show Pharmacy & Settings
    if (user?.role === 'PHARMACY_SALES') {
      return item.path === '/pharmacy' || item.alwaysVisible || item.path === '/dashboard';
    }

    if (item.alwaysVisible) return true;
    const module = PATH_MODULE_MAP[item.path];
    return canAccessModule(module);
  }).map(item => {
    if (!item.children) return item;

    const visibleChildren = item.children.filter(child => {
      const requiredPermission = FORM_ROUTE_PERMISSIONS[child.path];
      if (!requiredPermission) return true;
      return hasPermission(user?.role, requiredPermission);
    });

    return { ...item, children: visibleChildren.length > 0 ? visibleChildren : null };
  });

  const handleLogout = () => {
    logout();
    if (onHide) onHide();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-slate-900">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{t('sidebar.brand')}</div>
            <div className="text-xs text-slate-400">{t('sidebar.tagline')}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={!item.children ? onHide : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(`sidebar.${item.labelKey}`)}</span>
                </NavLink>
                {item.children && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={onHide}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          )
                        }
                      >
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
            <span className="text-sm font-medium text-white">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user?.fullName || 'User'}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {user?.role || 'Role'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex fixed left-0 top-0 z-50 h-screen">
        {sidebarContent}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onHide} />
          <div className="fixed left-0 top-0 h-full w-64">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
