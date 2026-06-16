import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './LayoutTheme.css';

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { hasRole } = useAuth();
  const isVeterinaryTheme = hasRole(ROLES.VETERINARY_OFFICER);

  return (
    <div className={`d-flex app-shell ${isVeterinaryTheme ? 'vet-app-shell' : ''}`} style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
      <div
        className={`flex-grow-1 app-shell-main ${isVeterinaryTheme ? 'vet-app-shell-main' : ''}`}
        style={{
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <TopBar onMenuToggle={() => setShowSidebar(true)} />
        <div
          style={{ height: 'calc(100vh - 57px)', overflow: 'hidden' }}
          className={`px-4 pt-3 pb-3 app-shell-content ${isVeterinaryTheme ? 'vet-app-shell-content' : ''}`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
