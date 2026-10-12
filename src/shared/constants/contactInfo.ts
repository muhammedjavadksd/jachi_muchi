/**
 * Customer care contact details — the single source of truth for the support
 * phone number across the whole storefront.
 *
 * BUG-025: the Contact Us page rendered
 * `contactInfo.phone = "0000-000-000"`, a hardcoded placeholder, so the page
 * *looked* like it had a phone section but the number was fake and the
 * `tel:0000000` link dialed nothing. Meanwhile the number had four independent
 * copies, none of them agreeing:
 *
 *   - `contactData.contactInfo.phone`  "0000-000-000"  (Contact Us — placeholder)
 *   - `SupportPage` local constants    "918447821891"  (Help page — stale)
 *   - `SUPPORT_PHONE`                  "+91-7034-683-567" (invoice — stale)
 *   - `QATAR_WHATSAPP_NUMBER`          "97477264007"   (WhatsApp button — real)
 *
 * All four call sites now read this one configuration value, so staging and
 * production can each carry a different line without a code change, and no
 * surface can drift back to a stale literal.
 *
 * The WhatsApp channel is intentionally *not* part of this module — it is a
 * separate number owned by `QATAR_WHATSAPP_URL` in `constants/index.ts`.
 */

/**
 * The support line comes from configuration only — there is deliberately no
 * literal fallback here, because a number baked into the bundle would be baked
 * into every environment at once. Set `VITE_SUPPORT_PHONE` in the environment
 * (see `.env.example`); when it is missing or unusable every surface shows the
 * email fallback instead of a dead number.
 *
 * Accepts spaces, dashes, parentheses and a leading `+`; all of them are
 * stripped for the `tel:` href.
 */
const ENV_SUPPORT_NUMBER: string | undefined = import.meta.env.VITE_SUPPORT_PHONE;

/** Explicit human formatting from the environment, e.g. `+974 7726 4007`. */
const ENV_SUPPORT_DISPLAY: string | undefined = import.meta.env.VITE_SUPPORT_PHONE_DISPLAY;

/** Every character a `tel:` href must not contain. */
const NON_DIALABLE = /[^\d]/g;

/** A national number shorter than this cannot be a real support line. */
const MIN_DIGIT_LENGTH = 7;

/**
 * `0000-000-000` and friends dial to nothing, so a value made only of zeros is
 * treated as "not configured" and the page falls back to the email prompt
 * rather than printing a dead number.
 */
const isRealNumber = (digits: string): boolean =>
  digits.length >= MIN_DIGIT_LENGTH && /[1-9]/.test(digits);

const toDigits = (value: string | undefined): string =>
  (value ?? "").replace(NON_DIALABLE, "");

const supportDigits = toDigits(ENV_SUPPORT_NUMBER);

/**
 * Groups an international number for display: the country code and leading
 * digit stay together (`+974 7726 4007`) rather than being split across the
 * boundary, which is how a naive slice would render it (`+97 4772 64007`).
 * Falls back to 3-3-4 grouping for numbers that carry no country code.
 */
const formatDisplay = (digits: string): string => {
  const nationalLength = 8;
  if (digits.length > nationalLength) {
    const country = digits.slice(0, digits.length - nationalLength);
    const national = digits.slice(-nationalLength);
    const groups = national.match(/.{1,4}/g) ?? [national];
    return `+${country} ${groups.join(" ")}`;
  }
  const groups = digits.match(/.{1,3}/g) ?? [digits];
  return groups.join(" ");
};

const hasDisplayOverride = Boolean(ENV_SUPPORT_DISPLAY?.trim());

/**
 * Single source of truth for the customer care **phone** number. Every call
 * surface (Contact Us, Help, footer, MOI eye test, invoice) reads from this
 * object, so they cannot disagree.
 *
 * Note this is deliberately *only* the voice line. The WhatsApp channel is a
 * separate number owned by `QATAR_WHATSAPP_URL` in `constants/index.ts` — the
 * two can differ per environment, so one must not be derived from the other.
 */
export const CUSTOMER_CARE = {
  /** Dialable digits only — no `+`, spaces or dashes. Safe to concatenate. */
  digits: supportDigits,
  /**
   * `tel:` href. Guaranteed free of spaces and dashes, and `undefined`-free:
   * callers get an empty string rather than the string "undefined" when no
   * number is configured, and must check {@link CUSTOMER_CARE.isAvailable}.
   */
  telHref: isRealNumber(supportDigits) ? `tel:+${supportDigits}` : "",
  /**
   * Human-readable link text, or `""` when no number is configured — an
   * explicit `VITE_SUPPORT_PHONE_DISPLAY` is never surfaced on its own,
   * because a display value with no dialable number is just as broken as a
   * placeholder.
   */
  display: !isRealNumber(supportDigits)
    ? ""
    : hasDisplayOverride
      ? (ENV_SUPPORT_DISPLAY as string).trim()
      : formatDisplay(supportDigits),
  /**
   * False when the configured value is missing or is an all-zero placeholder.
   * UIs must render the fallback message instead of the number when this is
   * false, so a placeholder can never reach a customer.
   */
  isAvailable: isRealNumber(supportDigits),
  email: import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "care@jachiandmuchi.com",
} as const;

/**
 * Support hours, shown next to the number so a caller knows when to expect an
 * answer. Centralised here (rather than inlined in the Contact Us markup) so
 * every surface states the same window.
 */
export const CUSTOMER_CARE_HOURS = {
  days: "Monday to Sunday",
  time: "9:00 AM – 9:00 PM",
  /** Single ready-to-render line, e.g. "Monday to Sunday, 9:00 AM – 9:00 PM". */
  label: "Monday to Sunday, 9:00 AM – 9:00 PM",
} as const;

/**
 * Shown in place of the number when it is missing or unusable. Never empty and
 * never "undefined", per the BUG-025 acceptance criteria.
 */
export const CUSTOMER_CARE_FALLBACK_MESSAGE = `Our phone line is unavailable right now. Please email us at ${CUSTOMER_CARE.email} and we will get back to you.`;

/** Accessible name for the tap-to-call control. */
export const CUSTOMER_CARE_CALL_LABEL = "Call customer care";
