import { memo, useState, useCallback } from "react";
import type { FilterSidebarProps, FilterOption } from "../../types";

/**
 * Reusable filter sidebar component for product listings
 * Displays collapsible filter groups with checkboxes or grid selection
 * Memoized to prevent unnecessary re-renders
 */
export const FilterSidebar = memo(function FilterSidebar({
  filters,
  onFilterChange,
}: FilterSidebarProps): JSX.Element {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  /** Toggle group expansion */
  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  /** Handle filter selection */
  const handleFilterSelect = useCallback((groupId: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      
      const newFilters = { ...prev, [groupId]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  /** Render shape/grid selection option */
  const renderShapeOption = useCallback((groupId: string, option: FilterOption) => {
    const isSelected = selectedFilters[groupId]?.includes(option.id);
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
  }, [selectedFilters, handleFilterSelect]);

  /** Render checkbox option */
  const renderCheckboxOption = useCallback((groupId: string, option: FilterOption) => {
    const isSelected = selectedFilters[groupId]?.includes(option.id);
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
  }, [selectedFilters, handleFilterSelect]);

  return (
    <aside className="w-full">
      {filters.map((group) => {
        const isCollapsible = group.collapsible !== false;
        const isExpanded = !isCollapsible || expandedGroups[group.id];

        return (
          <div key={group.id} className="border-b border-gray-200">
            {/* Header */}
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

            {/* Content */}
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
    </aside>
  );
});

FilterSidebar.displayName = "FilterSidebar";
