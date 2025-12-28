import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No API routes needed for this local-first application.
  // The frontend handles all logic via IndexedDB.
  
  return httpServer;
}
