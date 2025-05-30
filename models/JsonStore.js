const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class JsonStore {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.statsFile = path.join(this.dataDir, 'stats.json');
        this.interactionsFile = path.join(this.dataDir, 'interactions.json');
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            
            // Verifica e cria o arquivo de respostas se não existir
            const respostasPath = path.join(this.dataDir, 'respostas.json');
            try {
                await fs.access(respostasPath);
            } catch {
                await fs.writeFile(respostasPath, '[]');
            }

            // Verifica se os arquivos de dados existem
            const municipiosPath = path.join(this.dataDir, 'municipios.json');
            const estadosPath = path.join(this.dataDir, 'estados.json');

            try {
                await fs.access(municipiosPath);
            } catch {
                // Copia o arquivo municipios.json da raiz para a pasta data
                await fs.copyFile(
                    path.join(__dirname, '..', 'municipios.json'),
                    municipiosPath
                );
            }

            try {
                await fs.access(estadosPath);
            } catch {
                // Cria o arquivo estados.json se não existir
                const estados = {
                    "estados": [
                        { "sigla": "AC", "nome": "Acre" },
                        { "sigla": "AL", "nome": "Alagoas" },
                        { "sigla": "AP", "nome": "Amapá" },
                        { "sigla": "AM", "nome": "Amazonas" },
                        { "sigla": "BA", "nome": "Bahia" },
                        { "sigla": "CE", "nome": "Ceará" },
                        { "sigla": "DF", "nome": "Distrito Federal" },
                        { "sigla": "ES", "nome": "Espírito Santo" },
                        { "sigla": "GO", "nome": "Goiás" },
                        { "sigla": "MA", "nome": "Maranhão" },
                        { "sigla": "MT", "nome": "Mato Grosso" },
                        { "sigla": "MS", "nome": "Mato Grosso do Sul" },
                        { "sigla": "MG", "nome": "Minas Gerais" },
                        { "sigla": "PA", "nome": "Pará" },
                        { "sigla": "PB", "nome": "Paraíba" },
                        { "sigla": "PR", "nome": "Paraná" },
                        { "sigla": "PE", "nome": "Pernambuco" },
                        { "sigla": "PI", "nome": "Piauí" },
                        { "sigla": "RJ", "nome": "Rio de Janeiro" },
                        { "sigla": "RN", "nome": "Rio Grande do Norte" },
                        { "sigla": "RS", "nome": "Rio Grande do Sul" },
                        { "sigla": "RO", "nome": "Rondônia" },
                        { "sigla": "RR", "nome": "Roraima" },
                        { "sigla": "SC", "nome": "Santa Catarina" },
                        { "sigla": "SP", "nome": "São Paulo" },
                        { "sigla": "SE", "nome": "Sergipe" },
                        { "sigla": "TO", "nome": "Tocantins" }
                    ]
                };
                await fs.writeFile(estadosPath, JSON.stringify(estados, null, 2));
            }

            // Initialize files if they don't exist
            await this.initializeFile(this.usersFile, { users: [] });
            await this.initializeFile(this.statsFile, { stats: {} });
            await this.initializeFile(this.interactionsFile, { interactions: [] });
        } catch (error) {
            console.error('Erro ao inicializar o JsonStore:', error);
            throw error;
        }
    }

    async initializeFile(filePath, defaultContent) {
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
        }
    }

    async readFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${filePath}:`, error);
            return null;
        }
    }

    async writeFile(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing ${filePath}:`, error);
        }
    }

    // User methods
    async findUserByUsername(username) {
        const data = await this.readFile(this.usersFile);
        return data.users.find(user => user.username === username);
    }

    async findUserById(id) {
        const data = await this.readFile(this.usersFile);
        return data.users.find(user => user.id === id);
    }

    async createUser(userData) {
        const data = await this.readFile(this.usersFile);
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        data.users.push(newUser);
        await this.writeFile(this.usersFile, data);
        return newUser;
    }

    // Stats methods
    async getStats() {
        const data = await this.readFile(this.statsFile);
        return data.stats;
    }

    async updateStats(stats) {
        await this.writeFile(this.statsFile, { stats });
    }

    // Interactions methods
    async getInteractions() {
        const data = await this.readFile(this.interactionsFile);
        return data.interactions;
    }

    async addInteraction(interaction) {
        const data = await this.readFile(this.interactionsFile);
        data.interactions.push({
            id: Date.now().toString(),
            ...interaction,
            timestamp: new Date().toISOString()
        });
        await this.writeFile(this.interactionsFile, data);
    }
}

module.exports = new JsonStore(); 