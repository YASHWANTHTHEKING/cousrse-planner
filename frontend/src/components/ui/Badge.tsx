import React from 'react';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  let className = 'badge';
  if (normalized === 'UPCOMING') className += ' badge-upcoming';
  else if (normalized === 'ONGOING') className += ' badge-ongoing';
  else if (normalized === 'COMPLETED') className += ' badge-completed';
  else if (normalized === 'PENDING') className += ' badge-pending';
  else if (normalized === 'REJECTED' || normalized === 'FAILED') className += ' badge-rejected';

  return <span className={className}>{status}</span>;
};
