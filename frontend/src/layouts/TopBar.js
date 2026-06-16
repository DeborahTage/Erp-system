import React, { useEffect, useState, useCallback } from 'react';
import { notificationApi } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../lib/permissions';
import { formatDate } from '../utils';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';

const NOTIFICATION_POLL_MS = 60000;

const TopBar = ({ onMenuToggle }) => {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const canViewNotifications = hasPermission(PERMISSIONS.VIEW_NOTIFICATIONS);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const loadNotifications = useCallback(async (silent = false) => {
    if (!canViewNotifications) return;
    if (!silent) setLoadingNotifications(true);
    try {
      const res = await notificationApi.getAll();
      const rows = res.data.data || [];
      setNotifications(rows);
      setUnread(rows.filter((row) => !row.read).length);
    } catch {
      setNotifications([]);
      setUnread(0);
    } finally {
      if (!silent) setLoadingNotifications(false);
    }
  }, [canViewNotifications]);

  useEffect(() => {
    loadNotifications();
    if (!canViewNotifications) return undefined;
    const interval = setInterval(() => loadNotifications(true), NOTIFICATION_POLL_MS);
    return () => clearInterval(interval);
  }, [loadNotifications, canViewNotifications]);

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

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">{t('topbar.title')}</h1>
        
        {canViewNotifications && (
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleOpenNotifications}
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unread}
              </Badge>
            )}
          </Button>
        )}
      </div>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('topbar.notifications')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {loadingNotifications ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">{t('topbar.noNotifications')}</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read ? 'bg-gray-50' : 'bg-white border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{notification.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-2">
                          {notification.relatedModule || t('topbar.general')} - {formatDate(notification.createdAt)}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkRead(notification.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {t('topbar.markRead')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopBar;
