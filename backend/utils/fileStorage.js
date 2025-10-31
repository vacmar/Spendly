const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

class FileStorage {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  async readFile(filename) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeFile(filename, data) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  async addRecord(filename, record) {
    const data = await this.readFile(filename);
    record.id = Date.now().toString();
    record.createdAt = new Date().toISOString();
    data.push(record);
    await this.writeFile(filename, data);
    return record;
  }

  async findRecord(filename, query) {
    const data = await this.readFile(filename);
    return data.find(record => {
      return Object.keys(query).every(key => record[key] === query[key]);
    });
  }

  async findRecords(filename, query = {}) {
    const data = await this.readFile(filename);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(record => {
      return Object.keys(query).every(key => record[key] === query[key]);
    });
  }

  async updateRecord(filename, id, updates) {
    const data = await this.readFile(filename);
    const index = data.findIndex(record => record.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    await this.writeFile(filename, data);
    return data[index];
  }

  async deleteRecord(filename, id) {
    const data = await this.readFile(filename);
    const filteredData = data.filter(record => record.id !== id);
    await this.writeFile(filename, filteredData);
    return filteredData.length < data.length;
  }
}

module.exports = new FileStorage();
