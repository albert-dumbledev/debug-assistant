import { MongoClient, ObjectId } from 'mongodb';

export interface LogEntry {
  _id?: ObjectId;
  content: string;
  timestamp: Date;
}

export interface PaginationOptions {
  limit?: number;
  sort?: 'asc' | 'desc';
}

export class LogsDao {
  private client: MongoClient;
  private dbName = 'debugassistant';
  private collectionName = 'logs';

  constructor(client: MongoClient) {
    this.client = client;
  }

  async saveLog(content: string): Promise<ObjectId> {
    const db = this.client.db(this.dbName);
    const collection = db.collection<LogEntry>(this.collectionName);
    
    const result = await collection.insertOne({
      content,
      timestamp: new Date(),
    });

    return result.insertedId;
  }

  async getLog(id: string): Promise<LogEntry | null> {
    const db = this.client.db(this.dbName);
    const collection = db.collection<LogEntry>(this.collectionName);
    
    return collection.findOne({ _id: new ObjectId(id) });
  }

  async getAllLogs(options: PaginationOptions = {}): Promise<LogEntry[]> {
    const db = this.client.db(this.dbName);
    const collection = db.collection<LogEntry>(this.collectionName);
    
    const { limit = 50, sort = 'desc' } = options;
    
    return collection
      .find()
      .sort({ timestamp: sort === 'desc' ? -1 : 1 })
      .limit(limit)
      .toArray();
  }
} 