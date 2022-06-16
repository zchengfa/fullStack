export function debounce(func, delay){
    //防抖函数，用于处理频繁处理的事件
    let timer = null
    return function (...args){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            func.apply(this, args)
        }, delay)
    }
}

export const URL = 'http:'+ '//' + window.location.host.toString().split(':')[0] + ':3000'

//获取server文件夹中的时间格式化函数
const {timeFormatting} = require('../../../server/util/timeFormatting')

export function formatTime(fm,time){
    return timeFormatting(fm,time)
}

//给定数组与数组中对象的某个属性，进行属性值比对，对象中属性值大于后一个对象的属性值，则将对象进行调换
export function bubbleSort(array,sortArg){
    let length = array.length
    let i,j,temp
    for (i = length -1;0<i;i--){
        for (j = 0;j<i;j++){
            if (array[j][sortArg]> array[j+1][sortArg]){
                temp = array[j]
                array[j] = array[j+1]
                array[j+1] = temp
            }
        }
    }

    return array
}

//反转数组
export function reverseArray(array){
    let newArr = []
    for (let i = array.length -1; i>=0;i--){
        newArr.push(array[i])
    }
    return newArr
}

//手机号带星处理
export function dealPhoneByStars(phone){
    return phone.replace(/(\d{3})\d*(\d{4})/,'$1*****$2')
}