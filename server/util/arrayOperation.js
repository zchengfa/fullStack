//数组去重
function deDuplication(arr){
    let newArr = []
    arr.map(item=>{
        if (!newArr.includes(item)){
            newArr.push(item)
        }
    })

    return newArr
}

//获取某个元素在数组中存在的所有索引
function findAllIndex(arr,target){
    let resultArr = [],len = arr.length,position = 0
    while (position<len){
        position = arr.indexOf(target,position)
        if (position!==-1){
            resultArr.push(position)
            position++
        }
        else {
            break;
        }
    }
    return resultArr
}

//获取数组中某个对象的属性值在数组中所在所有对象元素索引
function findAllIndexByObjectValue(arr,objectProperty,objectValue){
    let resultArr = [],len = arr.length,position = 0
    while (position<len){
        if (arr[position].hasOwnProperty(objectProperty)){
            if (arr[position][objectProperty]===objectValue){
                resultArr.push(position)
            }
            position++
        }
        else {
            break;
        }
    }
    return resultArr
}
function sortArray(array,sortArg){
    let length = array.length
    let i,j,temp
    for (i = length -1;0<i;i--){
        for (j = 0;j<i;j++){
            if (array[j][sortArg]< array[j+1][sortArg]){
                temp = array[j]
                array[j] = array[j+1]
                array[j+1] = temp
            }
        }
    }
    return array
}

//获取访问者的ip
function getClientIp(req){
    let ip = req.socket.remoteAddress || req.ip

    ip = ip.replace('::ffff:','')

    return ip
}
module.exports = {
    deDuplication,
    findAllIndex,
    findAllIndexByObjectValue,
    sortArray,
    getClientIp
}