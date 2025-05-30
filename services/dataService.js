const fs = require('fs').promises;
const path = require('path');

class DataService {
    constructor(fileName) {
        this.filePath = path.join(__dirname, '..', 'data', fileName);
    }

    async readData() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Se o arquivo não existir, retorna array vazio
                return [];
            }
            throw error;
        }
    }

    async writeData(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async create(item) {
        const data = await this.readData();
        const newItem = {
            ...item,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        data.push(newItem);
        await this.writeData(data);
        return newItem;
    }

    async findAll() {
        return await this.readData();
    }

    async findById(id) {
        const data = await this.readData();
        return data.find(item => item.id === id);
    }

    async update(id, updates) {
        const data = await this.readData();
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return null;

        data[index] = { ...data[index], ...updates };
        await this.writeData(data);
        return data[index];
    }

    async delete(id) {
        const data = await this.readData();
        const filteredData = data.filter(item => item.id !== id);
        await this.writeData(filteredData);
    }
}

module.exports = DataService; 