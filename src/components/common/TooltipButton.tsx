import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface TooltipButtonProps {
  action: 'edit' | 'delete';
  onClick: () => void;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({ action, onClick }) => {
  const Icon = action === 'edit' ? Edit : Trash2;
  const title = action === 'edit' ? 'Edit event' : 'Delete event';
  const buttonClass = `tooltip-btn ${action}-btn`;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};