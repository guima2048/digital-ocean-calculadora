const bcrypt = require('bcryptjs');
const store = require('../models/JsonStore');

async function initAdmin() {
    try {
        // Criar usuário admin padrão
        const adminUser = {
            id: 1,
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin'
        };

        // Salvar no arquivo users.json
        await store.saveData('users', [adminUser]);
        
        console.log('✅ Usuário admin criado com sucesso!');
        console.log('Username: admin');
        console.log('Password: admin123');
    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
    }
}

initAdmin(); 