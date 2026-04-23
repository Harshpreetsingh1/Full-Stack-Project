import React from 'react';
import { getStatusConfig } from '../utils/helpers';

const StatusBadge = ({ status, size = 'md' }) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
