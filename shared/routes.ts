import { z } from "zod";

// Since this is a local-first app, we define a minimal API contract.
// Most logic will happen in the frontend using IndexedDB.

export const api = {}; 

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
