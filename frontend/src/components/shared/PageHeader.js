import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  actionLabel, 
  onAction,
  children,
  className 
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
      {(action || onAction) && (
        <Button onClick={onAction || action} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel || 'Add New'}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
