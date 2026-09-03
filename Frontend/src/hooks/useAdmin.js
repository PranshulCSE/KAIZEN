import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../api/admin.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';

export function useAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(apiErrorMessage(err, 'Could not load dashboard stats.')))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
}

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.listUsers(query ? { search: query } : undefined);
      setUsers(data.data.users);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load users.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(search);
  }, [fetchUsers, search]);

  const toggleVerification = useCallback(async (id) => {
    const { data } = await adminApi.toggleVerification(id);
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isVerified: data.data.isVerified } : u)));
  }, []);

  const updateRole = useCallback(async (id, role) => {
    await adminApi.updateRole(id, role);
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  }, []);

  return { users, isLoading, error, search, setSearch, toggleVerification, updateRole };
}
