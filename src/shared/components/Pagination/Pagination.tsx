import { memo } from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element {
  if (totalPages <= 1) return <></>;
  const pages: number[] = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 rounded border text-sm disabled:opacity-30 hover:bg-gray-50">Prev</button>
      {pages[0] > 1 && <><button onClick={() => onPageChange(1)} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">1</button>{pages[0] > 2 && <span className="px-1">...</span>}</>}
      {pages.map(p => <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded border text-sm ${p === currentPage ? "bg-teal-600 text-white border-teal-600" : "hover:bg-gray-50"}`}>{p}</button>)}
      {pages[pages.length - 1] < totalPages && <><span className="px-1">...</span><button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">{totalPages}</button></>}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-30 hover:bg-gray-50">Next</button>
    </div>
  );
});
