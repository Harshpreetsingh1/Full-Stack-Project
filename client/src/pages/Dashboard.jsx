import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getCategoryConfig, truncateText } from '../utils/helpers';
import { HiPlusCircle, HiTicket, HiTranslate, HiClock, HiRefresh, HiInboxIn } from 'react-icons/hi';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/complaints');
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
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="text-gray-500 mt-1">Track and manage your support tickets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchComplaints}
            className="btn-secondary flex items-center gap-2 !py-2.5"
            id="dashboard-refresh"
          >
            <HiRefresh className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link to="/complaint/new" className="btn-primary flex items-center gap-2 !py-2.5" id="dashboard-new">
            <HiPlusCircle />
            New Complaint
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'from-brand-500 to-brand-600', icon: '📊' },
          { label: 'Open', value: stats.open, color: 'from-red-500 to-red-600', icon: '🔴' },
          { label: 'In Progress', value: stats.inProgress, color: 'from-yellow-500 to-yellow-600', icon: '🟡' },
          { label: 'Resolved', value: stats.resolved, color: 'from-emerald-500 to-emerald-600', icon: '🟢' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
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
      ) : complaints.length === 0 ? (
        /* Empty state */
        <div className="glass-card p-12 text-center">
          <HiInboxIn className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No complaints yet</h3>
          <p className="text-gray-500 mb-6">Submit your first complaint to get started</p>
          <Link to="/complaint/new" className="btn-primary inline-flex items-center gap-2">
            <HiPlusCircle />
            Submit Complaint
          </Link>
        </div>
      ) : (
        /* Complaints list */
        <div className="space-y-4">
          {complaints.map((complaint, index) => {
            const categoryConfig = getCategoryConfig(complaint.category);
            const isExpanded = expandedId === complaint._id;

            return (
              <div
                key={complaint._id}
                className="glass-card-hover p-6 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : complaint._id)}
                style={{ animationDelay: `${index * 0.05}s` }}
                id={`complaint-${complaint.ticketId}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
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
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {isExpanded ? complaint.description : truncateText(complaint.description, 150)}
                    </p>

                    {/* Expanded: translation */}
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

                  <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-right whitespace-nowrap">
                    <HiClock />
                    {formatDate(complaint.createdAt)}
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

export default Dashboard;
