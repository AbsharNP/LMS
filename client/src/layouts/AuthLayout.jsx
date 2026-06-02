import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

function AuthLayout({ children, subtitle, title }) {
  return (
    <main className="grid min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:grid-cols-[1fr_480px] lg:p-0">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-3" to="/dashboard">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-600">
            <GraduationCap size={24} />
          </span>
          <span>
            <span className="block text-base font-semibold">LMS Admin</span>
            <span className="block text-sm text-slate-300">Learning dashboard</span>
          </span>
        </Link>

        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-indigo-200">
            Course operations
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Manage courses, learners, and progress from one focused workspace.
          </h1>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Link className="mb-8 flex items-center gap-3 lg:hidden" to="/dashboard">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={22} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950">LMS Admin</span>
              <span className="block text-xs text-slate-500">Learning dashboard</span>
            </span>
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
