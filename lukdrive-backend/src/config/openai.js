const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn("WARNING: OPENAI_API_KEY is missing from config.env. AI features will be disabled.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

module.exports = openai;