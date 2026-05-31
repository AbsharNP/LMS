import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BookOpen, GraduationCap, Menu, Search, Users } from 'lucide-react';
import { appRoutes, courses } from './router';

function App() {
  const location = useLocation();
  const [message, setMessage] = useState('Connecting...');

  const activeRoute = useMemo(
    () =>
      appRoutes.find((route) => location.pathname.startsWith(route.path)) ||
      appRoutes[0],
    [location.pathname],
  );

  useEffect(() => {
    fetch('http://localhost:3000/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message || 'API connected'))
      .catch(() => setMessage('API offline'));
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">LMS Admin</p>
              <p className="text-xs text-slate-500">Learning dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {appRoutes.map((route) => (
              <SidebarLink key={route.path} route={route} />
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
                type="button"
              >
                <Menu size={19} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">
                  {activeRoute.label}
                </h1>
                <p className="text-xs text-slate-500">Server status: {message}</p>
              </div>
            </div>

            <label className="hidden h-10 w-72 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
              <Search size={17} />
              <input
                className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search courses"
                type="search"
              />
            </label>
          </header>

          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            {appRoutes.map((route) => (
              <MobileLink key={route.path} route={route} />
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <AppRouter />
          </div>
        </section>
      </div>
    </main>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/dashboard" />} path="/" />
      {appRoutes.map((route) => (
        <Route
          element={route.page === 'dashboard' ? <Dashboard /> : <Courses />}
          key={route.path}
          path={route.path}
        />
      ))}
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}

function SidebarLink({ route }) {
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
      to={route.path}
    >
      <Icon size={18} />
      {route.label}
    </NavLink>
  );
}

function MobileLink({ route }) {
  const Icon = route.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        `flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
          isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
        }`
      }
      to={route.path}
    >
      <Icon size={17} />
      {route.label}
    </NavLink>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active Students" value="308" icon={Users} tone="indigo" />
        <MetricCard label="Live Courses" value="18" icon={BookOpen} tone="emerald" />
        <MetricCard label="Completion Rate" value="76%" icon={GraduationCap} tone="amber" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Course Activity</h2>
            <p className="text-sm text-slate-500">Latest learning progress across active classes.</p>
          </div>
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white" type="button">
            Add Course
          </button>
        </div>

        <CourseTable />
      </section>
    </div>
  );
}

function Courses() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Courses</h2>
          <p className="text-sm text-slate-500">Manage the kept LMS course option from the sidebar.</p>
        </div>
        <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white sm:w-auto" type="button">
          New Course
        </button>
      </div>

      <CourseTable />
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, tone }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-lg ${tones[tone]}`}>
        <Icon size={21} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </article>
  );
}

function CourseTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Instructor</th>
              <th className="px-4 py-3 font-semibold">Students</th>
              <th className="px-4 py-3 font-semibold">Progress</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {courses.map((course) => (
              <tr key={course.title}>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">
                  {course.title}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {course.instructor}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {course.students}
                </td>
                <td className="min-w-40 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-slate-600">{course.progress}%</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
