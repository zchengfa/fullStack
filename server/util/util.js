const os = require('os');
const path = require('path');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address;
            }
        }
    }
    return '127.0.0.1'; // 如果没有找到，返回本地回环地址
}

const getFileExtName = (type) => {
    return '.' + type.slice(type.lastIndexOf('/') + 1, type.length);
}

const checkProcessEnvParam = ()=>{
    const env = ['ALIPAY_APP_ID','ALIPAY_SIGN_TYPE','ALIPAY_GATEWAY','ALIPAY_PUBLIC_KEY','ALIPAY_PRIVATE_KEY','JWT_PRIVATE_KEY','MAILER_HOST','MAILER_PORT','MAILER_USER','MAILER_PASS','AI_MODEL','AI_API_KEY','AI_BASE_URL','PORT'];
    const emptyEnv = [];
    env.forEach(e => {
        if(!process.env[e]){
            emptyEnv.push(e);
        }
    })

    if(emptyEnv.length){
        console.log(`${currentFileName()}您有未设置的env变量${emptyEnv}，请创建一个env文件来完善这些变量，否则可能会影响服务的开启`)
    }

    return !!emptyEnv.length;
}

const currentFileName = (target = __filename,state = false)=>{
    return `${state ? '✅' + ' ' : '❌' + ' '}From(${path.basename(target)})${state ? '提示' : '出错'}：`
}

module.exports = {
    getFileExtName,
    getLocalIP,
    checkProcessEnvParam,
    currentFileName
}
