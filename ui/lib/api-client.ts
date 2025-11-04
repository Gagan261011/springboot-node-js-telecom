import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.API_BASE ??
  "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message
    );
  }
  return "Unexpected error occurred";
}
