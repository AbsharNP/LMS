import CourseTable from './CourseTable';

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

export default Courses;
