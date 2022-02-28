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

export function formatTime(fm){
    return timeFormatting(fm)
}