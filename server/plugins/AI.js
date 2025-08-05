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
        ],
        stream: true, //开启流式输出
        stream_options:{
            //返回本次请求使用的token量
            include_usage: true
        }
    });
}

module.exports = {
    AI,chat
}
