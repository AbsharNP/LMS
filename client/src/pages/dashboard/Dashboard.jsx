import { BookOpen, GraduationCap, UserCircle, Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import CourseTable from '../courses/CourseTable';
import MetricCard from './MetricCard';

const roleDetails = {
  madmin: {
    label: 'Master Admin',
    description: 'Full LMS access with administrator controls.',
    badge: 'bg-indigo-50 text-indigo-700',
  },
  admin: {
    label: 'Admin',
    description: 'Can manage courses, learners, and progress.',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  user: {
    label: 'User',
    description: 'Standard dashboard access.',
    badge: 'bg-slate-100 text-slate-700',
  },
};

function Dashboard() {
  const { currentUser } = useOutletContext() || {};
  const displayName = currentUser?.name || 'Admin';
  const roleKey = currentUser?.role || 'admin';
  const role = roleDetails[roleKey] || {
    label: roleKey,
    description: 'Custom role assigned to this account.',
    badge: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-700">
              <UserCircle size={26} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950">{displayName}</h2>
              <p className="text-sm text-slate-500">{currentUser?.email || 'No profile email saved'}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium capitalize ${role.badge}`}>
              {role.label}
            </span>
            <p className="mt-2 text-sm text-slate-500">{role.description}</p>
          </div>
        </div>
      </section>

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

export default Dashboard;
