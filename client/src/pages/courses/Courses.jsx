import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Save, X } from 'lucide-react';
import api from '../../api/axios';
import CourseTable from './CourseTable';
import Toast from '../../components/Toast';

const initialForm = {
  title: '',
  department: '',
  course_code: '',
};

const requiredFields = [
  { name: 'title', label: 'Course title' },
  { name: 'course_code', label: 'Course code' },
  { name: 'department', label: 'Department' },
];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([api.get('/api/courses'), api.get('/api/departments')])
      .then(([coursesResponse, departmentsResponse]) => {
        if (isMounted) {
          setCourses(coursesResponse.data.courses || []);
          setDepartments(departmentsResponse.data.departments || []);
          setErrorMessage('');
        }
      })
      .catch((error) => {
        if (isMounted) {
          const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to load courses';
          setErrorMessage(msg);
          setToast({ message: msg, tone: 'error' });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setFormValues(initialForm);
    setFieldErrors({});
    setEditingId('');
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;
    const nextValue = type === 'number' ? Number(value) : value;

    setFormValues((current) => ({
      ...current,
      [name]: nextValue,
    }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      if (String(nextValue).trim()) {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  };

  const handleEdit = (course) => {
    setFormValues({
      title: course.title || '',
      department: course.department?._id || course.department || '',
      course_code: course.course_code || '',
    });
    setFieldErrors({});
    setEditingId(course._id || course.id);
    setIsFormOpen(true);
    setNotice('');
  };

  const handleAdd = () => {
    setIsFormOpen(true);
    setEditingId('');
    setFormValues(initialForm);
    setFieldErrors({});
    setNotice('');
  };

  const validateForm = () => {
    const errors = requiredFields.reduce((currentErrors, field) => {
      if (!String(formValues[field.name] || '').trim()) {
        currentErrors[field.name] = `${field.label} is required.`;
      }

      return currentErrors;
    }, {});

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    if (!validateForm()) {
      setToast({ message: 'Please fill all required fields.', tone: 'error' });
      return;
    }

    setIsSaving(true);
    setNotice('');
    setErrorMessage('');

    try {
      const payload = {
        title: formValues.title,
        department: formValues.department,
        course_code: formValues.course_code,
      };

      if (editingId) {
        const response = await api.put(`/api/courses/${editingId}`, payload);
        setCourses((current) =>
          current.map((course) =>
            (course._id || course.id) === editingId ? response.data.course : course,
          ),
        );
        setNotice('Course updated successfully');
      } else {
        const response = await api.post('/api/courses', payload);
        setCourses((current) => [response.data.course, ...current]);
        setNotice('Course created successfully');
      }

      resetForm();
    } catch (error) {
      const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to save course';
      setToast({ message: msg, tone: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setNotice('');
  };

  const handleDelete = async () => {
    const courseId = courseToDelete?._id || courseToDelete?.id;

    if (!courseId) {
      return;
    }

    setIsDeletingId(courseId);
    setNotice('');
    setErrorMessage('');

    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses((current) => current.filter((item) => (item._id || item.id) !== courseId));
      setNotice('Course deleted successfully');
      setCourseToDelete(null);
    } catch (error) {
      const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to delete course';
      setToast({ message: msg, tone: 'error' });
    } finally {
      setIsDeletingId('');
    }
  };

  return (
    <section className="space-y-5">
      <Toast message={toast?.message} tone={toast?.tone} />
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Courses</h2>
          <p className="text-sm text-slate-500">Create and manage LMS courses from the database.</p>
        </div>
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
          type="button"
          onClick={handleAdd}
        >
          <Plus size={17} />
          New Course
        </button>
      </div>

        {notice && (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <CourseTable
          courses={courses}
          errorMessage={errorMessage}
          isDeletingId={isDeletingId}
          isLoading={isLoading}
          onDelete={openDeleteModal}
          onEdit={handleEdit}
        />
      </div>

      {isFormOpen && (
        <CourseFormModal
          departments={departments}
          editingId={editingId}
          fieldErrors={fieldErrors}
          formValues={formValues}
          isSaving={isSaving}
          onChange={handleInputChange}
          onClose={resetForm}
          onSubmit={handleSubmit}
        />
      )}

      {courseToDelete && (
        <DeleteCourseModal
          course={courseToDelete}
          isDeleting={isDeletingId === (courseToDelete._id || courseToDelete.id)}
          onClose={() => setCourseToDelete(null)}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}

function CourseFormModal({
  departments,
  editingId,
  fieldErrors,
  formValues,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div
        aria-modal="true"
        className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {editingId ? 'Edit Course' : 'Add Course'}
            </h2>
            <p className="text-sm text-slate-500">
              {editingId ? 'Update course details.' : 'Create a new course record.'}
            </p>
          </div>
          <button
            aria-label="Close course form"
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            type="button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <form className="p-5" noValidate onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">
                Course Title <span className="text-red-600">*</span>
              </label>
              <input
                aria-describedby={fieldErrors.title ? 'title-error' : undefined}
                aria-invalid={Boolean(fieldErrors.title)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
                  fieldErrors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="title"
                name="title"
                required
                type="text"
                value={formValues.title}
                onChange={onChange}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-red-600" id="title-error">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="course_code">
                Course Code <span className="text-red-600">*</span>
              </label>
              <input
                aria-describedby={fieldErrors.course_code ? 'course_code-error' : undefined}
                aria-invalid={Boolean(fieldErrors.course_code)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm uppercase outline-none transition focus:ring-4 ${
                  fieldErrors.course_code
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="course_code"
                name="course_code"
                placeholder="e.g. CS101"
                required
                type="text"
                value={formValues.course_code}
                onChange={onChange}
              />
              {fieldErrors.course_code && (
                <p className="mt-1 text-xs text-red-600" id="course_code-error">
                  {fieldErrors.course_code}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="department">
                Department <span className="text-red-600">*</span>
              </label>
              <select
                aria-describedby={fieldErrors.department ? 'department-error' : undefined}
                aria-invalid={Boolean(fieldErrors.department)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
                  fieldErrors.department
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="department"
                name="department"
                required
                value={formValues.department}
                onChange={onChange}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department._id || department.id} value={department._id || department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {fieldErrors.department && (
                <p className="mt-1 text-xs text-red-600" id="department-error">
                  {fieldErrors.department}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              type="button"
              onClick={onClose}
            >
              <X size={17} />
              Cancel
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSaving}
              type="submit"
            >
              <Save size={17} />
              {isSaving ? 'Saving...' : editingId ? 'Update Course' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteCourseModal({ course, isDeleting, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        role="dialog"
      >
        <div className="flex gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={22} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">Delete Course</h2>
            <p className="mt-1 text-sm text-slate-500">
              This will permanently delete <span className="font-medium text-slate-700">{course.title}</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isDeleting}
            type="button"
            onClick={onDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Courses;
