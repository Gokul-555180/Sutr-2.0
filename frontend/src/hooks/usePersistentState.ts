import { useEffect, useState } from "react";

export function usePersistentState<T>(key: string, initial: T, isValid: (value: unknown) => value is T = (_value): _value is T => true) {
  const [value, setValue] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); const parsed: unknown = raw ? JSON.parse(raw) : initial; return isValid(parsed) ? parsed : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Local persistence is optional in restricted browsers. */ } }, [key, value]);
  return [value, setValue] as const;
}
