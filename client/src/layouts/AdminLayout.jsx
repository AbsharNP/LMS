import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { adminRoutes } from '../router';

function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('Connecting...');

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

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
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
          />

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLayout;
