const fs = require('fs').promises;
const path = require('path');
const store = require('../models/JsonStore');

async function setup() {
    try {
        // 1. Criar diretórios necessários
        const directories = [
            'data',
            'public/data',
            'admin/js',
            'admin/styles',
            'models',
            'controllers',
            'middleware',
            'routes'
        ];

        for (const dir of directories) {
            await fs.mkdir(path.join(__dirname, '..', dir), { recursive: true });
        }

        // 2. Inicializar arquivos JSON
        const initialData = {
            users: [],
            stats: {
                totalCalculos: 0,
                mediaValores: 0,
                rankingCidades: [],
                comparativoPlataformas: []
            },
            interactions: []
        };

        for (const [file, data] of Object.entries(initialData)) {
            await store.saveData(file, data);
        }

        console.log('✅ Estrutura de diretórios e arquivos criada com sucesso!');
        
        // 3. Criar usuário admin
        require('./init-admin');

    } catch (error) {
        console.error('❌ Erro durante o setup:', error);
    }
}

setup(); 