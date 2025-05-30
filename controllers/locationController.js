const LocationService = require('../services/locationService');
const locationService = new LocationService();

// Obter lista de estados
exports.getEstados = async (req, res) => {
    try {
        const estados = await locationService.getEstados();
        res.json({
            success: true,
            data: estados
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obter municípios por estado
exports.getMunicipiosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const municipios = await locationService.getMunicipiosPorEstado(estado);
        res.json({
            success: true,
            data: municipios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Obter município específico
exports.getMunicipio = async (req, res) => {
    try {
        const { nome, estado } = req.query;
        if (!nome || !estado) {
            return res.status(400).json({
                success: false,
                error: 'Nome do município e estado são obrigatórios'
            });
        }
        const municipio = await locationService.getMunicipio(nome, estado);
        if (!municipio) {
            return res.status(404).json({
                success: false,
                error: 'Município não encontrado'
            });
        }
        res.json({
            success: true,
            data: municipio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 