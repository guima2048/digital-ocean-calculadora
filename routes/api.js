const express = require('express');
const router = express.Router();

const respostasController = require('../controllers/respostasController');
const trafegoController = require('../controllers/trafegoController');
const authController = require('../controllers/authController');
const comportamentoController = require('../controllers/comportamentoController');
const plataformasController = require('../controllers/plataformasController');
const interacoesController = require('../controllers/interacoesController');

// Rotas públicas
router.post('/login', authController.login);
router.post('/respostas', respostasController.salvarResposta);
router.post('/trafego', trafegoController.registrarAcesso);
router.put('/trafego/duracao', trafegoController.atualizarDuracao);

// Middleware de autenticação para rotas protegidas
router.use(authController.verificarToken);

// Rotas protegidas
router.get('/estatisticas', respostasController.obterEstatisticas);
router.get('/estatisticas/cidades', respostasController.obterEstatisticasCidades);
router.get('/estatisticas/perguntas', respostasController.obterEstatisticasPerguntas);
router.get('/estatisticas/comportamento', comportamentoController.obterEstatisticasComportamento);
router.get('/estatisticas/plataformas', plataformasController.obterEstatisticasPlataformas);
router.get('/estatisticas/interacoes', interacoesController.obterEstatisticasInteracoes);
router.get('/usuarios', respostasController.obterUsuarios);
router.get('/relatorio', respostasController.obterDadosRelatorio);
router.get('/trafego/estatisticas', trafegoController.obterEstatisticas);

// Rota administrativa (use apenas uma vez)
router.post('/admin/criar', authController.criarAdmin);

module.exports = router; 