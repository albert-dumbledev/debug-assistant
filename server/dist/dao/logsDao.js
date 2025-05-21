"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsDao = void 0;
const mongodb_1 = require("mongodb");
class LogsDao {
    constructor(client) {
        this.collection = client.db('debug-assistant').collection('logs');
    }
    async saveLog(content, analysis) {
        // did some research - this seems to be a safe way to insert info from user input. As long as the user input is not a key, operator or raw query object, the MongoDB driver can handle it.
        const result = await this.collection.insertOne({
            content,
            timestamp: new Date(),
            analysis
        });
        return result.insertedId.toString();
    }
    async updateLogAnalysis(id, analysis) {
        const result = await this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { analysis } });
        if (result.modifiedCount === 0) {
            throw new Error(`Log with id ${id} not found`);
        }
        return result.modifiedCount === 1;
    }
    async getLog(id) {
        return this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    async getAllLogs(options = {}) {
        const { limit = 50, sort = 'desc' } = options;
        return this.collection
            .find()
            .sort({ timestamp: sort === 'desc' ? -1 : 1 })
            .limit(limit)
            .toArray();
    }
}
exports.LogsDao = LogsDao;
