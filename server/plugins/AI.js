const OpenAi = require('openai');

const AI = new OpenAi(
    {
        apiKey: process.env.AI_API_KEY,
        baseURL: process.env.AI_BASE_URL,
    }
);

const chat = (question)=>{
    return AI.chat.completions.create({
        model: process.env.AI_MODEL,
        messages: [
            {
                role: 'user',
                content: question
            }
        ]
    });
}

module.exports = {
    AI,chat
}
