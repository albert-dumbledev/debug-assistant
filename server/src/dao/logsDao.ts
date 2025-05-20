import { MongoClient, Collection, ObjectId } from 'mongodb';
import { LogEntry, LogAnalysis, PaginationOptions } from '@common/types/logAnalysis';

export class LogsDao {
  private collection: Collection<LogEntry>;

  constructor(client: MongoClient) {
    this.collection = client.db('debug-assistant').collection<LogEntry>('logs');
  }

  async saveLog(content: string, analysis?: LogAnalysis): Promise<string> {
    // did some research - this seems to be a safe way to insert info from user input. As long as the user input is not a key, operator or raw query object, the MongoDB driver can handle it.
    const result = await this.collection.insertOne({
      content,
      timestamp: new Date(),
      analysis
    });
    return result.insertedId.toString();
  }

  async updateLogAnalysis(id: string, analysis: LogAnalysis): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { analysis } }
    );
    if (result.modifiedCount === 0) {
      throw new Error(`Log with id ${id} not found`);
    }

    return result.modifiedCount === 1;
  }

  async getLog(id: string): Promise<LogEntry | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getAllLogs(options: PaginationOptions = {}): Promise<LogEntry[]> {
    const { limit = 50, sort = 'desc' } = options;
    return this.collection
      .find()
      .sort({ timestamp: sort === 'desc' ? -1 : 1 })
      .limit(limit)
      .toArray();
  }
} 