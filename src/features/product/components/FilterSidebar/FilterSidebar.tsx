import { memo, useState, useCallback, useMemo } from "react";
import type { FilterSidebarProps, FilterOption } from "@/features/product/types";

export const FilterSidebar = memo(function FilterSidebar({
  filters,
  pendingFilters,
  appliedCount,
  onFilterChange,
  onApply,
  onClear,
}: FilterSidebarProps): JSX.Element {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const pendingCount = useMemo(
    () => Object.values(pendingFilters).reduce((sum, arr) => sum + (arr?.length || 0), 0),
    [pendingFilters],
  );

  const hasChanges = pendingCount !== appliedCount;

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const handleFilterSelect = useCallback((groupId: string, optionId: string) => {
    const current = pendingFilters[groupId] || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onFilterChange({ ...pendingFilters, [groupId]: updated });
  }, [pendingFilters, onFilterChange]);

  const renderShapeOption = useCallback((groupId: string, option: FilterOption) => {
    const isSelected = pendingFilters[groupId]?.includes(option.id);
    return (
      <button
        key={option.id}
        onClick={() => handleFilterSelect(groupId, option.id)}
        className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
          isSelected ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {option.icon && (
          <span className="text-xl text-gray-600">{option.icon}</span>
        )}
        <span className="text-xs text-gray-700">{option.label}</span>
      </button>
    );
  }, [pendingFilters, handleFilterSelect]);

  const renderCheckboxOption = useCallback((groupId: string, option: FilterOption) => {
    const isSelected = pendingFilters[groupId]?.includes(option.id);
    return (
      <label
        key={option.id}
        className="flex items-center gap-3 cursor-pointer py-1.5 hover:bg-gray-50 rounded px-1 -mx-1"
      >
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-teal-600 border-teal-600"
              : "border-gray-300 bg-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleFilterSelect(groupId, option.id);
          }}
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-700 flex-1">
          {option.label}
          {option.count !== undefined && (
            <span className="text-gray-400">({option.count})</span>
          )}
        </span>
      </label>
    );
  }, [pendingFilters, handleFilterSelect]);

  return (
    <aside className="w-full flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {filters.map((group) => {
          const isCollapsible = group.collapsible !== false;
          const isExpanded = !isCollapsible || expandedGroups[group.id];

          return (
            <div key={group.id} className="border-b border-gray-200">
              {isCollapsible ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                    {group.title}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedGroups[group.id] ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              ) : (
                <div className="py-4">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                    {group.title}
                  </span>
                </div>
              )}

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsible
                    ? (isExpanded ? "max-h-96 pb-4" : "max-h-0")
                    : "pb-4"
                }`}
              >
                {group.type === "shape" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {group.options.map((option) => renderShapeOption(group.id, option))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {group.options.map((option) => renderCheckboxOption(group.id, option))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-5 px-1 mb-5 space-y-2 shrink-0">
        <button
          onClick={onApply}
          disabled={!hasChanges}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            hasChanges
              ? "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Apply{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </button>
        {pendingCount > 0 && (
          <button
            onClick={onClear}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </aside>
  );
});

FilterSidebar.displayName = "FilterSidebar";
