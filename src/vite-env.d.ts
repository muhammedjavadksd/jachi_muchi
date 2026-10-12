/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** REST base URL, e.g. "https://jachiandmuchi.com/api". */
  readonly VITE_API_URL?: string;
  /**
   * Customer care phone number, digits only or with `+`/spaces/dashes
   * (e.g. "+974 7726 4007"). Overrides the built-in default; see
   * `shared/constants/contactInfo.ts`.
   */
  readonly VITE_SUPPORT_PHONE?: string;
  /** Optional human formatting for {@link VITE_SUPPORT_PHONE}. */
  readonly VITE_SUPPORT_PHONE_DISPLAY?: string;
  /** Customer care email, used by the no-number fallback message. */
  readonly VITE_SUPPORT_EMAIL?: string;
  /** Feature flag: show the My Prescriptions account item. */
  readonly VITE_FEATURE_MY_PRESCRIPTIONS?: string;
  /** Feature flag: show the Manage Notifications account item. */
  readonly VITE_FEATURE_MANAGE_NOTIFICATIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
