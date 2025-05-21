import { ObjectId } from 'mongodb';

export interface LogAnalysis {
  problem: string;
  solution: string;
  severity: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low' | 'unknown';
}

export interface LogEntry {
  _id?: ObjectId;
  content: string;
  timestamp: Date;
  analysis?: LogAnalysis;
}

export interface PaginationOptions {
  limit?: number;
  sort?: 'asc' | 'desc';
} 