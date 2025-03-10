import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Store greetings history
const greetingsHistory = new Map();

// Greet endpoint with enhanced features
app.get('/api/greet', (req, res) => {
  const { name, language = 'en' } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  // Multi-language greetings
  const greetings = {
    en: `Hello, ${name}! Welcome to Younglabs.`,
    es: `¡Hola, ${name}! Bienvenido a Younglabs.`,
    fr: `Bonjour, ${name}! Bienvenue à Younglabs.`,
    de: `Hallo, ${name}! Willkommen bei Younglabs.`
  };

  const encouragements = [
    "You're doing great!",
    "Keep shining!",
    "Today is your day!",
    "You make the world better!",
    "Your potential is limitless!",
    "You're amazing!",
    "Keep up the fantastic work!",
    "Success looks good on you!"
  ];
  
  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
  
  // Get time of day greeting
  const hour = new Date().getHours();
  let timeGreeting = '';
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  // Store greeting in history
  const userGreetings = greetingsHistory.get(name) || [];
  const newGreeting = {
    timestamp: new Date().toISOString(),
    language,
    encouragement: randomEncouragement
  };
  greetingsHistory.set(name, [...userGreetings, newGreeting]);
  
  res.json({
    message: greetings[language] || greetings.en,
    encouragement: randomEncouragement,
    timeGreeting,
    greetingCount: userGreetings.length + 1,
    timestamp: new Date().toISOString()
  });
});

// Get greeting history for a user
app.get('/api/history/:name', (req, res) => {
  const { name } = req.params;
  const history = greetingsHistory.get(name) || [];
  res.json({ history });
});

// Catch-all route to serve the frontend for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});