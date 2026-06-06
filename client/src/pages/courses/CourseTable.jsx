import { Pencil, Trash2 } from 'lucide-react';

function CourseTable({
  courses = [],
  errorMessage = '',
  isDeletingId = '',
  isLoading = false,
  onDelete,
  onEdit,
}) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Course Code</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              {hasActions && <th className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={hasActions ? 4 : 3}>
                  Loading courses...
                </td>
              </tr>
            )}

            {!isLoading && errorMessage && (
              <tr>
                <td className="px-4 py-6 text-center text-red-600" colSpan={hasActions ? 4 : 3}>
                  {errorMessage}
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && courses.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={hasActions ? 4 : 3}>
                  No courses found.
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && courses.map((course) => {
              const courseId = course._id || course.id || course.title;

              return (
                <tr key={courseId}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">
                    {course.title}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {course.course_code || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {course.department?.name || 'Unassigned'}
                  </td>
                  {hasActions && (
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            aria-label={`Edit ${course.title}`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            type="button"
                            onClick={() => onEdit(course)}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            aria-label={`Delete ${course.title}`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isDeletingId === courseId}
                            type="button"
                            onClick={() => onDelete(course)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseTable;
