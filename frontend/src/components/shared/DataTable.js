import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, ChevronLeft, ChevronRight, FileX2, Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

const DataTable = ({
  columns,
  data,
  loading = false,
  searchable = true,
  pagination = true,
  pageSize = 10,
  emptyMessage = "No data found",
  emptySubtitle = "Try adjusting your search or filters to find what you're looking for.",
  className,
  headerActions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col => {
        const value = col.key ? row[col.key] : '';
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-lg" />
        </div>
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-50 last:border-0 grow">
                  <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {searchable && (
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus-visible:ring-emerald-500 focus-visible:ring-offset-0 focus-visible:border-emerald-500 rounded-xl"
            />
          </div>
        )}
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-tight"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-20">
                      <div className="flex flex-col items-center justify-center text-center px-6">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                          {searchTerm ? <FileX2 className="h-8 w-8 text-gray-400" /> : <Inbox className="h-8 w-8 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{searchTerm ? 'No results found' : emptyMessage}</h3>
                        <p className="text-sm text-gray-500 max-w-sm mt-1">
                          {searchTerm ? `We couldn't find anything matching "${searchTerm}". Try another term.` : emptySubtitle}
                        </p>
                        {searchTerm && (
                          <Button
                            variant="link"
                            className="mt-2 text-emerald-600 font-bold"
                            onClick={() => handleSearch('')}
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50/30 transition-colors group">
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="py-4 px-6 text-sm text-gray-700 leading-tight"
                        >
                          {col.render ? col.render(row, rowIndex) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-xs font-medium text-gray-500 order-2 sm:order-1">
            Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(startIndex + pageSize, filteredData.length)}</span> of <span className="text-gray-900 font-bold">{filteredData.length}</span> entries
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center px-3 h-8 bg-gray-50 rounded-lg border border-gray-100 mx-1">
              <span className="text-xs font-bold text-gray-700">
                {currentPage} <span className="text-gray-400 font-medium">/</span> {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
