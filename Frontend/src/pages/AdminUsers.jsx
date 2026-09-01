import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminUsers } from '../hooks/useAdmin.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Input from '../components/ui/Input.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { apiErrorMessage } from '../api/axiosClient.js';

export default function AdminUsers() {
  const { users, isLoading, search, setSearch, toggleVerification, updateRole } = useAdminUsers();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Admin</span>
        <h1 className="mt-2 font-display text-3xl text-ink">Users</h1>
      </div>

      <Input
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <PageLoader label="Loading users" />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((user) => (
                <UserRow key={user._id} user={user} onToggleVerify={toggleVerification} onRoleChange={updateRole} />
              ))}
            </tbody>
          </table>
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
    <tr>
      <td className="px-5 py-3 text-ink">{user.name}</td>
      <td className="px-5 py-3 text-ink-muted">{user.email}</td>
      <td className="px-5 py-3">
        <select
          value={user.role}
          onChange={handleRoleChange}
          disabled={isBusy}
          className="rounded border border-line bg-surface px-2 py-1 text-xs text-ink focus:border-improve focus:outline-none"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super-admin">super-admin</option>
        </select>
      </td>
      <td className="px-5 py-3">
        <button onClick={handleToggleVerify} disabled={isBusy}>
          <Badge tone={user.isVerified ? 'improve' : 'neutral'}>
            {user.isVerified ? 'verified' : 'unverified'}
          </Badge>
        </button>
      </td>
    </tr>
  );
}
