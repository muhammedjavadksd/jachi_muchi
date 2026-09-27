/**
 * Global type declarations for the Google tag (`gtag.js`) runtime that is
 * installed by the static snippet in `index.html` and shared by the GTM
 * container (`GTM-KWBTWGTN`) and the Google Ads tag (`AW-18017446397`).
 *
 * These are ambient declarations only — they describe the `window` members the
 * snippet creates at runtime so they can be called from strict-mode TS/TSX.
 * Nothing is imported or emitted from this file.
 */

export {};

declare global {
  interface Window {
    /** Pushes a command/arguments pair onto the shared `dataLayer`. */
    gtag: (command: string, ...args: any[]) => void;
    /** Shared tag queue used by both Google Tag Manager and `gtag.js`. */
    dataLayer: any[];
  }
}
