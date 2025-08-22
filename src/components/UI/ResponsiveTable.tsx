import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

function ResponsiveTable<T>({ data, columns, className = '' }: ResponsiveTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className={`hidden md:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-adr-brown text-white">
              {columns.map(col => (
                <th key={String(col.key)} className="px-4 py-3 text-right">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={`md:hidden space-y-3 ${className}`}>
        {data.map((row, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            {columns.map(col => (
              <div key={String(col.key)} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 text-sm font-medium">{col.label}:</span>
                <span className="font-medium text-adr-brown">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default ResponsiveTable;
