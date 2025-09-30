const openai = require('../config/openai');
const supabase = require('../config/database');
const pdf = require('pdf-parse');
const axios = require('axios');

async function generateQuizFromPdfUrl(pdfUrl) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured.');
  }

  try {
    // 1. Download the PDF from the public URL
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data, 'binary');

    // 2. Parse the PDF to extract text
    const data = await pdf(pdfBuffer);
    const pdfText = data.text.substring(0, 8000); // Limit text to avoid exceeding token limits

    // 3. Construct the prompt for OpenAI
    const prompt = `
      Based on the following text from a driving school manual, generate a 10-question multiple-choice quiz.
      The output must be a valid JSON array of objects. Each object should have a "question" (string), "options" (an array of 4 strings), and a "correct_answer" (the string of the correct option).
      Do not include any other text or explanations outside of the JSON array.

      Text:
      ---
      ${pdfText}
      ---
    `;

    // 4. Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // Model optimized for JSON output
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that creates educational quizzes for driving school students. Always respond with only the requested JSON content.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 5. Parse and return the quiz data
    const quizContent = completion.choices[0].message.content;
    // The model is now instructed to return a JSON object with a 'questions' key
    const quizData = JSON.parse(quizContent);

    // The prompt asks for an array, but the model might wrap it in an object.
    // Let's ensure we return the array of questions.
    return quizData.questions || quizData;

  } catch (error) {
    console.error('Error generating quiz with OpenAI:', error);
    // Check for specific OpenAI errors if needed
    if (error.response) {
      console.error(error.response.data);
    }
    throw new Error('Failed to generate quiz. Please try again later.');
  }
}

module.exports = {
  generateQuizFromPdfUrl,
};