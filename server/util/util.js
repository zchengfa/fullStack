const os = require('os');

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

module.exports = {
    getFileExtName,
    getLocalIP
}
