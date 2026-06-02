import { GraduationCap, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function AppSidebar({ isOpen, onClose, routes }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 transition lg:static lg:block lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">LMS Admin</p>
              <p className="text-xs text-slate-500">Learning dashboard</p>
            </div>
          </div>

          <button
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {routes.map((route) => (
            <SidebarLink key={route.path} onClick={onClose} route={route} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ onClick, route }) {
  const Icon = route.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
        }`
      }
      onClick={onClick}
      to={route.path}
    >
      <Icon size={18} />
      {route.label}
    </NavLink>
  );
}

export default AppSidebar;
