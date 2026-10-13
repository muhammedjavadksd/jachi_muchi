import { memo } from "react";
import { ArrowUpLeft, Search } from "lucide-react";

/** Amazon-style typeahead never shows more than a screenful of rows. */
const MAX_SUGGESTIONS = 10;

export interface SearchSuggestionListProps {
  /** The text the visitor typed, used only to emphasise the matched prefix. */
  query: string;
  /** Phrases returned by the suggestions API (already trimmed of products). */
  phrases: string[];
  /** Index of the keyboard/hover-highlighted row, or -1 for none. */
  activeIndex: number;
  /** Row tap / Enter on a highlighted row: run the search for this phrase. */
  onSelect: (phrase: string) => void;
  /** Mouse entry on a row: lift the highlight to this index. */
  onHoverIndex: (index: number) => void;
  /**
   * When provided, each row shows a trailing arrow-up-left button that copies
   * the phrase into the input without searching (mobile). Desktop omits it.
   */
  onCopy?: (phrase: string) => void;
  /** id for the `role="listbox"` element, referenced by the input's ARIA. */
  listboxId?: string;
}

/**
 * The part of a phrase that matches the typed prefix stays normal weight and
 * the remainder is emphasised — matching Amazon ("kid" normal, "s glasses"
 * bold). Phrases that do not start with the query render untouched, so the text
 * is never split mid-word.
 */
function PhraseText({ text, query }: { text: string; query: string }): JSX.Element {
  const trimmed = query.trim();
  if (!trimmed || !text.toLowerCase().startsWith(trimmed.toLowerCase())) {
    return <>{text}</>;
  }
  const matchEnd = trimmed.length;
  return (
    <>
      {text.slice(0, matchEnd)}
      <span className="font-semibold">{text.slice(matchEnd)}</span>
    </>
  );
}

/**
 * Amazon-style suggestion rows shared by the desktop search dropdown and the
 * mobile full-screen search. It is a plain white list with no images or
 * headings: a search icon, the phrase, and an optional copy control. Container
 * chrome (drop shadow, border, positioning) is owned by each caller, so the
 * same rows read correctly in both places.
 */
export const SearchSuggestionList = memo(function SearchSuggestionList({
  query,
  phrases,
  activeIndex,
  onSelect,
  onHoverIndex,
  onCopy,
  listboxId,
}: SearchSuggestionListProps): JSX.Element {
  const visiblePhrases = phrases.slice(0, MAX_SUGGESTIONS);

  return (
    <ul role="listbox" id={listboxId} className="w-full bg-white">
      {visiblePhrases.map((phrase, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={phrase}
            id={listboxId ? `${listboxId}-option-${index}` : undefined}
            role="option"
            aria-selected={isActive}
            onMouseEnter={() => onHoverIndex(index)}
            onClick={() => onSelect(phrase)}
            className={`flex h-11 cursor-pointer items-center md:h-10 ${
              isActive ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <Search className="ml-4 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate px-3 text-base text-gray-900">
              <PhraseText text={phrase} query={query} />
            </span>
            {onCopy && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(phrase);
                }}
                aria-label={`Use ${phrase} in the search box`}
                className="flex h-full shrink-0 items-center px-3 text-gray-500 hover:text-gray-700 focus-visible:outline-none"
              >
                <ArrowUpLeft className="h-5 w-5" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
});

SearchSuggestionList.displayName = "SearchSuggestionList";
