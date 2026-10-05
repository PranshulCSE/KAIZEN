import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { RefreshCw, Search, Filter, ShieldCheck, ArrowLeft, Terminal, Activity } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Input from '../components/ui/Input.jsx';
import { adminApi } from '../api/admin.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';
import toast from 'react-hot-toast';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const logLevels = ['ALL', 'INFO', 'WARN', 'ERROR'];

  const fetchLogs = async () => {
    try {
      setFiltering(true);
      const { data } = await adminApi.getLogs({
        level: levelFilter !== 'ALL' ? levelFilter.toLowerCase() : undefined,
        search: searchQuery || undefined
      });
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error(apiErrorMessage(error, 'Failed to fetch logs'));
    } finally {
      setFiltering(false);
    }
  };

  useEffect(() => {
    fetchLogs().then(() => setLoading(false));
  }, [levelFilter]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs();
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, levelFilter, searchQuery]);

  const handleFilterChange = (level) => {
    setLevelFilter(level);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    fetchLogs();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="text-dark-400 font-mono text-xs">-</span>;
    const s = Number(status);
    let colorClass = 'bg-dark-100 text-dark-800 dark:bg-dark-800 dark:text-dark-200';
    if (s >= 200 && s < 300) {
      colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';
    } else if (s >= 400 && s < 500) {
      colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300';
    } else if (s >= 500) {
      colorClass = 'bg-danger-50 dark:bg-danger-950/60 text-danger-700 dark:text-danger-300';
    }

    return (
      <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${colorClass}`}>
        {status}
      </span>
    );
  };

  const getLevelBadge = (level) => {
    const l = (level || 'info').toUpperCase();
    if (l === 'ERROR') {
      return (
        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-danger-50 dark:bg-danger-950/60 text-danger-700 dark:text-danger-300">
          ERROR
        </span>
      );
    }
    if (l === 'WARN' || l === 'WARNING') {
      return (
        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
          WARN
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
        INFO
      </span>
    );
  };

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
            System Audit Logs
          </h1>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            Real-time API invocation logs, authentication attempts, and background exceptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'lime' : 'secondary'}
            size="sm"
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              toast(autoRefresh ? 'Live refresh stopped' : 'Live refresh active (8s)');
            }}
            className="text-xs font-bold"
          >
            <Activity className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-pulse' : ''}`} />
            <span>{autoRefresh ? 'Live Polling: ON' : 'Live Polling: OFF'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            isLoading={filtering}
            onClick={fetchLogs}
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Controls Card */}
      <Card className="p-5 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-dark-50 dark:bg-dark-950 rounded-xl border border-dark-100 dark:border-dark-800">
            {logLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleFilterChange(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === lvl
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Query */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search by endpoint, status, user ID, or error..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="text-xs">
              Search
            </Button>
          </form>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-dark-400 font-mono">
            Loading system log stream...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-dark-400">
            <Terminal className="w-8 h-8 text-dark-300 dark:text-dark-700 mx-auto mb-2" />
            <p className="font-semibold text-dark-600 dark:text-dark-300">No logs matching criteria</p>
            <p className="text-[11px] text-dark-400 mt-0.5">Try clearing filters or making an API request.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950 uppercase tracking-wider text-dark-400 font-bold">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Route / Service</th>
                  <th className="px-5 py-3">Message / Payload</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Client Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-800 font-mono">
                {logs.map((log, idx) => {
                  const level = log.level || log.type || 'info';
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors"
                    >
                      <td className="px-5 py-3 text-[11px] text-dark-400 whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="px-5 py-3">{getLevelBadge(level)}</td>
                      <td className="px-5 py-3 text-dark-900 dark:text-dark-100 font-bold">
                        {log.service || log.action || 'api'}
                      </td>
                      <td className="px-5 py-3 max-w-sm truncate text-dark-700 dark:text-dark-300">
                        {typeof log.message === 'string' ? log.message : JSON.stringify(log.message || log.action || {})}
                      </td>
                      <td className="px-5 py-3">{getStatusBadge(log.statusCode)}</td>
                      <td className="px-5 py-3 text-[11px] text-dark-400">
                        {log.ipAddress && <span>{log.ipAddress}</span>}
                        {log.userId && <span className="ml-1 text-primary-600 dark:text-primary-400 font-sans">({log.userId})</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="text-center text-xs text-dark-400 font-mono">
        Showing {logs.length} stream entries {autoRefresh ? '· auto-refreshing every 8s' : ''}
      </div>
    </div>
  );
}
