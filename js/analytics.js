// Módulo de Analytics
const Analytics = {
    // Chave para localStorage
    STORAGE_KEY: 'sugar_calculator_analytics',
    
    // Inicializar analytics
    init() {
        this.startSession();
        this.trackPageView();
        this.setupEventListeners();
        this.setupFormTracking();
    },

    // Iniciar nova sessão
    startSession() {
        const session = {
            id: this.generateSessionId(),
            startTime: new Date().getTime(),
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            location: null
        };

        // Tentar obter localização do usuário
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    session.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.updateSession(session);
                },
                () => {
                    this.updateSession(session);
                }
            );
        } else {
            this.updateSession(session);
        }

        sessionStorage.setItem('current_session', session.id);
    },

    // Gerar ID único para sessão
    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Atualizar dados da sessão
    updateSession(session) {
        const analytics = this.getStoredData();
        analytics.sessions = analytics.sessions || [];
        analytics.sessions.push(session);
        this.saveData(analytics);
    },

    // Registrar visualização de página
    trackPageView() {
        const pageView = {
            timestamp: new Date().getTime(),
            path: window.location.pathname,
            title: document.title,
            sessionId: sessionStorage.getItem('current_session')
        };

        const analytics = this.getStoredData();
        analytics.pageViews = analytics.pageViews || [];
        analytics.pageViews.push(pageView);
        this.saveData(analytics);

        // Iniciar contagem de tempo na página
        this.startTimeTracking();
    },

    // Rastrear tempo na página
    startTimeTracking() {
        const startTime = new Date().getTime();
        
        window.addEventListener('beforeunload', () => {
            const endTime = new Date().getTime();
            const timeSpent = endTime - startTime;

            const analytics = this.getStoredData();
            analytics.timeOnPage = analytics.timeOnPage || [];
            analytics.timeOnPage.push({
                path: window.location.pathname,
                duration: timeSpent,
                sessionId: sessionStorage.getItem('current_session'),
                timestamp: endTime
            });
            this.saveData(analytics);
        });
    },

    // Configurar listeners de eventos
    setupEventListeners() {
        // Exemplo: rastrear cliques em botões
        document.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                this.trackEvent('button_click', {
                    buttonText: e.target.textContent,
                    buttonId: e.target.id
                });
            }
        });
    },

    // Registrar eventos personalizados
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().getTime(),
            sessionId: sessionStorage.getItem('current_session'),
            path: window.location.pathname
        };

        const analytics = this.getStoredData();
        analytics.events = analytics.events || [];
        analytics.events.push(event);
        this.saveData(analytics);
    },

    // Obter dados armazenados
    getStoredData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    // Salvar dados
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Limpar dados antigos (manter apenas últimos 30 dias)
    cleanOldData() {
        const analytics = this.getStoredData();
        const thirtyDaysAgo = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);

        // Limpar sessões antigas
        if (analytics.sessions) {
            analytics.sessions = analytics.sessions.filter(
                session => session.startTime > thirtyDaysAgo
            );
        }

        // Limpar visualizações antigas
        if (analytics.pageViews) {
            analytics.pageViews = analytics.pageViews.filter(
                view => view.timestamp > thirtyDaysAgo
            );
        }

        // Limpar dados de tempo na página
        if (analytics.timeOnPage) {
            analytics.timeOnPage = analytics.timeOnPage.filter(
                time => time.timestamp > thirtyDaysAgo
            );
        }

        // Limpar eventos antigos
        if (analytics.events) {
            analytics.events = analytics.events.filter(
                event => event.timestamp > thirtyDaysAgo
            );
        }

        this.saveData(analytics);
    },

    // Rastrear interações do formulário
    setupFormTracking() {
        const form = document.getElementById('calculadoraSugar');
        if (!form) return;

        // Registrar início do preenchimento
        form.addEventListener('focusin', () => {
            if (!sessionStorage.getItem('form_started')) {
                sessionStorage.setItem('form_started', new Date().getTime());
                this.trackEvent('form_start');
            }
        }, { once: true });

        // Rastrear mudanças em cada campo
        form.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('change', (e) => {
                this.trackEvent('form_field_change', {
                    field: e.target.name || e.target.id,
                    value: e.target.value
                });
            });
        });

        // Rastrear envio do formulário
        form.addEventListener('submit', (e) => {
            const startTime = parseInt(sessionStorage.getItem('form_started'));
            const endTime = new Date().getTime();
            const timeSpent = Math.round((endTime - startTime) / 1000); // em segundos

            this.trackEvent('form_submit', {
                timeSpent,
                formData: this.getFormData(form)
            });
        });

        // Rastrear cliques nas plataformas
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const platformName = card.querySelector('.platform-name').textContent;
                this.trackEvent('platform_click', {
                    platform: platformName,
                    cidade: document.getElementById('cidade').value
                });
            });
        });

        // Rastrear abandono
        window.addEventListener('beforeunload', () => {
            if (sessionStorage.getItem('form_started') && !sessionStorage.getItem('form_completed')) {
                this.trackEvent('form_abandon', {
                    lastField: document.activeElement.name || document.activeElement.id
                });
            }
        });
    },

    // Coletar dados do formulário
    getFormData(form) {
        const formData = {};
        form.querySelectorAll('input, select').forEach(field => {
            if (field.type === 'radio') {
                if (field.checked) {
                    formData[field.name] = field.value;
                }
            } else {
                formData[field.name || field.id] = field.value;
            }
        });
        return formData;
    }
};

// Inicializar analytics quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
    
    // Limpar dados antigos uma vez por dia
    const lastCleanup = localStorage.getItem('last_analytics_cleanup');
    const now = new Date().getTime();
    
    if (!lastCleanup || (now - parseInt(lastCleanup)) > (24 * 60 * 60 * 1000)) {
        Analytics.cleanOldData();
        localStorage.setItem('last_analytics_cleanup', now.toString());
    }
}); 