import React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  title = "No data found", 
  description = "There are no items to display at this time.",
  icon: Icon = Inbox,
  action,
  actionLabel,
  className 
}) => {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{description}</p>
        {action && (
          <button
            onClick={action}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {actionLabel || 'Add New'}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
