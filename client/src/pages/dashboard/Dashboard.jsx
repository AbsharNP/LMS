import { BookOpen, GraduationCap, Users } from 'lucide-react';
import CourseTable from '../courses/CourseTable';
import MetricCard from './MetricCard';

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

export default Dashboard;
