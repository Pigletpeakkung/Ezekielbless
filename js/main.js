
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
        // Add all other traditions here...
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await initLocalQuotes();
    setupEventListeners();
});

function setupEventListeners() {
    elements.wisdomCross.addEventListener('click', fetchAndDisplayWisdom);
    elements.dailyWisdom.addEventListener('click', getDailyWisdom);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.changeTradition.addEventListener('click', changeTradition);
}

async function fetchAndDisplayWisdom() {
    const tradition = sacredSources.traditions[sacredSources.currentTradition];
    
    // Show loading state
    elements.wisdomCross.classList.add('loading');
    
    try {
        // Trigger animations
        animateSacredGeometry(tradition.category);
        animateGlowOverlay();
        
        // Fetch wisdom
        const wisdom = await fetchWisdom(tradition);
        showWisdom(wisdom);
        
        // Auto-play audio
        speakQuote(wisdom.text, wisdom.source);
    } catch (error) {
        showError("Failed to connect to divine wisdom");
    } finally {
        elements.wisdomCross.classList.remove('loading');
    }
}

// Other core functions...


// Initialize local quotes from JSON files
async function initLocalQuotes() {
  try {
    const responses = await Promise.all([
      fetch('quotes/conversations-with-god.json'),
      fetch('quotes/seth-speaks.json'),
      fetch('quotes/law-of-one.json')
    ]);
    
    const [cwg, seth, lawofone] = await Promise.all(responses.map(r => r.json()));
    
    // Update the sacredSources object with local quotes
    sacredSources.traditions[1].quotes = cwg.quotes; // CwG
    sacredSources.traditions[2].quotes = seth.quotes; // Seth
    sacredSources.traditions[5].quotes = lawofone.quotes; // Law of One
  } catch (error) {
    console.error("Error loading local quotes:", error);
  }
}

// Fetch wisdom from API or local quotes
async function fetchWisdom(tradition) {
  try {
    if (tradition.type === 'local') {
      // Get random quote from local collection
      const randomIndex = Math.floor(Math.random() * tradition.quotes.length);
      return tradition.parser(tradition.quotes[randomIndex]);
    } else {
      // Fetch from API via Cloudflare Worker
      const response = await fetch(tradition.api, {
        signal: AbortSignal.timeout(5000),
        headers: { 'X-Wisdom-Source': tradition.name }
      });
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return tradition.parser(data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      text: "The universe whispers in many ways. Try again.",
      source: "Cosmic Wisdom",
      category: 'universal'
    };
  }
}

// Display wisdom on the page
function showWisdom(wisdom) {
  // Fade out existing content
  gsap.to([".quote", ".prompt"], {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      // Update DOM elements
      document.getElementById('quoteText').textContent = `"${wisdom.text}"`;
      document.getElementById('quoteSource').textContent = `- ${wisdom.source}`;
      
      // Generate contextual prompt
      const prompt = generatePrompt(wisdom, sacredSources.traditions[sacredSources.currentTradition].name);
      document.getElementById('promptText').textContent = prompt;
      
      // Enable TTS button
      document.getElementById('speakQuote').disabled = false;
      
      // Fade in new content
      gsap.to(".quote", { opacity: 1, duration: 0.5 });
      gsap.to(".prompt", { opacity: 1, duration: 0.5, delay: 0.2 });
      
      // Update tradition indicator
      updateTraditionIndicator(wisdom.category);
    }
  });
}

// Generate contextual reflection prompt
function generatePrompt(quote, tradition) {
  const themes = {
    love: ["compassion", "connection", "unity"],
    wisdom: ["insight", "understanding", "clarity"],
    life: ["journey", "purpose", "being"]
  };
  
  // Tradition-specific prompts
  const traditionPrompts = {
    christian: "How might this divine message guide you today?",
    islamic: "What deeper meaning does this ayah reveal to you?",
    hindu: "How can you apply this dharma in your actions?",
    buddhist: "What mindfulness does this teaching inspire?",
    taoist: "How does this wisdom flow with your current path?",
    rumi: "What heart-opening does this verse invite?",
    watts: "How does this perspective shift your awareness?",
    cwg: "How does this conversation resonate with your truth?",
    seth: "What reality are you creating with this knowledge?",
    lawofone: "How does this law reflect in your service to others?"
  };
  
  return traditionPrompts[quote.category] || "Reflect on how this wisdom resonates with you.";
}

// Cycle through traditions
function changeTradition() {
  sacredSources.currentTradition = 
    (sacredSources.currentTradition + 1) % sacredSources.traditions.length;
  
  // Visual feedback
  const indicator = document.querySelector('.tradition-indicator');
  gsap.to(indicator, {
    scale: 1.2,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
  
  updateTraditionIndicator();
}

// Update the tradition display
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

// Toggle dark/light theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('sacredTheme', newTheme);
  
  // Animate transition
  gsap.to("body", {
    backgroundColor: newTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    duration: 0.5
  });
}

// Get daily wisdom based on day of week
function getDailyWisdom() {
  const day = new Date().getDay(); // 0-6
  sacredSources.currentTradition = day % sacredSources.traditions.length;
  fetchAndDisplayWisdom();
}

// Error handling
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  gsap.fromTo(errorElement, 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3 }
  );
}
