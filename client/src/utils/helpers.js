/**
 * Format a date string to a human-readable format.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to a maximum length with ellipsis.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get status display configuration.
 */
export const getStatusConfig = (status) => {
  const configs = {
    open: {
      label: 'Open',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-300',
      borderColor: 'border-red-500/30',
      dotColor: 'bg-red-400',
    },
    'in-progress': {
      label: 'In Progress',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-500/30',
      dotColor: 'bg-yellow-400',
    },
    resolved: {
      label: 'Resolved',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
      dotColor: 'bg-emerald-400',
    },
  };
  return configs[status] || configs.open;
};

/**
 * Get category display configuration.
 */
export const getCategoryConfig = (category) => {
  const configs = {
    billing: {
      label: 'Billing',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      icon: '💳',
    },
    technical: {
      label: 'Technical',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-300',
      icon: '🔧',
    },
    general: {
      label: 'General',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-300',
      icon: '📋',
    },
  };
  return configs[category] || configs.general;
};
