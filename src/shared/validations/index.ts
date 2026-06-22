export const isRequired = (value: string): boolean => value.trim().length > 0;
export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isPhone = (value: string): boolean => /^\+?[\d\s-]{10,}$/.test(value);
export const minLength = (value: string, min: number): boolean => value.length >= min;
export const maxLength = (value: string, max: number): boolean => value.length <= max;
