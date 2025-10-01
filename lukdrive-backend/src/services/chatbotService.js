const openai = require('../config/openai');

/**
 * Gets a response from the AI chatbot based on a user's query.
 * @param {string} userQuery - The question from the user.
 * @param {object} context - Optional context, e.g., { currentChapter: 'Chapter 3: Road Signs' }.
 * @returns {Promise<string>} The AI's response as a string.
 */
async function getChatbotResponse(userQuery, context = {}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured.');
  }

  try {
    const contextInfo = context.currentChapter
      ? `The user is currently studying: ${context.currentChapter}.`
      : '';

    const prompt = `
      You are an expert chatbot assistant for a Cameroonian driving school platform called LukDrive.
      Your role is to help students understand the Cameroonian road code and driving rules.
      Answer the user's question clearly and concisely. If the question is outside the scope of driving rules, politely decline to answer.
      ${contextInfo}

      User's Question: "${userQuery}"
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert chatbot for the Cameroonian road code.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5, // Make the response more focused
      max_tokens: 150, // Limit the length of the response
    });

    return completion.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error getting response from OpenAI:', error);
    throw new Error('The AI assistant is currently unavailable. Please try again later.');
  }
}

module.exports = {
  getChatbotResponse,
};