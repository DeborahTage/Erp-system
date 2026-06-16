import React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  iconColor = "text-blue-600",
  bgColor = "bg-blue-50"
}) => {
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-none shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            </div>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
            {trend && (
              <div className={cn(
                "text-xs mt-3 flex items-center gap-1.5 font-bold px-2 py-1 rounded-full w-fit",
                trend === 'up' ? 'text-emerald-700 bg-emerald-50' :
                  trend === 'down' ? 'text-red-700 bg-red-50' :
                    'text-blue-700 bg-blue-50'
              )}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
                  trend === 'down' ? <TrendingDown className="h-3 w-3" /> :
                    <Minus className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110",
              bgColor
            )}>
              <Icon className={cn("h-7 w-7", iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
