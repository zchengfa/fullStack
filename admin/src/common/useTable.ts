//利用CompositionApi实现类似vue2的mixins混入效果
import { reactive , watchEffect } from "vue";

//导出函数（接收一个每页多少条数据参数）
export default function (size:number) {
  let table = reactive({
    //请求得到的所有数据
     manageData:<any[]>[],
    //copy
     dataCopy:<any[]>[],
    //当前页面显示的数据
     tableData:<any[]>[],
     pageSize:<number>size,
     currentPageData:<any[]>[]
  })

  //实现element-plus分页组件的@current-change方法(@current-change="currentPageChange")
  const currentPageChange = (val:number)=>{
    if (val===1){
     table.currentPageData = sliceTableData(val-1,table.pageSize)
   }
   else {
    table.currentPageData = sliceTableData((val-1)*table.pageSize,((val-1)*table.pageSize)+table.pageSize)
   }
 }

  //提取对应部分的数据
  const sliceTableData = (start:number,end:number)=>{
    return table.tableData.slice(start,end)
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
    table.currentPageData = sliceTableData(0,table.pageSize)
  })

  return {
    table,
    currentPageChange,
    sliceTableData,
    search
  }
}

