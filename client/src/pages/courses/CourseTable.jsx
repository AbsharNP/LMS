import { courses } from '../../router';

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

export default CourseTable;
