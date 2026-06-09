import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { adminRoutes } from '../router';
import Toast from '../components/Toast';
import { consumeFlashMessage, getAuthUser } from '../utils/auth';

function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('Connecting...');
  const [currentUser, setCurrentUser] = useState(() => getAuthUser());
  const [toastMessage, setToastMessage] = useState(() => consumeFlashMessage() || '');

  const activeRoute = useMemo(
    () =>
      adminRoutes.find((route) => location.pathname.startsWith(route.path)) ||
      adminRoutes[0],
    [location.pathname],
  );

  useEffect(() => {
    api
      .get('/api/test')
      .then((response) => setMessage(response.data.message || 'API connected'))
      .catch(() => setMessage('API offline'));
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Toast message={toastMessage} />
      <div className="flex min-h-screen">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          routes={adminRoutes}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            serverStatus={message}
            title={activeRoute.label}
            user={currentUser}
            onUserChange={setCurrentUser}
          />

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <Outlet context={{ currentUser }} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLayout;
