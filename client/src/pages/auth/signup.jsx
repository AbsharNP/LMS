import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useState } from 'react';
import api from '../../api/axios';
import { Eye, EyeOff } from 'lucide-react';

function Signup() {
      const [firstName, setFirstname] = useState('')
      const [lastName, setLastname] = useState('')
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [c_password, setCPassword] = useState('')
      const [showPassword, setShowPassword] = useState(false)
      const isPasswordMatch = password !== '' && password === c_password

      const handleSubmit = (e) =>{
        e.preventDefault()
        if (!isPasswordMatch) return

        api.post('/api/signup', {firstName,lastName,email,password})
        .then(result => console.log(result))
        .catch(err => console.log(err))
      }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up a new administrator account for the LMS workspace."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="firstName">
              First name
            </label>
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstname(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="lastName">
              Last name
            </label>
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
        </div>

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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="password"
              name="password"
              placeholder="Create a password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="c_password">
            Confirm Password
          </label>
          <input
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
              c_password && !isPasswordMatch
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            id="c_password"
            name="c_password"
            placeholder="confirm password"
            type="password"
            onChange={(e) => setCPassword(e.target.value)}
          />
          {c_password && !isPasswordMatch && (
            <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
          <input className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600" type="checkbox" />
          I agree to the terms and privacy policy.
        </label>

        <button
          className="h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!isPasswordMatch}
          type="submit"
        >
          Create account
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
