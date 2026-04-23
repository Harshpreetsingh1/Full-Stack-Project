import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getCategoryConfig, truncateText } from '../utils/helpers';
import {
  HiRefresh, HiTicket, HiUser, HiClock, HiTranslate,
  HiFilter, HiShieldCheck, HiInboxIn
} from 'react-icons/hi';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/complaints/all');
      setComplaints(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = [...complaints];
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter);
    }
    setFiltered(result);
  }, [complaints, statusFilter, categoryFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await api.patch(`/complaints/${id}`, { status: newStatus });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? response.data.data : c))
      );
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'open').length,
    inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
            <HiShieldCheck className="text-2xl text-brand-400" />
          </div>
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="text-gray-500 mt-0.5">Manage all complaints</p>
          </div>
        </div>
        <button
          onClick={fetchComplaints}
          className="btn-secondary flex items-center gap-2 !py-2.5"
          id="admin-refresh"
        >
          <HiRefresh className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, gradient: 'from-brand-500 to-brand-600' },
          { label: 'Open', value: stats.open, gradient: 'from-red-500 to-red-600' },
          { label: 'In Progress', value: stats.inProgress, gradient: 'from-yellow-500 to-yellow-600' },
          { label: 'Resolved', value: stats.resolved, gradient: 'from-emerald-500 to-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <HiFilter />
            <span className="font-medium">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field !w-auto !py-2 text-sm cursor-pointer"
              id="admin-filter-status"
            >
              <option value="all" className="bg-surface-800">All Status</option>
              <option value="open" className="bg-surface-800">Open</option>
              <option value="in-progress" className="bg-surface-800">In Progress</option>
              <option value="resolved" className="bg-surface-800">Resolved</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field !w-auto !py-2 text-sm cursor-pointer"
              id="admin-filter-category"
            >
              <option value="all" className="bg-surface-800">All Categories</option>
              <option value="billing" className="bg-surface-800">Billing</option>
              <option value="technical" className="bg-surface-800">Technical</option>
              <option value="general" className="bg-surface-800">General</option>
            </select>
          </div>
          <span className="text-xs text-gray-500 ml-auto">
            Showing {filtered.length} of {complaints.length}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-message mb-6">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading complaints...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiInboxIn className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No complaints found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        /* Complaints table/cards */
        <div className="space-y-4">
          {filtered.map((complaint, index) => {
            const categoryConfig = getCategoryConfig(complaint.category);
            const isExpanded = expandedId === complaint._id;
            const isUpdating = updatingId === complaint._id;

            return (
              <div
                key={complaint._id}
                className="glass-card p-6"
                style={{ animationDelay: `${index * 0.03}s` }}
                id={`admin-complaint-${complaint.ticketId}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : complaint._id)}
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-brand-400 font-mono text-sm font-semibold">
                        <HiTicket />
                        {complaint.ticketId}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${categoryConfig.bgColor} ${categoryConfig.textColor}`}>
                        {categoryConfig.icon} {categoryConfig.label}
                      </span>
                      <StatusBadge status={complaint.status} size="sm" />
                    </div>

                    <p className="text-gray-200 text-sm leading-relaxed mb-2">
                      {isExpanded ? complaint.description : truncateText(complaint.description, 150)}
                    </p>

                    {/* User info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <HiUser />
                        {complaint.userId?.name || 'Unknown'} ({complaint.userId?.email || ''})
                      </span>
                      <span className="flex items-center gap-1">
                        <HiClock />
                        {formatDate(complaint.createdAt)}
                      </span>
                    </div>

                    {/* Translation */}
                    {isExpanded && complaint.translatedText && (
                      <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/5 animate-slide-down">
                        <div className="flex items-center gap-2 text-xs text-brand-400 font-medium mb-2">
                          <HiTranslate />
                          Translation
                        </div>
                        <p className="text-gray-300 text-sm">{complaint.translatedText}</p>
                      </div>
                    )}
                  </div>

                  {/* Status update */}
                  <div className="flex items-center gap-3 lg:flex-shrink-0">
                    <label className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      Update Status:
                    </label>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      disabled={isUpdating}
                      className="input-field !w-auto !py-2 text-sm cursor-pointer disabled:opacity-50"
                      id={`status-select-${complaint.ticketId}`}
                    >
                      <option value="open" className="bg-surface-800">Open</option>
                      <option value="in-progress" className="bg-surface-800">In Progress</option>
                      <option value="resolved" className="bg-surface-800">Resolved</option>
                    </select>
                    {isUpdating && (
                      <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
