import { useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const initialForm = {
  f_name: '',
  l_name: '',
  phone_no: '',
  phone_no2: '',
  address: '',
  department: '',
};

const requiredFields = [
  { name: 'f_name', label: 'First name' },
  { name: 'l_name', label: 'Last name' },
  { name: 'phone_no', label: 'Phone number' },
  { name: 'department', label: 'Department' },
];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
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
        }
      })
      .catch((error) => {
        if (isMounted) {
          const msg =
            error.response?.data?.toast?.message ||
            error.response?.data?.message ||
            'Unable to load departments';
          setToast({ message: msg, tone: 'error' });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingDepartments(false);
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

  const handleEdit = (employee) => {
    setFormValues({
      f_name: employee.f_name || '',
      l_name: employee.l_name || '',
      phone_no: employee.phone_no || '',
      phone_no2: employee.phone_no2 || '',
      address: employee.address || '',
      department: employee.department || '',
    });
    setFieldErrors({});
    setEditingId(employee.id);
    setIsFormOpen(true);
    setNotice('');
  };

  const handleDelete = (employeeId) => {
    setEmployees((current) => current.filter((employee) => employee.id !== employeeId));
    setNotice('Employee removed');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fill all required fields.', tone: 'error' });
      return;
    }

    if (editingId) {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === editingId ? { ...employee, ...formValues } : employee,
        ),
      );
      setNotice('Employee updated');
    } else {
      setEmployees((current) => [{ id: crypto.randomUUID(), ...formValues }, ...current]);
      setNotice('Employee added');
    }

    resetForm();
  };

  return (
    <section className="space-y-5">
      <Toast message={toast?.message} tone={toast?.tone} />
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Employees</h2>
            <p className="text-sm text-slate-500">Create and manage employee records.</p>
          </div>
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
            type="button"
            onClick={handleAdd}
          >
            <Plus size={17} />
            New Employee
          </button>
        </div>

        {notice && (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <EmployeeTable
          departments={departments}
          employees={employees}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {isFormOpen && (
        <EmployeeFormModal
          departments={departments}
          editingId={editingId}
          fieldErrors={fieldErrors}
          formValues={formValues}
          isLoadingDepartments={isLoadingDepartments}
          onChange={handleFieldChange}
          onClose={resetForm}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

function EmployeeTable({ departments, employees, onDelete, onEdit }) {
  const departmentNames = departments.reduce((names, department) => {
    names[department._id || department.id] = department.name;
    return names;
  }, {});

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Address</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employees.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="5">
                  No employees found.
                </td>
              </tr>
            )}

            {employees.map((employee) => {
              const name = [employee.f_name, employee.l_name].filter(Boolean).join(' ');

              return (
                <tr key={employee.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">
                    {name || 'Unnamed employee'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {[employee.phone_no, employee.phone_no2].filter(Boolean).join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {departmentNames[employee.department] || 'Unassigned'}
                  </td>
                  <td className="max-w-xs truncate px-4 py-4 text-slate-600">
                    {employee.address || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Edit ${name || 'employee'}`}
                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        type="button"
                        onClick={() => onEdit(employee)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label={`Delete ${name || 'employee'}`}
                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        type="button"
                        onClick={() => onDelete(employee.id)}
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

function EmployeeFormModal({
  departments,
  editingId,
  fieldErrors,
  formValues,
  isLoadingDepartments,
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
              {editingId ? 'Edit Employee' : 'Add Employee'}
            </h2>
            <p className="text-sm text-slate-500">Enter employee contact and department details.</p>
          </div>
          <button
            aria-label="Close employee form"
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            type="button"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <form className="p-5" noValidate onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              error={fieldErrors.f_name}
              id="f_name"
              label="First Name"
              name="f_name"
              required
              value={formValues.f_name}
              onChange={onChange}
            />
            <FormInput
              error={fieldErrors.l_name}
              id="l_name"
              label="Last Name"
              name="l_name"
              required
              value={formValues.l_name}
              onChange={onChange}
            />
            <FormInput
              error={fieldErrors.phone_no}
              id="phone_no"
              label="Phone Number"
              name="phone_no"
              placeholder="Phone number"
              required
              value={formValues.phone_no}
              onChange={onChange}
            />
            <FormInput
              error={fieldErrors.phone_no2}
              id="phone_no2"
              label="Second Phone Number"
              name="phone_no2"
              placeholder="Second phone number"
              value={formValues.phone_no2}
              onChange={onChange}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="address">
              Address
            </label>
            <textarea
              aria-describedby={fieldErrors.address ? 'address-error' : undefined}
              aria-invalid={Boolean(fieldErrors.address)}
              className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4 ${
                fieldErrors.address
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
              id="address"
              name="address"
              placeholder="Address"
              rows={3}
              value={formValues.address}
              onChange={onChange}
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-red-600" id="address-error">
                {fieldErrors.address}
              </p>
            )}
          </div>

          <div className="mt-4">
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
              disabled={isLoadingDepartments}
              id="department"
              name="department"
              required
              value={formValues.department}
              onChange={onChange}
            >
              <option value="">
                {isLoadingDepartments ? 'Loading departments...' : 'Select department'}
              </option>
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              type="submit"
            >
              <Save size={17} />
              {editingId ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({
  error,
  id,
  label,
  name,
  placeholder,
  required = false,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type="text"
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Employees;
