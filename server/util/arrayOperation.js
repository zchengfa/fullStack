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
module.exports = {
    deDuplication
}