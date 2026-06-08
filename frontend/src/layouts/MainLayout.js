import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: 240,
          height: '100vh',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f5f1eb 0%, #edf1f4 100%)'
        }}
      >
        <TopBar onMenuToggle={() => setShowSidebar(true)} />
        <div style={{ height: 'calc(100vh - 57px)', overflow: 'hidden' }} className="px-4 pt-3 pb-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
