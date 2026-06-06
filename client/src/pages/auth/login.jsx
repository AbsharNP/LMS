import { useNavigate } from 'react-router-dom';
import { CheckCircle, LoaderCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useState } from 'react';
import api from '../../api/axios';
import Toast from '../../components/Toast';
import { setAuthUser, setFlashMessage } from '../../utils/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isRedirecting) {
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const response = await api.post('/api/login', { email, password });

      setAuthUser(response.data.user);
      setFlashMessage(response.data.message || 'Login successful');
      setIsRedirecting(true);
      window.setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1200);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Unable to login',
        tone: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your email and password to access the LMS admin panel."
    >
      <Toast message={toast?.message} tone={toast?.tone} />

      {isRedirecting && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} />
            <span className="font-medium">Login successful</span>
            <LoaderCircle className="ml-auto animate-spin" size={18} />
          </div>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            id="email"
            name="email"
            placeholder="admin@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input className="h-4 w-4 rounded border-slate-300 text-indigo-600" type="checkbox" />
            Remember me
          </label>
          <a className="font-medium text-indigo-600 hover:text-indigo-700" href="#forgot-password">
            Forgot password?
          </a>
        </div>

        <button
          className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!email || !password || isSubmitting || isRedirecting}
          type="submit"
        >
          {isRedirecting ? 'Opening dashboard...' : isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
