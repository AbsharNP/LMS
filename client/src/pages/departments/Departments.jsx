import { useEffect, useState } from 'react';
import { AlertTriangle, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const initialForm = {
  name: '',
  prefix: '',
};

const requiredFields = [
  { name: 'name', label: 'Department name' },
  { name: 'prefix', label: 'Prefix' },
];

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

    api
      .get('/api/departments')
      .then((response) => {
        if (isMounted) {
          setDepartments(response.data.departments || []);
          setErrorMessage('');
        }
      })
      .catch((error) => {
        if (isMounted) {
          const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to load departments';
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

  const handleAdd = () => {
    setFormValues(initialForm);
    setFieldErrors({});
    setEditingId('');
    setIsFormOpen(true);
    setNotice('');
  };

  const handleEdit = (department) => {
    setFormValues({ name: department.name || '', prefix: department.prefix || '' });
    setFieldErrors({});
    setEditingId(department._id || department.id);
    setIsFormOpen(true);
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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      if (String(value).trim()) {
        delete nextErrors[name];
      }

      return nextErrors;
    });
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
      if (editingId) {
        const response = await api.put(`/api/departments/${editingId}`, formValues);
        setDepartments((current) =>
          current.map((department) =>
            (department._id || department.id) === editingId ? response.data.department : department,
          ),
        );
        setNotice('Department updated successfully');
      } else {
        const response = await api.post('/api/departments', formValues);
        setDepartments((current) => [response.data.department, ...current]);
        setNotice('Department created successfully');
      }

      resetForm();
    } catch (error) {
      const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to save department';
      setToast({ message: msg, tone: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const departmentId = departmentToDelete?._id || departmentToDelete?.id;

    if (!departmentId) {
      return;
    }

    setIsDeletingId(departmentId);
    setNotice('');
    setErrorMessage('');

    try {
      await api.delete(`/api/departments/${departmentId}`);
      setDepartments((current) =>
        current.filter((department) => (department._id || department.id) !== departmentId),
      );
      setDepartmentToDelete(null);
      setNotice('Department deleted successfully');
    } catch (error) {
      const msg = error.response?.data?.toast?.message || error.response?.data?.message || 'Unable to delete department';
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
            <h2 className="text-base font-semibold text-slate-950">Departments</h2>
            <p className="text-sm text-slate-500">Create and manage departments for courses.</p>
          </div>
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
            type="button"
            onClick={handleAdd}
          >
            <Plus size={17} />
            New Department
          </button>
        </div>

        {notice && (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <DepartmentTable
          departments={departments}
          errorMessage={errorMessage}
          isDeletingId={isDeletingId}
          isLoading={isLoading}
          onDelete={setDepartmentToDelete}
          onEdit={handleEdit}
        />
      </div>

      {isFormOpen && (
        <DepartmentFormModal
          editingId={editingId}
          fieldErrors={fieldErrors}
          formValues={formValues}
          isSaving={isSaving}
          onChange={handleFieldChange}
          onClose={resetForm}
          onSubmit={handleSubmit}
        />
      )}

      {departmentToDelete && (
        <DeleteDepartmentModal
          department={departmentToDelete}
          isDeleting={isDeletingId === (departmentToDelete._id || departmentToDelete.id)}
          onClose={() => setDepartmentToDelete(null)}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}

function DepartmentTable({
  departments,
  errorMessage,
  isDeletingId,
  isLoading,
  onDelete,
  onEdit,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Prefix</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="3">
                  Loading departments...
                </td>
              </tr>
            )}

            {!isLoading && errorMessage && (
              <tr>
                <td className="px-4 py-6 text-center text-red-600" colSpan="3">
                  {errorMessage}
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && departments.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="3">
                  No departments found.
                </td>
              </tr>
            )}

            {!isLoading && !errorMessage && departments.map((department) => {
              const departmentId = department._id || department.id;

              return (
                <tr key={departmentId}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">
                    {department.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {department.prefix}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Edit ${department.name}`}
                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        type="button"
                        onClick={() => onEdit(department)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label={`Delete ${department.name}`}
                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isDeletingId === departmentId}
                        type="button"
                        onClick={() => onDelete(department)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DepartmentFormModal({
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
      <div aria-modal="true" className="w-full max-w-xl rounded-lg bg-white shadow-xl" role="dialog">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {editingId ? 'Edit Department' : 'Add Department'}
            </h2>
            <p className="text-sm text-slate-500">Department names appear in the course form.</p>
          </div>
          <button
            aria-label="Close department form"
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            type="button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <form className="p-5" noValidate onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                Department Name <span className="text-red-600">*</span>
              </label>
              <input
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                aria-invalid={Boolean(fieldErrors.name)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
                  fieldErrors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="name"
                name="name"
                required
                type="text"
                value={formValues.name}
                onChange={onChange}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600" id="name-error">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="prefix">
                Prefix <span className="text-red-600">*</span>
              </label>
              <input
                aria-describedby={fieldErrors.prefix ? 'prefix-error' : undefined}
                aria-invalid={Boolean(fieldErrors.prefix)}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm uppercase outline-none transition focus:ring-4 ${
                  fieldErrors.prefix
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
                id="prefix"
                name="prefix"
                placeholder="e.g. CS"
                required
                type="text"
                value={formValues.prefix}
                onChange={onChange}
              />
              {fieldErrors.prefix && (
                <p className="mt-1 text-xs text-red-600" id="prefix-error">
                  {fieldErrors.prefix}
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
              {isSaving ? 'Saving...' : editingId ? 'Update Department' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteDepartmentModal({ department, isDeleting, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div aria-modal="true" className="w-full max-w-md rounded-lg bg-white shadow-xl" role="dialog">
        <div className="flex gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={22} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">Delete Department</h2>
            <p className="mt-1 text-sm text-slate-500">
              This will permanently delete <span className="font-medium text-slate-700">{department.name}</span>.
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
            {isDeleting ? 'Deleting...' : 'Delete Department'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Departments;
