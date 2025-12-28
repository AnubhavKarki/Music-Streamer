import { db } from "./db";

// Minimal storage interface - most data is client-side
export interface IStorage {
  // Add any server-side storage methods here if needed in future
}

export class DatabaseStorage implements IStorage {
  // Empty implementation for local-first app
}

export const storage = new DatabaseStorage();
