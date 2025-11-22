import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // If running in browser, use the current host with port 8080
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8080`;
  }
  
  // For server-side rendering, use env variable or localhost
  return process.env.NEXT_PUBLIC_API_BASE ?? 
         process.env.API_BASE ?? 
         "http://localhost:8080";
};

const baseURL = getBaseURL();

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
