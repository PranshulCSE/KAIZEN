import { useState, useEffect } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import { adminApi } from "../api/admin.api.js";
import { RefreshCw, Search, Filter } from "lucide-react";
import { useToast } from "../hooks/useToast.js";
import { apiErrorMessage } from "../api/axiosClient.js";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast, toasts } = useToast(); // FIXED: real toast state instead of console.log

  const logLevels = ["ALL", "INFO", "WARN", "ERROR"];
  const logColors = { info: "secondary", warn: "warning", error: "danger" };
  const statusColors = {
    200: "secondary",
    201: "secondary",
    400: "warning",
    401: "danger",
    403: "danger",
    404: "warning",
    500: "danger",
  };
  // (delete the old `const showToast = (message, type = 'info') => { console.log(...) }` block)

  // Fetch logs
  // lines 43-57 — fetchLogs:
  const fetchLogs = async () => {
    try {
      setFiltering(true);
      // FIXED: client.get() returns the raw Axios response — the JSON body is
      // at response.data, not the response itself. This was always reading
      // response.logs (undefined) and silently falling back to [], which is
      // why the page showed "No logs found" even with real audit logs in Mongo.
      const { data } = await adminApi.getLogs({
        level: levelFilter !== "ALL" ? levelFilter.toLowerCase() : undefined,
        search: searchQuery || undefined,
      });
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      showToast(apiErrorMessage(error, "Failed to fetch logs"), "error");
    } finally {
      setFiltering(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLogs();
    setLoading(false);
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, levelFilter, searchQuery]);

  // Handle filter change
  const handleFilterChange = (level) => {
    setLevelFilter(level);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;
    const color = statusColors[status] || "secondary";
    return (
      <Badge variant={color} size="sm">
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-lg flex items-center justify-center h-96">
        <p className="text-muted">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-lg">
      <div className="flex justify-between items-center mb-xl">
        <h1 className="text-3xl font-bold font-display">System Logs</h1>
        <div className="flex gap-sm">
          <Button
            variant={autoRefresh ? "lime" : "secondary"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-xs"
          >
            <RefreshCw
              className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Live" : "Off"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isLoading={filtering}
            onClick={fetchLogs}
            className="flex items-center gap-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="mb-xl">
        <div className="space-y-md">
          {/* Level Filter Tabs */}
          <div>
            <p className="eyebrow mb-sm">Log Level</p>
            <div className="flex flex-wrap gap-sm">
              {logLevels.map((level) => (
                <Button
                  key={level}
                  variant={levelFilter === level ? "lime" : "secondary"}
                  size="sm"
                  onClick={() => handleFilterChange(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div>
            <p className="eyebrow mb-sm">Search</p>
            <Input
              icon={Search}
              placeholder="Search by endpoint, error, IP, action..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* LOGS TABLE */}
      <Card>
        {logs.length === 0 ? (
          <div className="text-center py-xl">
            <Filter className="h-8 w-8 text-muted mx-auto mb-sm opacity-50" />
            <p className="text-muted">No logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-ink">
                <tr>
                  <th className="text-left py-md px-sm font-bold">Timestamp</th>
                  <th className="text-left py-md px-sm font-bold">Level</th>
                  <th className="text-left py-md px-sm font-bold">Service</th>
                  <th className="text-left py-md px-sm font-bold">Message</th>
                  <th className="text-left py-md px-sm font-bold">Status</th>
                  <th className="text-left py-md px-sm font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {logs.map((log, idx) => {
                  const level = log.level || log.type || "info";
                  const levelColor =
                    logColors[level.toLowerCase()] || "secondary";

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-surface transition-colors"
                    >
                      <td className="py-md px-sm text-xs text-muted whitespace-nowrap">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="py-md px-sm">
                        <Badge variant={levelColor} size="sm">
                          {level.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-md px-sm font-mono text-xs">
                        {log.service || log.action || "System"}
                      </td>
                      <td className="py-md px-sm max-w-xs truncate">
                        {typeof log.message === "string"
                          ? log.message
                          : log.action || "N/A"}
                      </td>
                      <td className="py-md px-sm">
                        {getStatusBadge(log.statusCode)}
                      </td>
                      <td className="py-md px-sm text-xs text-muted">
                        {log.ipAddress && <span>{log.ipAddress}</span>}
                        {log.userId && (
                          <span className="ml-sm">({log.userId})</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* FOOTER */}
      <div className="mt-md text-xs text-muted text-center">
        <p>Showing {logs.length} log entries</p>
        {autoRefresh && <p>Auto-refreshing every 10 seconds</p>}
      </div>
      {toasts.length > 0 && (
        <div className="fixed bottom-md right-md z-50 space-y-xs">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-md py-sm rounded shadow-lg text-sm text-white ${t.type === "error" ? "bg-red-600" : "bg-ink"}`}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
