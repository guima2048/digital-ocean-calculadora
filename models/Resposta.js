const mongoose = require('mongoose');

const RespostaSchema = new mongoose.Schema({
    estado: {
        type: String,
        required: true,
        uppercase: true
    },
    cidade: {
        type: String,
        required: true
    },
    respostas: {
        idade: String,
        escolaridade: String,
        disponibilidadeViagens: String,
        cuidadosAparencia: String,
        situacaoProfissional: String,
        // Outros campos conforme necessário
    },
    valorEstimado: {
        type: Number,
        required: true
    },
    plataformaEscolhida: {
        type: String,
        required: true
    },
    tempoPrenchimento: {
        type: Number, // em segundos
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

// Índices para consultas frequentes
RespostaSchema.index({ cidade: 1, estado: 1 });
RespostaSchema.index({ data: -1 });
RespostaSchema.index({ plataformaEscolhida: 1 });

module.exports = mongoose.model('Resposta', RespostaSchema); 