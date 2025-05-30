const { estados, municipiosPorEstado } = require('../data/locationData');

class LocationService {
    constructor() {
        this.estadosData = estados.estados;
        this.municipiosData = this.convertMunicipiosToArray();
    }

    convertMunicipiosToArray() {
        const result = [];
        Object.entries(municipiosPorEstado).forEach(([estado, cidades]) => {
            cidades.forEach(cidade => {
                result.push({
                    nome: cidade,
                    estado: estado
                });
            });
        });
        return result;
    }

    async getEstados() {
        return this.estadosData.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    async getMunicipiosPorEstado(siglaEstado) {
        const estado = this.estadosData.find(e => e.sigla.toUpperCase() === siglaEstado.toUpperCase());
        if (!estado) return [];

        return municipiosPorEstado[siglaEstado.toUpperCase()] || [];
    }

    async getMunicipio(nome, siglaEstado) {
        const estado = this.estadosData.find(e => e.sigla.toUpperCase() === siglaEstado.toUpperCase());
        if (!estado) return null;

        const municipio = this.municipiosData.find(m => 
            m.nome.toUpperCase() === nome.toUpperCase() && 
            m.estado.toUpperCase() === estado.sigla.toUpperCase()
        );

        return municipio || null;
    }
}

module.exports = LocationService; 