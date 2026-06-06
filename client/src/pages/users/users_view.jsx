import { useEffect, useState } from 'react';
import api from '../../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    api
      .get('/api/users')
      .then((response) => {
        if (isMounted) {
          setUsers(response.data.users || []);
          setErrorMessage('');
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error.response?.data?.message || 'Unable to load users');
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

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Users</h2>
          <p className="text-sm text-slate-500">Manage LMS users from the sidebar.</p>
        </div>
        <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white sm:w-auto" type="button">
          New User
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan="4">
                    Loading users...
                  </td>
                </tr>
              )}

              {!isLoading && errorMessage && (
                <tr>
                  <td className="px-4 py-6 text-center text-red-600" colSpan="4">
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !errorMessage && users.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan="4">
                    No users found.
                  </td>
                </tr>
              )}

              {!isLoading && !errorMessage && users.map((user) => {
                const name = user.name || [user.f_name, user.l_name].filter(Boolean).join(' ');
                const status = user.delete_status === '0' ? 'Active' : 'Deleted';

                return (
                  <tr key={user._id || user.id || user.email}>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-950">
                      {name || 'Unnamed user'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 capitalize text-slate-600">
                      {user.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Users;
