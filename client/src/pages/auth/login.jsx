import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

function Login() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your email and password to access the LMS admin panel."
    >
      <form className="space-y-5">
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

        <button className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700" type="button">
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Do not have an account?{' '}
        <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/signup">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
