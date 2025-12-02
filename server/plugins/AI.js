const OpenAi = require('openai');
const {currentFileName} = require("../util/util");
let AI;
try{
    AI = new OpenAi(
        {
            apiKey: process.env.AI_API_KEY,
            baseURL: process.env.AI_BASE_URL,
        }
    );
}
catch(err){
    console.log(`${currentFileName(__filename)}该模块出现错误，请检查您的apiKey等参数是否设置正确！`);
}

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
