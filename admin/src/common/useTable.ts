//利用CompositionApi实现类似vue2的mixins混入效果
import { reactive , watchEffect } from "vue";

//导出函数（接收一个每页多少条数据参数）
export default function (size:number) {
  let table = reactive({
     data:<string[]>[],
     dataCopy:<string[]>[],
     tableData:<string[]>[],
     pageSize:<number>size
  })

  //实现element-plus分页组件的@current-change方法(@current-change="currentPageChange")
  const currentPageChange = (val:number)=>{
    if (val===1){
     table.tableData = sliceTableData(val-1,table.pageSize)
   }
   else {
    table.tableData = sliceTableData((val-1)*table.pageSize,((val-1)*table.pageSize)+table.pageSize)
   }
 }

  //提取对应部分的数据
  const sliceTableData = (start:number,end:number)=>{
    return table.data.slice(start,end)
  }

  //通过搜索框搜索商品
  const search = (parentArr:string[],showArr:string[],keyword:string,keyCode:number,confidentArr:string[])=>{
    let searchArr:any[] = parentArr
		let regExpArr:any[] = []
		let regExp:RegExp = new RegExp(keyword)
		if(keyCode === 13){
		  if(keyword.length !=0){
		    searchArr.map((item,index) => {
		      let expString = returnExpConfident()

          if(eval(expString)){
            regExpArr.push(searchArr[index])
          }
		    })
        showArr = regExpArr
		  }
		  else{
		    showArr = parentArr
		  }
		}
    return showArr
    
    //根据传入的检测对象数量来生成检测条件
    function returnExpConfident (){
      let Exp:string = ''
      let appendCount:number = 0
      confidentArr.map((c:string)=>{
        Exp += `regExp.test(item.${c}) || `
        appendCount++

        if(appendCount===confidentArr.length){
      
          Exp = Exp.substring(0,Exp.length - 3)

          return Exp
        }
  
      })

      return Exp
    }
    
  }

  //监听tableData的值
  watchEffect(()=>{
    table.tableData = sliceTableData(0,table.pageSize)
  })

  return {
    table,
    currentPageChange,
    sliceTableData,
    search
  }
}