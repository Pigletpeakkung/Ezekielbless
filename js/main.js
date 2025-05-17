// Configuration
const sacredSources = {
    traditions: [
        { 
            name: 'Christian', 
            type: 'api',
            api: 'https://your-worker.workers.dev/proxy/christian/random',
            parser: data => ({
                text: data.text || "Divine wisdom flows eternally",
                source: data.reference || "Holy Bible",
                category: 'christian'
            })
        },
        {
            name: 'Conversations with God',
            type: 'local',
            quotes: [],
            parser: data => ({
                text: data.text || "You are eternally loved",
                source: data.source || "CwG Book 1",
                category: 'cwg'
            })
        },
        {
            name: 'Seth Speaks',
            type: 'local',
            quotes: [],
            parser: data => ({
                text: data.text || "You create your own reality",
                source: data.source || "Seth Session",
                category: 'seth'
            })
        },
        {
            name: 'Rumi',
            type: 'api',
            api: 'https://your-worker.workers.dev/proxy/rumi/random',
            parser: data => ({
                text: data.quote || "What you seek is seeking you",
                source: data.source || "Rumi",
                category: 'rumi'
            })
        },
        {
            name: 'Alan Watts',
            type: 'api',
            api: 'https://your-worker.workers.dev/proxy/watts/random',
            parser: data => ({
                text: data.quote || "The only way to make sense out of change is to plunge into it",
                source: data.lecture || "Alan Watts Lecture",
                category: 'watts'
            })
        },
        {
            name: 'Law of One',
            type: 'local',
            quotes: [],
            parser: data => ({
                text: data.text || "All is one, and that one is love",
                source: data.source || "Ra Material",
                category: 'lawofone'
            })
        },
        {
            name: 'Buddhist',
            type: 'api',
            api: 'https://your-worker.workers.dev/proxy/buddhist/random',
            parser: data => ({
                text: data.text || "Peace comes from within",
                source: data.source || "Dhammapada",
                category: 'buddhist'
            })
        },
        {
            name: 'Tao Te Ching',
            type: 'api',
            api: 'https://your-worker.workers.dev/proxy/tao/random',
            parser: data => ({
                text: data.text || "The journey of a thousand miles begins with one step",
                source: `Tao Te Ching ${data.chapter || "Chapter"}`,
                category: 'taoist'
            })
        }
    ],
    currentTradition: 0
};

// DOM Elements
const elements = {
    wisdomCross: document.getElementById('wisdomCross'),
    wisdomDisplay: document.getElementById('wisdomDisplay'),
    quoteText: document.getElementById('quoteText'),
    quoteSource: document.getElementById('quoteSource'),
    promptText: document.getElementById('promptText'),
    errorMessage: document.getElementById('errorMessage'),
    dailyWisdom: document.getElementById('dailyWisdom'),
    themeToggle: document.getElementById('themeToggle'),
    changeTradition: document.getElementById('changeTradition')
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    await initLocalQuotes();
    setupEventListeners();
    loadTheme();
});

async function initLocalQuotes() {
    try {
        const responses = await Promise.all([
            fetch('quotes/conversations-with-god.json'),
            fetch('quotes/seth-speaks.json'),
            fetch('quotes/law-of-one.json')
        ]);
        
        const [cwg, seth, lawofone] = await Promise.all(responses.map(r => r.json()));
        
        sacredSources.traditions[1].quotes = cwg.quotes;
        sacredSources.traditions[2].quotes = seth.quotes;
        sacredSources.traditions[5].quotes = lawofone.quotes;
    } catch (error) {
        console.error("Error loading local quotes:", error);
    }
}

function setupEventListeners() {
    elements.wisdomCross.addEventListener('click', fetchAndDisplayWisdom);
    elements.dailyWisdom.addEventListener('click', getDailyWisdom);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.changeTradition.addEventListener('click', changeTradition);
}

async function fetchAndDisplayWisdom() {
    const tradition = sacredSources.traditions[sacredSources.currentTradition];
    elements.wisdomCross.classList.add('loading');
    
    try {
        animateSacredGeometry(tradition.category);
        animateGlowOverlay();
        
        const wisdom = await fetchWisdom(tradition);
        showWisdom(wisdom);
        speakQuote(wisdom.text, wisdom.source);
    } catch (error) {
        showError("Failed to connect to divine wisdom");
    } finally {
        elements.wisdomCross.classList.remove('loading');
    }
}

async function fetchWisdom(tradition) {
    try {
        if (tradition.type === 'local') {
            const randomIndex = Math.floor(Math.random() * tradition.quotes.length);
            return tradition.parser(tradition.quotes[randomIndex]);
        }

        const response = await fetch(tradition.api, {
            signal: AbortSignal.timeout(5000),
            headers: { 'X-Wisdom-Source': tradition.name }
        });
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return tradition.parser(data);
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            text: "The universe whispers in many ways. Try again.",
            source: "Cosmic Wisdom",
            category: 'universal'
        };
    }
}

function showWisdom(wisdom) {
    gsap.to([".quote", ".prompt"], {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            elements.quoteText.textContent = `"${wisdom.text}"`;
            elements.quoteSource.textContent = `- ${wisdom.source}`;
            elements.promptText.textContent = generatePrompt(wisdom);
            elements.speakQuote.disabled = false;
            
            gsap.to(".quote", { opacity: 1, duration: 0.5 });
            gsap.to(".prompt", { opacity: 1, duration: 0.5, delay: 0.2 });
            updateTraditionIndicator(wisdom.category);
        }
    });
}

function generatePrompt(wisdom) {
    const prompts = {
        christian: "How might this divine message guide you today?",
        islamic: "What deeper meaning does this ayah reveal to you?",
        hindu: "How can you apply this dharma in your actions?",
        buddhist: "What mindfulness does this teaching inspire?",
        taoist: "How does this wisdom flow with your current path?",
        rumi: "What heart-opening does this verse invite?",
        watts: "How does this perspective shift your awareness?",
        cwg: "How does this conversation resonate with your truth?",
        seth: "What reality are you creating with this knowledge?",
        lawofone: "How does this law reflect in your service to others?",
        universal: "Reflect on how this wisdom resonates with you."
    };
    
    return prompts[wisdom.category] || prompts.universal;
}

function changeTradition() {
    sacredSources.currentTradition = 
        (sacredSources.currentTradition + 1) % sacredSources.traditions.length;
    
    gsap.to('.tradition-indicator', {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });
    
    updateTraditionIndicator();
}

function updateTraditionIndicator(category) {
    let indicator = document.querySelector('.tradition-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'tradition-indicator';
        document.body.appendChild(indicator);
    }
    
    const current = sacredSources.traditions[sacredSources.currentTradition];
    indicator.textContent = current.name;
    indicator.className = `tradition-indicator ${category || current.category}`;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sacredTheme', newTheme);
    
    gsap.to("body", {
        backgroundColor: newTheme === 'dark' ? '#1a1a1a' : '#ffffff',
        duration: 0.5
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('sacredTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function getDailyWisdom() {
    const day = new Date().getDay();
    sacredSources.currentTradition = day % sacredSources.traditions.length;
    fetchAndDisplayWisdom();
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
    
    gsap.fromTo(elements.errorMessage, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
    );
}
