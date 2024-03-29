
function timeFormatting (fm,time){
    //拓展Date的时间格式化函数
    Date.prototype.format = function (fmt){
        let formatObject = {
            "M+": this.getMonth() + 1,                   //月份
            "d+": this.getDate(),                        //日
            "h+": this.getHours(),                       //小时
            "m+": this.getMinutes(),                     //分
            "s+": this.getSeconds(),                     //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()                  //毫秒
        };

        //  获取年份
        // ①
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in formatObject) {
            // ②
            if (new RegExp("(" + k + ")", "i").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1, (RegExp.$1.length === 1) ? (formatObject[k]) : (("00" + formatObject[k]).substr(("" + formatObject[k]).length)));
            }
        }
        return fmt;
    }
    if (time){
        return time.format(fm)
    }
    else {
        return new Date().format(fm)
    }

}

/**
 * 获取间隔的天数
 * @param firstTime { Date } 时间
 * @param secondTime { Date } 时间
 * @return { number } 返回天数
 */
function getIntervalDays (firstTime,secondTime) {

    return Math.ceil((secondTime.getTime() - firstTime.getTime()) / (1000*60*60*24))
}


module.exports = {
    timeFormatting,
    getIntervalDays
}

