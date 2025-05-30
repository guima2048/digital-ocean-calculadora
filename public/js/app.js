// Elementos do DOM
const estadoSelect = document.getElementById('estado');
const cidadeInput = document.getElementById('cidade');
const cidadesList = document.getElementById('cidadesList');
const cidadeAlerta = document.getElementById('cidadeAlerta');

// Variáveis globais
let cidadeAtual = null;

// Função para debug
function debug(message, data) {
    console.log(`[DEBUG] ${message}:`, data);
}

// Inicializar o select de estados
async function inicializarEstados() {
    try {
        await window.estadosService.popularSelectEstados(estadoSelect);
    } catch (error) {
        console.error('Erro ao inicializar estados:', error);
        cidadeAlerta.textContent = "Erro ao carregar estados. Por favor, recarregue a página.";
        cidadeAlerta.style.display = 'block';
        // Tentar recarregar após 5 segundos
        setTimeout(inicializarEstados, 5000);
    }
}

// Event Listeners
cidadeInput.addEventListener('input', async () => {
    const termo = cidadeInput.value;
    const estado = estadoSelect.value;
    debug('Input da cidade alterado', { termo, estado });
    
    if (termo.length >= 2 && estado) {
        try {
            const cidadesFiltradas = await window.estadosService.filtrarMunicipios(estado, termo);
            mostrarCidades(cidadesFiltradas);
        } catch (error) {
            console.error('Erro ao filtrar cidades:', error);
            cidadeAlerta.textContent = "Erro ao carregar cidades. Por favor, tente novamente.";
            cidadeAlerta.style.display = 'block';
        }
    } else {
        cidadesList.style.display = 'none';
        document.body.classList.remove('dropdown-open');
    }
});

function mostrarCidades(cidades) {
    debug('Mostrando cidades', cidades);
    cidadesList.innerHTML = '';
    
    if (cidades.length === 0) {
        const div = document.createElement('div');
        div.textContent = 'Nenhuma cidade encontrada';
        div.className = 'cidade-item sem-resultado';
        cidadesList.appendChild(div);
    } else {
        cidades.forEach(cidade => {
            const div = document.createElement('div');
            div.className = 'cidade-item';
            div.textContent = cidade.nome;
            div.addEventListener('click', () => selecionarCidade(cidade));
            cidadesList.appendChild(div);
        });
    }
    
    cidadesList.style.display = 'block';
    document.body.classList.add('dropdown-open');
}

function selecionarCidade(cidade) {
    debug('Cidade selecionada', cidade);
    cidadeAtual = cidade;
    cidadeInput.value = cidade.nome;
    cidadesList.style.display = 'none';
    document.body.classList.remove('dropdown-open');
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!cidadeInput.contains(e.target) && !cidadesList.contains(e.target)) {
        cidadesList.style.display = 'none';
        document.body.classList.remove('dropdown-open');
    }
});

estadoSelect.addEventListener('change', () => {
    debug('Estado alterado', estadoSelect.value);
    cidadeInput.value = '';
    cidadeAtual = null;
    cidadeAlerta.style.display = 'none';
    cidadesList.style.display = 'none';
    document.body.classList.remove('dropdown-open');
});

// Inicializar
inicializarEstados();

// Mostrar/ocultar perguntas avançadas
const btnMostrarAvancado = document.getElementById('mostrarAvancado');
const secaoAvancada = document.getElementById('perguntasAvancadas');

btnMostrarAvancado.addEventListener('click', () => {
    secaoAvancada.style.display = secaoAvancada.style.display === 'none' ? 'block' : 'none';
    btnMostrarAvancado.textContent = secaoAvancada.style.display === 'none' ? 
        '+ Responder mais perguntas para estimativa mais precisa' : 
        '- Ocultar perguntas avançadas';
});

// Configuração do formulário
const form = document.getElementById('calculadoraSugar');
const loadingSection = document.getElementById('loading');
const resultadoContent = document.querySelector('.resultado-content');
const loadingText = document.getElementById('loadingText');

const frasesCarga = [
    "Analisando sua região...",
    "Calculando seu potencial sugar...",
    "Procurando matches ideais...",
    "Verificando oportunidades...",
    "Finalizando análise..."
];

function getRenda(populacao) {
    if (populacao >= 5000000) return 6000;
    if (populacao >= 1000000) return 5000;
    if (populacao >= 500000) return 4000;
    if (populacao >= 200000) return 3000;
    if (populacao >= 100000) return 2500;
    return 1500;
}

function getMultiplicadorIdade(idade) {
    if (idade < 18) return 0;
    if (idade === 18) return 1.4;
    if (idade <= 30) return 1.4 - ((idade - 18) * 0.02);
    if (idade <= 35) return 1.16 - ((idade - 30) * 0.032);
    if (idade <= 40) return 1.0 - ((idade - 35) * 0.03);
    if (idade <= 45) return 0.85 - ((idade - 40) * 0.02);
    return 0.75;
}

const plataformas = [
    {
        nome: "Bebaby.app",
        multiplicador: 1.1,
        badge: {
            tipo: "recommended",
            texto: "Mais recomendado",
            subtexto: "Grátis para entrar e receber mensagens"
        },
        entrada: "Grátis para entrar",
        tempoEncontro: "1 dia até o primeiro encontro",
        rating: 9.8
    },
    {
        nome: "Meu Patrocínio",
        investimento: 249,
        destaque: "💰 R$249 para entrar",
        tag: "PREMIUM"
    },
    {
        nome: "Meu Namoro Exclusivo",
        investimento: 0,
        destaque: "🆕 NOVO NO BRASIL",
        tag: "GRATUITO"
    },
    {
        nome: "Universo Sugar",
        investimento: 150,
        destaque: "💎 EXCLUSIVO",
        tag: "PREMIUM"
    },
    {
        nome: "Meu Rubi",
        investimento: 50,
        destaque: "💫 POPULAR",
        tag: "BÁSICO"
    }
];

function getPlataformasRecomendadas() {
    // Ordenar plataformas por rating e popularidade
    const plataformasOrdenadas = [...plataformas].sort((a, b) => {
        // Priorizar Bebaby.app e Meu Namoro Exclusivo
        if (a.nome === "Bebaby.app") return -1;
        if (b.nome === "Bebaby.app") return 1;
        if (a.nome === "Meu Namoro Exclusivo") return -1;
        if (b.nome === "Meu Namoro Exclusivo") return 1;
        
        // Depois ordenar por rating
        return b.rating - a.rating;
    });

    return plataformasOrdenadas;
}

function mostrarResultado(valorBase) {
    const valorMinimo = valorBase * 0.5;
    const valorMaximo = valorBase * 1.2;

    document.getElementById('valorMinimo').textContent = `R$ ${valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('valorBase').textContent = `R$ ${valorBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('valorMaximo').textContent = `R$ ${valorMaximo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const investimento = parseInt(document.querySelector('input[name="investimento"]:checked').value);
    const plataformasRecomendadas = getPlataformasRecomendadas(investimento);
    
    const plataformasList = document.getElementById('plataformasList');
    plataformasList.innerHTML = '';

    plataformasRecomendadas.forEach(plataforma => {
        const card = document.createElement('div');
        card.className = 'plataforma-card';
        card.innerHTML = `
            <h4>${plataforma.nome}</h4>
            <span class="tag">${plataforma.tag}</span>
            <p class="destaque">${plataforma.destaque}</p>
            <p class="investimento">Investimento: R$ ${plataforma.investimento}</p>
        `;
        plataformasList.appendChild(card);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!cidadeAtual) {
        alert('Por favor, selecione uma cidade válida.');
        return;
    }

    // Calcular valores
    const formData = new FormData(form);
    const rendaBase = getRenda(cidadeAtual.populacao);
    const idade = parseInt(formData.get('idade'));
    const multiplicadorIdade = getMultiplicadorIdade(idade);
    
    let multiplicadores = 0;

    // Calcular multiplicadores
    multiplicadores += formData.get('viagem') === 'sim' ? 0.15 : formData.get('viagem') === 'as_vezes' ? 0.05 : 0;
    multiplicadores += formData.get('aparencia') === 'sim' ? 0.1 : formData.get('aparencia') === 'medio' ? 0.05 : 0;
    multiplicadores += {
        'bissexual': 0.7,
        'pansexual': 0.5,
        'hetero': 0.3,
        'lesbica': 0.2,
        'assexual': -0.3,
        'nao_informado': 0
    }[formData.get('orientacao')] || 0;
    multiplicadores += formData.get('ambicao') === 'muito' ? 0.1 : formData.get('ambicao') === 'medio' ? 0.05 : 0;

    if (secaoAvancada.style.display !== 'none') {
        multiplicadores += formData.get('estudo') === 'superior' ? 0.1 : formData.get('estudo') === 'medio' ? 0.05 : 0;
        multiplicadores += formData.get('trabalho') === 'sim' ? 0.05 : formData.get('trabalho') === 'parcial' ? 0.02 : 0;
        multiplicadores += formData.get('filhos') === 'nao' ? 0.1 : formData.get('filhos') === '1' ? -0.05 : -0.1;
        multiplicadores += formData.get('fuma') === 'nao' ? 0.05 : formData.get('fuma') === 'sim' ? -0.05 : 0;
        multiplicadores += formData.get('bebe') === 'social' ? 0.05 : formData.get('bebe') === 'muito' ? -0.05 : 0;
        multiplicadores += formData.get('idiomas') === 'varios' ? 0.15 : formData.get('idiomas') === 'ingles' ? 0.1 : 0;
        multiplicadores += formData.get('hobbies') === 'sim' ? 0.05 : 0;
        multiplicadores += formData.get('personalidade') === 'extrovertida' ? 0.1 : formData.get('personalidade') === 'equilibrada' ? 0.05 : 0;
    }

    const valorBase = rendaBase * (1 + multiplicadores) * multiplicadorIdade;

    // Salvar resultado no localStorage
    const resultadoFinal = {
        cidade: cidadeAtual.nome,
        estado: estadoSelect.value,
        valorBase: rendaBase,
        valorFinal: valorBase,
        multiplicadores: multiplicadores,
        multiplicadorIdade: multiplicadorIdade,
        data: new Date().toISOString()
    };
    localStorage.setItem('resultadoFinal', JSON.stringify(resultadoFinal));

    // Redirecionar para a página de resultados
    window.location.href = 'resultado.html';
});

// Compartilhar no WhatsApp
document.getElementById('compartilharWhatsApp').addEventListener('click', () => {
    const valorBase = document.getElementById('valorBase').textContent;
    const mensagem = encodeURIComponent(
        `🌟 Calculei meu potencial sugar!\n` +
        `💰 Valor médio mensal: ${valorBase}\n` +
        `🔗 Faça sua simulação também: [link do site]`
    );
    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
});

// Carregar último resultado salvo
const ultimoResultado = localStorage.getItem('ultimoResultado');
if (ultimoResultado) {
    const resultado = JSON.parse(ultimoResultado);
    const dataUltimoCalculo = new Date(resultado.data);
    const agora = new Date();
    const diferencaDias = Math.floor((agora - dataUltimoCalculo) / (1000 * 60 * 60 * 24));
    
    if (diferencaDias < 30) {
        const ultimoCalculo = document.getElementById('ultimoCalculo');
        ultimoCalculo.style.display = 'block';
        document.getElementById('ultimaCidade').textContent = `${resultado.cidade}/${resultado.estado}`;
        document.getElementById('ultimoValor').textContent = 
            `R$ ${resultado.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('diasAtras').textContent = 
            diferencaDias === 0 ? 'hoje' : 
            diferencaDias === 1 ? 'ontem' : 
            `há ${diferencaDias} dias`;
    }
} 