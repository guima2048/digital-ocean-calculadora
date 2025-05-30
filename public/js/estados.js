// Debug flag
const DEBUG = true;

// Debug function
function logDebug(message, data = null) {
    if (DEBUG) {
        console.log(`[EstadosService] ${message}`, data || '');
    }
}

logDebug('Módulo estados.js carregado');

// Dados fixos de estados e municípios
const estados = [
    {"id": 11, "sigla": "RO", "nome": "Rondônia", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 12, "sigla": "AC", "nome": "Acre", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 13, "sigla": "AM", "nome": "Amazonas", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 14, "sigla": "RR", "nome": "Roraima", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 15, "sigla": "PA", "nome": "Pará", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 16, "sigla": "AP", "nome": "Amapá", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 17, "sigla": "TO", "nome": "Tocantins", "regiao": {"id": 1, "sigla": "N", "nome": "Norte"}},
    {"id": 21, "sigla": "MA", "nome": "Maranhão", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 22, "sigla": "PI", "nome": "Piauí", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 23, "sigla": "CE", "nome": "Ceará", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 24, "sigla": "RN", "nome": "Rio Grande do Norte", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 25, "sigla": "PB", "nome": "Paraíba", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 26, "sigla": "PE", "nome": "Pernambuco", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 27, "sigla": "AL", "nome": "Alagoas", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 28, "sigla": "SE", "nome": "Sergipe", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 29, "sigla": "BA", "nome": "Bahia", "regiao": {"id": 2, "sigla": "NE", "nome": "Nordeste"}},
    {"id": 31, "sigla": "MG", "nome": "Minas Gerais", "regiao": {"id": 3, "sigla": "SE", "nome": "Sudeste"}},
    {"id": 32, "sigla": "ES", "nome": "Espírito Santo", "regiao": {"id": 3, "sigla": "SE", "nome": "Sudeste"}},
    {"id": 33, "sigla": "RJ", "nome": "Rio de Janeiro", "regiao": {"id": 3, "sigla": "SE", "nome": "Sudeste"}},
    {"id": 35, "sigla": "SP", "nome": "São Paulo", "regiao": {"id": 3, "sigla": "SE", "nome": "Sudeste"}},
    {"id": 41, "sigla": "PR", "nome": "Paraná", "regiao": {"id": 4, "sigla": "S", "nome": "Sul"}},
    {"id": 42, "sigla": "SC", "nome": "Santa Catarina", "regiao": {"id": 4, "sigla": "S", "nome": "Sul"}},
    {"id": 43, "sigla": "RS", "nome": "Rio Grande do Sul", "regiao": {"id": 4, "sigla": "S", "nome": "Sul"}},
    {"id": 50, "sigla": "MS", "nome": "Mato Grosso do Sul", "regiao": {"id": 5, "sigla": "CO", "nome": "Centro-Oeste"}},
    {"id": 51, "sigla": "MT", "nome": "Mato Grosso", "regiao": {"id": 5, "sigla": "CO", "nome": "Centro-Oeste"}},
    {"id": 52, "sigla": "GO", "nome": "Goiás", "regiao": {"id": 5, "sigla": "CO", "nome": "Centro-Oeste"}},
    {"id": 53, "sigla": "DF", "nome": "Distrito Federal", "regiao": {"id": 5, "sigla": "CO", "nome": "Centro-Oeste"}}
];

const municipiosPorEstado = {
    "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
    "AL": ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "São Miguel dos Campos"],
    "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão"],
    "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"],
    "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
    "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
    "DF": ["Brasília"],
    "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
    "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
    "MA": ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias"],
    "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
    "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"],
    "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"],
    "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
    "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
    "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"],
    "RJ": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
    "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
    "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"],
    "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí"],
    "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"],
    "SP": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André"],
    "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"],
    "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"]
};

// Função para carregar estados
async function carregarEstados() {
    return estados;
}

// Função para carregar municípios por estado
async function carregarMunicipios(estado) {
    return municipiosPorEstado[estado] || [];
}

// Função para popular o select de estados
async function popularSelectEstados(selectElement) {
    try {
        selectElement.innerHTML = '<option value="">Selecione um estado</option>';
        estados
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = `${estado.nome} (${estado.sigla})`;
                selectElement.appendChild(option);
            });
    } catch (error) {
        console.error('Erro ao popular select de estados:', error);
        throw error;
    }
}

// Função para filtrar municípios
async function filtrarMunicipios(estado, termo) {
    if (!estado || !termo || termo.length < 2) {
        return [];
    }

    try {
        const municipios = await carregarMunicipios(estado);
        return municipios
            .filter(cidade => cidade.toLowerCase().includes(termo.toLowerCase()))
            .slice(0, 10)
            .map(nome => ({ nome }));
    } catch (error) {
        console.error('Erro ao filtrar municípios:', error);
        return [];
    }
}

// Exportar funções
logDebug('Exportando funções para window.estadosService');
window.estadosService = {
    carregarEstados,
    carregarMunicipios,
    popularSelectEstados,
    filtrarMunicipios
};

logDebug('Módulo estados.js inicializado com sucesso'); 