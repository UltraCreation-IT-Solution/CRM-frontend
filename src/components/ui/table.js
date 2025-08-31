'use client';

import { useState, useMemo, forwardRef } from 'react';
import { clsx } from 'clsx';
import Button from './button';
import { Checkbox } from './input';

// Base Table Components
const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={clsx('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));

Table.displayName = 'Table';

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={clsx('[&_tr]:border-b', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));

TableBody.displayName = 'TableBody';

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={clsx(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
));

TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({ className, sortable, onSort, sortDirection, children, ...props }, ref) => {
  const handleSort = () => {
    if (sortable && onSort) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(newDirection);
    }
  };

  return (
    <th
      ref={ref}
      className={clsx(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:bg-muted/50',
        className
      )}
      onClick={sortable ? handleSort : undefined}
      {...props}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUpIcon 
              className={clsx(
                'h-3 w-3',
                sortDirection === 'asc' ? 'text-primary' : 'text-gray-400'
              )} 
            />
            <ChevronDownIcon 
              className={clsx(
                'h-3 w-3 -mt-1',
                sortDirection === 'desc' ? 'text-primary' : 'text-gray-400'
              )} 
            />
          </div>
        )}
      </div>
    </th>
  );
});

TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={clsx('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));

TableCell.displayName = 'TableCell';

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={clsx('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));

TableCaption.displayName = 'TableCaption';

// Advanced DataTable Component
export function DataTable({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination = false,
  selection = false,
  sorting = true,
  filtering = false,
  className,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No data available',
  ...props
}) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');

  // Filtering
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return value && value.toString().toLowerCase().includes(globalFilter.toLowerCase());
      })
    );
  }, [data, columns, globalFilter]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((row, index) => row.id || index));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
    onSelectionChange?.(checked ? paginatedData : []);
  };

  const handleSelectRow = (rowId, checked) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(rowId);
    } else {
      newSelection.delete(rowId);
    }
    setSelectedRows(newSelection);
    
    const selectedData = paginatedData.filter(row => newSelection.has(row.id));
    onSelectionChange?.(selectedData);
  };

  // Sort handler
  const handleSort = (columnKey, direction) => {
    setSortConfig({ key: columnKey, direction });
  };

  const isAllSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600 dark:text-red-400">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {selection && selectedRows.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} of {paginatedData.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {filtering && (
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-input rounded-md bg-background"
            />
          )}
        </div>
      </div>

      {/* Table */}
      <Table {...props}>
        <TableHeader>
          <TableRow>
            {selection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                sortable={sorting && column.sortable !== false}
                sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                onSort={(direction) => handleSort(column.key, direction)}
                className={column.headerClassName}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selection ? 1 : 0)} className="h-24 text-center">
                <LoadingSpinner className="mx-auto h-6 w-6" />
              </TableCell>
            </TableRow>
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selection ? 1 : 0)} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={onRowClick ? 'cursor-pointer' : ''}
                data-state={selectedRows.has(row.id || rowIndex) ? 'selected' : ''}
              >
                {selection && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id || rowIndex)}
                      onCheckedChange={(checked) => handleSelectRow(row.id || rowIndex, checked)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.cellClassName}>
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// CRM-specific table configurations
export const CRMTableColumns = {
  contacts: [
    {
      key: 'name',
      title: 'Name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {value?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      title: 'Company',
      render: (value) => (
        <span className="text-gray-900 dark:text-white">{value}</span>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          {value}
        </a>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => (
        <a href={`tel:${value}`} className="text-green-600 hover:text-green-800 dark:text-green-400">
          {value}
        </a>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={clsx(
          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
          value === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
          value === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        )}>
          {value}
        </span>
      ),
    },
  ],

  leads: [
    {
      key: 'name',
      title: 'Lead',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.company}</div>
        </div>
      ),
    },
    {
      key: 'source',
      title: 'Source',
      render: (value) => (
        <span className="capitalize text-gray-900 dark:text-white">
          {value?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'value',
      title: 'Est. Value',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={clsx(
          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
          value === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
          value === 'qualified' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
          value === 'contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        )}>
          {value}
        </span>
      ),
    },
  ],

  deals: [
    {
      key: 'title',
      title: 'Deal',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.contact?.name}</div>
        </div>
      ),
    },
    {
      key: 'value',
      title: 'Value',
      render: (value) => (
        <span className="font-semibold text-lg text-gray-900 dark:text-white">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'stage',
      title: 'Stage',
      render: (value) => (
        <span className="capitalize text-gray-900 dark:text-white">{value}</span>
      ),
    },
    {
      key: 'probability',
      title: 'Probability',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}%</span>
      ),
    },
    {
      key: 'closeDate',
      title: 'Close Date',
      render: (value) => (
        <span className="text-gray-900 dark:text-white">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </span>
      ),
    },
  ],
};

// Loading spinner component
function LoadingSpinner({ className }) {
  return (
    <svg
      className={clsx('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Icon components
const ChevronUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
export default DataTable;