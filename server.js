require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Rotas da API
app.use('/api', apiRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota do painel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calculadora')
    .then(() => {
        console.log('📦 Conectado ao MongoDB');
    })
    .catch((err) => {
        console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    });

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Tratamento de erro para porta em uso
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`⚠️ Porta ${PORT} em uso, tentando a próxima porta...`);
        server.close();
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${newPort}`);
        });
    }
}); 