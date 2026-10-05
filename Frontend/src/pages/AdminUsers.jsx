import { useState } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { Users, Search, ShieldCheck, Check, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdmin.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Input from '../components/ui/Input.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function AdminUsers() {
  const { users, isLoading, search, setSearch, toggleVerification, updateRole } = useAdminUsers();

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-dark-900 dark:text-white">
            User Directory & Permissions
          </h1>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            View, search, verify, or change role permissions for all registered platform accounts.
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {isLoading ? (
        <PageLoader label="Loading user directory" />
      ) : (
        <Card className="overflow-hidden border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950 text-left text-xs uppercase tracking-wider text-dark-400">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Candidate / User</th>
                  <th className="px-6 py-3.5 font-bold">Email</th>
                  <th className="px-6 py-3.5 font-bold">Role</th>
                  <th className="px-6 py-3.5 font-bold">Email Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-dark-400">
                      No users match your search query.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onToggleVerify={toggleVerification}
                      onRoleChange={updateRole}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function UserRow({ user, onToggleVerify, onRoleChange }) {
  const [isBusy, setIsBusy] = useState(false);

  const handleToggleVerify = async () => {
    setIsBusy(true);
    try {
      await onToggleVerify(user._id);
      toast.success('Verification status updated.');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update verification.'));
    } finally {
      setIsBusy(false);
    }
  };

  const handleRoleChange = async (e) => {
    setIsBusy(true);
    try {
      await onRoleChange(user._id, e.target.value);
      toast.success('Role updated.');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update role.'));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <tr className="hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors">
      <td className="px-6 py-4 font-semibold text-dark-900 dark:text-white">
        {user.name || 'Unnamed Candidate'}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-dark-500 dark:text-dark-400">
        {user.email}
      </td>
      <td className="px-6 py-4">
        <select
          value={user.role}
          onChange={handleRoleChange}
          disabled={isBusy}
          className="rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 px-2.5 py-1 text-xs font-semibold text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super-admin">super-admin</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleToggleVerify}
          disabled={isBusy}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            user.isVerified
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
          }`}
        >
          {user.isVerified ? '✓ Verified' : '○ Unverified'}
        </button>
      </td>
    </tr>
  );
}
