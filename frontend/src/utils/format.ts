export const formatInr = (amount: number | null | undefined) => amount === null || amount === undefined ? "Not documented" : `₹${amount.toLocaleString("en-IN")}`;
export const titleCase = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
