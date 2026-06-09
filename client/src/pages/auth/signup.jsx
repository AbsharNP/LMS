import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useState } from 'react';
import api from '../../api/axios';
import { CheckCircle, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import Toast from '../../components/Toast';
import { setAuthUser, setFlashMessage } from '../../utils/auth';

const requiredFields = [
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Password' },
  { name: 'c_password', label: 'Confirm password' },
];

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [c_password, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const isPasswordMatch = password !== '' && password === c_password;

  const fieldValues = {
    firstName,
    lastName,
    email,
    password,
    c_password,
  };

  const clearFieldError = (name, value) => {
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

  const validateForm = () => {
    const errors = requiredFields.reduce((currentErrors, field) => {
      if (!String(fieldValues[field.name] || '').trim()) {
        currentErrors[field.name] = `${field.label} is required.`;
      }

      return currentErrors;
    }, {});

    if (fieldValues.password && fieldValues.c_password && !isPasswordMatch) {
      errors.c_password = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      setToast({ message: 'Please fill all required fields.', tone: 'error' });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const response = await api.post('/api/signup', {
        firstName,
        lastName,
        email,
        password,
      });

      setAuthUser(response.data.user);
      setFlashMessage(response.data.message || 'Account created successfully');
      setIsRedirecting(true);
      window.setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1200);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Unable to create account',
        tone: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up a new administrator account for the LMS workspace."
    >
      <Toast message={toast?.message} tone={toast?.tone} />

      {isRedirecting && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} />
            <span className="font-medium">Account created successfully</span>
            <LoaderCircle className="ml-auto animate-spin" size={18} />
          </div>
        </div>
      )}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="firstName">
              First name <span className="text-red-600">*</span>
            </label>
            <input
              aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
              aria-invalid={Boolean(fieldErrors.firstName)}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                fieldErrors.firstName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
              id="firstName"
              name="firstName"
              placeholder="First Name"
              required
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstname(e.target.value);
                clearFieldError('firstName', e.target.value);
              }}
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-xs text-red-600" id="firstName-error">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="lastName">
              Last name <span className="text-red-600">*</span>
            </label>
            <input
              aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
              aria-invalid={Boolean(fieldErrors.lastName)}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                fieldErrors.lastName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              required
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastname(e.target.value);
                clearFieldError('lastName', e.target.value);
              }}
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-xs text-red-600" id="lastName-error">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
              fieldErrors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            id="email"
            name="email"
            placeholder="admin@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email', e.target.value);
            }}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600" id="email-error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              aria-invalid={Boolean(fieldErrors.password)}
              className={`h-11 w-full rounded-lg border bg-white px-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                fieldErrors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
              id="password"
              name="password"
              placeholder="Create a password"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password', e.target.value);
              }}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600" id="password-error">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="c_password">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            aria-describedby={fieldErrors.c_password ? 'c_password-error' : undefined}
            aria-invalid={Boolean(fieldErrors.c_password || (c_password && !isPasswordMatch))}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
              fieldErrors.c_password || (c_password && !isPasswordMatch)
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            id="c_password"
            name="c_password"
            placeholder="confirm password"
            required
            type="password"
            value={c_password}
            onChange={(e) => {
              setCPassword(e.target.value);
              clearFieldError('c_password', e.target.value);
            }}
          />
          {(fieldErrors.c_password || (c_password && !isPasswordMatch)) && (
            <p className="mt-1 text-xs text-red-600" id="c_password-error">
              {fieldErrors.c_password || 'Passwords do not match.'}
            </p>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
          <input className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600" type="checkbox" />
          I agree to the terms and privacy policy.
        </label>

        <button
          className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting || isRedirecting}
          type="submit"
        >
          {isRedirecting ? 'Opening dashboard...' : isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
