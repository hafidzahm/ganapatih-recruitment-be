export interface CustomError extends Error {
  type: string;
  message: string;
  details?: string | unknown[];
}
