export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string>;
  timestamp?: string;
  message?: string;
  error?: string;
  path?: string;
}
