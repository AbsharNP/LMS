import { LogOut, Menu, Search, Settings, UserCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthUser } from '../utils/auth';

function AppHeader({ onMenuClick, onUserChange, serverStatus, title, user }) {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = user?.name || 'Admin';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleLogout = () => {
    clearAuthUser();
    onUserChange(null);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={19} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">{title}</h1>
          <p className="text-xs text-slate-500">Server status: {serverStatus}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden h-10 w-72 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Search size={17} />
          <input
            className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search courses"
            type="search"
          />
        </label>

        <div className="relative" ref={menuRef}>
          <button
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
              {initials || <UserCircle size={19} />}
            </span>
            <span className="hidden max-w-32 truncate sm:block">{displayName}</span>
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 top-12 z-20 w-64 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
              role="menu"
            >
              <div className="border-b border-slate-100 px-3 py-3">
                <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{user?.email || 'No email saved'}</p>
                <p className="mt-1 text-xs font-medium capitalize text-indigo-600">
                  {user?.role || 'admin'}
                </p>
              </div>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                role="menuitem"
                type="button"
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                onClick={handleLogout}
                role="menuitem"
                type="button"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
