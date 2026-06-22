import { type ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

export function Table<T extends Record<string, unknown>>({ columns, data, loading }: TableProps<T>): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => <th key={String(col.key)} className="px-4 py-3 text-left font-medium text-gray-600">{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr> :
           data.length === 0 ? <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">No data</td></tr> :
           data.map((item, i) => <tr key={i} className="border-b hover:bg-gray-50">{columns.map((col) => <td key={String(col.key)} className="px-4 py-3">{col.render ? col.render(item) : String(item[col.key as keyof T] ?? "")}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
