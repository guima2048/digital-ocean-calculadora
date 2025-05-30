const { spawn } = require('child_process');
const net = require('net');

// Configurações
const startPort = 3000;
const maxPort = 3010;
let currentPort = startPort;

// Função para verificar se uma porta está em uso
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer()
            .once('error', () => resolve(true))
            .once('listening', () => {
                server.close();
                resolve(false);
            })
            .listen(port);
    });
}

// Função para iniciar o servidor
async function startServer() {
    console.log('\x1b[34m%s\x1b[0m', '🚀 Iniciando servidor...');

    // Encontrar uma porta disponível
    while (currentPort <= maxPort) {
        const inUse = await isPortInUse(currentPort);
        if (!inUse) break;
        currentPort++;
    }

    if (currentPort > maxPort) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Erro: Todas as portas estão em uso (3000-3010)');
        process.exit(1);
    }

    // Atualizar a porta no arquivo .env se necessário
    if (currentPort !== startPort) {
        const fs = require('fs');
        try {
            let envContent = '';
            if (fs.existsSync('.env')) {
                envContent = fs.readFileSync('.env', 'utf8');
            }
            
            if (envContent.includes('PORT=')) {
                envContent = envContent.replace(/PORT=\d+/, `PORT=${currentPort}`);
            } else {
                envContent += `\nPORT=${currentPort}`;
            }
            
            fs.writeFileSync('.env', envContent.trim());
            console.log('\x1b[33m%s\x1b[0m', `📝 Porta atualizada no arquivo .env: ${currentPort}`);
        } catch (err) {
            console.warn('\x1b[33m%s\x1b[0m', '⚠️ Não foi possível atualizar o arquivo .env');
        }
    }

    // Iniciar o servidor
    const server = spawn('node', ['server.js'], {
        stdio: 'inherit',
        env: { ...process.env, PORT: currentPort }
    });

    server.on('error', (err) => {
        console.error('\x1b[31m%s\x1b[0m', '❌ Erro ao iniciar o servidor:', err.message);
        process.exit(1);
    });

    // Manipular sinais de término
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach(signal => {
        process.on(signal, () => {
            console.log('\n\x1b[34m%s\x1b[0m', '👋 Encerrando servidor...');
            server.kill();
            process.exit(0);
        });
    });

    console.log('\x1b[32m%s\x1b[0m', `✅ Servidor iniciado em http://localhost:${currentPort}`);
}

// Iniciar o servidor
startServer().catch(err => {
    console.error('\x1b[31m%s\x1b[0m', '❌ Erro:', err.message);
    process.exit(1);
}); 