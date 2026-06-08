import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ROLES } from '../utils';
import { Nav, Offcanvas } from 'react-bootstrap';

const Icon = ({ children }) => (
  <span
    aria-hidden="true"
    className="d-inline-flex align-items-center justify-content-center me-2"
    style={{ width: 16, height: 16, flexShrink: 0 }}
  >
    <svg
      viewBox="0 0 24 24"
      style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.9 }}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </span>
);

const sidebarStyles = {
  panel: {
    width: 238,
    height: '100vh',
    background: 'linear-gradient(180deg, #2f343a 0%, #3a4047 100%)',
    fontFamily: '"Times New Roman", Times, serif',
    overflow: 'hidden'
  },
  navLink: {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '1.14rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.1
  },
  activeNavLink: {
    backgroundColor: '#2d8a57',
    color: '#ffffff'
  },
  brand: {
    color: '#f3f3f3',
    fontFamily: '"Times New Roman", Times, serif'
  },
  muted: {
    color: '#d4d4d4',
    fontFamily: '"Times New Roman", Times, serif'
  }
};

const menuItems = [
  {
    path: '/dashboard',
    labelKey: 'dashboard',
    roles: null,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="4.5" rx="1.5" />
        <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" />
        <rect x="3" y="13.5" width="7" height="7.5" rx="1.5" />
      </>
    )
  },
  {
    path: '/users',
    labelKey: 'users',
    roles: [ROLES.ADMIN, ROLES.GENERAL_MANAGER],
    icon: (
      <>
        <path d="M16 19a4 4 0 0 0-8 0" />
        <circle cx="12" cy="10" r="3" />
        <path d="M6 19a3.5 3.5 0 0 1 2-3.15" />
        <path d="M18 19a3.5 3.5 0 0 0-2-3.15" />
      </>
    )
  },
  {
    path: '/farms',
    labelKey: 'farms',
    roles: [ROLES.ADMIN, ROLES.GENERAL_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.FARM_MANAGER],
    icon: (
      <>
        <path d="M4 20h16" />
        <path d="M6 20V10l6-4 6 4v10" />
        <path d="M10 20v-5h4v5" />
      </>
    )
  },
  {
    path: '/flocks',
    labelKey: 'flocks',
    roles: [ROLES.ADMIN, ROLES.GENERAL_MANAGER, ROLES.OPERATIONS_MANAGER, ROLES.FARM_MANAGER],
    icon: (
      <>
        <circle cx="10" cy="12" r="3.2" />
        <circle cx="15.5" cy="11" r="2.2" />
        <path d="M6.5 17c.7-1.8 2.4-3 4.5-3s3.8 1.2 4.5 3" />
      </>
    )
  },
  {
    path: '/daily-records',
    labelKey: 'dailyRecords',
    roles: [ROLES.ADMIN, ROLES.FARM_MANAGER, ROLES.OPERATIONS_MANAGER],
    icon: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    )
  },
  {
    path: '/inventory',
    labelKey: 'inventory',
    roles: [ROLES.ADMIN, ROLES.STORE_KEEPER, ROLES.OPERATIONS_MANAGER, ROLES.GENERAL_MANAGER],
    icon: (
      <>
        <path d="M4 8.5 12 4l8 4.5" />
        <path d="M4 8.5V17l8 4 8-4V8.5" />
        <path d="M12 8v13" />
      </>
    )
  },
  {
    path: '/veterinary',
    labelKey: 'veterinary',
    roles: [ROLES.ADMIN, ROLES.VETERINARY_OFFICER, ROLES.FARM_MANAGER],
    icon: (
      <>
        <path d="M12 20s-6-3.6-6-9a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 18 11c0 5.4-6 9-6 9Z" />
        <path d="M12 8.5v5" />
        <path d="M9.5 11h5" />
      </>
    )
  },
  {
    path: '/pharmacy',
    labelKey: 'pharmacy',
    roles: [ROLES.ADMIN, ROLES.PHARMACY_SALES, ROLES.GENERAL_MANAGER],
    icon: (
      <>
        <path d="M9 5h6" />
        <path d="M12 5v14" />
        <rect x="6" y="8" width="12" height="11" rx="2" />
        <path d="M9 12h6" />
      </>
    )
  },
  {
    path: '/finance',
    labelKey: 'finance',
    roles: [ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.GENERAL_MANAGER],
    icon: (
      <>
        <path d="M12 3v18" />
        <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.4 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" />
      </>
    )
  },
  {
    path: '/crm',
    labelKey: 'crm',
    roles: [ROLES.ADMIN, ROLES.EXTENSION_WORKER, ROLES.OPERATIONS_MANAGER, ROLES.GENERAL_MANAGER],
    icon: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="8" r="2.5" />
        <circle cx="12" cy="15.5" r="2.5" />
        <path d="M10 9.5 11.2 13" />
        <path d="M14 9.5 12.8 13" />
      </>
    )
  },
  {
    path: '/reports',
    labelKey: 'reports',
    roles: [ROLES.ADMIN, ROLES.GENERAL_MANAGER, ROLES.OPERATIONS_MANAGER],
    icon: (
      <>
        <path d="M6 19V9" />
        <path d="M12 19V5" />
        <path d="M18 19v-7" />
      </>
    )
  }
];

const Sidebar = ({ show, onHide }) => {
  const navigate = useNavigate();
  const { hasRole, logout } = useAuth();
  const { t } = useLanguage();

  const visibleItems = menuItems.filter((item) => !item.roles || hasRole(...item.roles));

  const handleLogout = () => {
    logout();
    if (onHide) onHide();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <div className="d-flex flex-column h-100" style={sidebarStyles.panel}>
      <div className="p-3 border-bottom">
        <div className="fw-bold fs-6" style={sidebarStyles.brand}>{t('sidebar.brand')}</div>
        <div className="small" style={sidebarStyles.muted}>{t('sidebar.tagline')}</div>
      </div>
      <Nav className="flex-column flex-grow-1 p-2 overflow-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onHide}
            className="nav-link rounded mb-1 px-2 py-2 d-flex align-items-center"
            style={({ isActive }) => ({
              ...sidebarStyles.navLink,
              gap: '0.15rem',
              ...(isActive ? sidebarStyles.activeNavLink : { color: '#f1f1f1' })
            })}
          >
            <Icon>{item.icon}</Icon>
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(`sidebar.${item.labelKey}`)}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="nav-link rounded mb-1 px-2 py-2 d-flex align-items-center text-start border-0 bg-transparent"
          style={{
            ...sidebarStyles.navLink,
            color: '#f1f1f1',
            gap: '0.15rem'
          }}
        >
          <Icon>
            <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h7A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 9 19.5V18" />
            <path d="M14 12H5" />
            <path d="m8 9-3 3 3 3" />
          </Icon>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('sidebar.logout')}</span>
        </button>
      </Nav>
    </div>
  );

  return (
    <>
      <div
        className="d-none d-lg-flex flex-column bg-white border-end"
        style={{ ...sidebarStyles.panel, position: 'fixed', top: 0, left: 0, zIndex: 100 }}
      >
        {sidebarContent}
      </div>
      <Offcanvas show={show} onHide={onHide} className="d-lg-none" style={{ width: 238 }}>
        <Offcanvas.Body className="p-0" style={{ background: sidebarStyles.panel.background }}>{sidebarContent}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
