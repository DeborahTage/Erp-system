import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, ListGroup, Navbar, Offcanvas, Spinner } from 'react-bootstrap';
import { notificationApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, ROLES } from '../utils';

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 1.9 }}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 18a2 2 0 0 0 4 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 1.9 }}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h7A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 9 19.5V18" />
    <path d="M14 12H5" />
    <path d="m8 9-3 3 3 3" />
  </svg>
);

const TopBar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { logout, hasRole } = useAuth();
  const { t } = useLanguage();
  const isVeterinaryTheme = hasRole(ROLES.VETERINARY_OFFICER);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await notificationApi.getAll();
      const rows = res.data.data || [];
      setNotifications(rows);
      setUnread(rows.filter((row) => !row.read).length);
    } catch {
      setNotifications([]);
      setUnread(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    await loadNotifications();
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnread((current) => Math.max(0, current - 1));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Navbar
        bg="white"
        className={`border-bottom px-3 py-2 topbar-shell ${isVeterinaryTheme ? 'vet-topbar-shell' : ''}`}
        style={{ marginLeft: 0 }}
      >
        <Button variant="outline-secondary" size="sm" className="d-lg-none me-2" onClick={onMenuToggle}>
          {t('topbar.menu')}
        </Button>
        <span className={`fw-semibold topbar-title ${isVeterinaryTheme ? 'vet-topbar-title' : ''}`}>{t('topbar.title')}</span>
        <div className="ms-auto d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            className={`d-inline-flex align-items-center gap-2 topbar-action-button ${isVeterinaryTheme ? 'vet-topbar-action-button' : ''}`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>{t('sidebar.logout')}</span>
          </Button>
          <Button
            variant="light"
            className={`position-relative border d-inline-flex align-items-center justify-content-center topbar-notification-button ${isVeterinaryTheme ? 'vet-topbar-notification-button' : ''}`}
            style={{ width: 44, height: 40 }}
            onClick={handleOpenNotifications}
            aria-label={t('topbar.openNotifications')}
            title={t('topbar.notifications')}
          >
            <BellIcon />
            {unread > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: 9 }}
              >
                {unread}
              </Badge>
            )}
          </Button>
        </div>
      </Navbar>

      <Offcanvas show={showNotifications} onHide={() => setShowNotifications(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('topbar.notifications')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loadingNotifications ? (
            <div className="d-flex justify-content-center py-4">
              <Spinner animation="border" variant="success" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted mb-0">{t('topbar.noNotifications')}</p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item key={notification.id} className="px-0">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-semibold">{notification.title}</div>
                      <div className="small text-muted mb-1">{notification.message}</div>
                      <div className="small text-muted">
                        {notification.relatedModule || t('topbar.general')} - {formatDate(notification.createdAt)}
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleMarkRead(notification.id)}
                      >
                        {t('topbar.markRead')}
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TopBar;
