export const URL:string = 'http:'+ '//' + window.location.host.toString().split(':')[0] + ':3000'


/**
 * @function getPropertyArray 用于获取数组或对象中需要的属性名，将属性名加入到新数组中并返回
 * @param _propertyArray 是一个用于存储属性名的数组
 * @param array 接收一个数组
 */
export function getPropertyArray (array:any){
    let _propertyArray:(keyof typeof array)[] = []
    for (const arrayKey in array) {
        _propertyArray.push(arrayKey)
    }
    return _propertyArray
}

export function searchContentByKeyword(keyCode:<number>13,target:<any[]>[],keyword:<string>'',regExpObj:<any>'',targetCopy:<any[]>[]){
	let searchArr:any[] = target
	let regExpArr:any[] = []
	let regExp:RegExp = new RegExp(keyword)
	if(keyCode){
		if(keyword.length !=0){
			searchArr.filter((item,index)=>{
				if(regExp.test(item.regExpObj)){
					regExpArr.push(searchArr[index])
				}
			})
			targetCopy = regExpArr
		}
		else{
			targetCopy = target
		}
	}
}