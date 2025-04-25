const getFileExtName = (type) => {
    return '.' + type.slice(type.lastIndexOf('/') + 1, type.length);
}

module.exports = {
    getFileExtName
}
