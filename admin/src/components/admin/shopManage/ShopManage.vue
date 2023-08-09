 <template>
   <div class="select-group">
     <el-button class="add-btn" type="primary" size="small" @click="addProduct" v-permission="{permission:'add',effect:'disabled'}"><el-icon class="add-pro"><CirclePlus></CirclePlus></el-icon>添加商品</el-button>
     <div class="category-selector-box select-item">
       <span>分类选择：</span>
       <el-select v-model="addProductLogic.categoryCheckOption" placeholder="全部" class="select">
         <el-option v-for="item in addProductLogic.selectCategoryOptions" :key="item" @click="showGoodsByCategoryOrBrand(item,'type')" :value="item" :label="item"></el-option>
       </el-select>
     </div>
     <div class="brand-selector-box category-selector-box select-item">
       <span>品牌选择：</span>
       <el-select v-model="addProductLogic.brandCheckOption" placeholder="全部" class="select">
         <el-option v-for="item in addProductLogic.selectBrandOptions" :key="item" @click="showGoodsByCategoryOrBrand(item,'brand')" :value="item" :label="item"></el-option>
       </el-select>
     </div>
     <div class="search-box select-item">
       <span>搜索：</span>
       <el-input size="small" class="search-input" v-model="addProductLogic.searchKeyword" @keyup="searchProduct($event)" placeholder="输入商品ID/分类/商品名称" suffix-icon="el-icon-search"></el-input>
     </div>
     <div class="export-data select-item">
       <el-button type="success" size="small" @click="tableToExcel(table.tableData)">导出数据为Excel</el-button>
     </div>
   </div>
  <el-table class="mall-table" :data="table.currentPageData" max-height="450"  @selection-change="selection" border empty-text="商品数据为空">
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="id" label="商品ID">
      <template #default="scope">
        <span class="product-id">{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="商品描述" align="center">
      <template #default="scope">
        <span class="title">{{scope.row.title}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="imagePath" label="商品图片" align="center">
      <template #default="scope">
        <el-image class="table-image" :src="scope.row.imagePath" alt="productImage"></el-image>
      </template>
    </el-table-column>
<!--    <el-table-column prop="count" label="库存" align="center">-->
<!--      <template #default="scope">-->
<!--        <el-button v-if="scope.row.count.length <=2 && scope.row.count.toString().indexOf('0')===-1" type="danger" size="small" round>库存不足</el-button>-->
<!--        <el-button v-else-if="scope.row.count.length <=2 && scope.row.count.toString().indexOf('0')!==-1" type="info" size="small" round>已售罄</el-button>-->
<!--        <span v-else>{{scope.row.count}}</span>-->
<!--      </template>-->
<!--    </el-table-column>-->
    <el-table-column prop="price" label="价格" align="center">
      <template #default="scope">
        <span class="price"><span class="character" >￥</span>{{scope.row.price}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center">
      <template #default="scope">
        <div class="operation-btn">
          <el-button type="primary" class="edit-btn" size="small" @click.prevent="editProduct(scope.$index,table.currentPageData)" plain v-permission="{permission:'edit',effect:'disabled'}">编辑</el-button>
          <el-button type="danger" class="delete-btn" size="small" @click.prevent="deletePro(scope.$index,table.currentPageData)" plain v-permission="{permission:'delete',effect:'disabled'}">删除</el-button>
        </div>
      </template>
    </el-table-column>
    <!--    <el-table-column v-for="(header,headerIndex) in tableHeader" :key="header"-->
    <!--                     :prop="returnTableProp(headerIndex,tableData)"-->
    <!--                     :label="header"-->
    <!--                     align="center"-->
    <!--    >-->
    <!--    </el-table-column>-->
  </el-table>
  <pagination :total="table.tableData.length" @currentPageChange="currentPageChange"></pagination>

  <edit-product v-show="editProductLogic.isShow" :current-product-data="editProductLogic.currentProductData"
		@cancel-edit='cancelEdit'
	 @save-edit="saveEdit"></edit-product>
   <add-product ref="ruleForm" v-show="addProductLogic.isShowAddProduct"
                @cancel-add-click="cancelAddClick"
                @confirm-add-click="confirmAddClick"
   ></add-product>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, reactive} from "vue";
import {deleteProduct, alterProduct, getShopManageData, addProduct} from "../../../network/request";
import EditProduct from './EditProduct.vue'
import useTable from "../../../common/useTable";
import { tableToExcel } from "../../../common/utils";
import Pagination from "../../common/Pagination.vue";
import { shopStore } from "../../../pinia/pinia";
import AddProduct from "./AddProduct.vue";
import {ElMessageBox} from "element-plus";
import {CirclePlus} from "@element-plus/icons-vue";

export default defineComponent({
  name: "ShopManage",

  components:{
      CirclePlus,
    AddProduct,
    Pagination,
    EditProduct
  },
  setup(){

    const {table,currentPageChange,search} = useTable(7)

    let addProductLogic = reactive({
      isShowAddProduct:<boolean>false,
      selectCategoryOptions:<string[]>[],
      selectBrandOptions:<string[]>[],
      categoryCheckOption:<string>'',
      brandCheckOption:<string>'',
      searchKeyword:<string>''
    })

    function addProduct(){
      addProductLogic.isShowAddProduct = true
    }

    //点击具体分类或具体品牌名来展示对应的商品
    function showGoodsByCategoryOrBrand(item:string,regType:string){

      let operationArr:string[] = [],regExpArr:string[] = []
      operationArr.push(...table.manageData)

      let regExp:RegExp = new RegExp(item)
      regType==='brand'?addProductLogic.categoryCheckOption='':addProductLogic.brandCheckOption=''
      operationArr.map((items:any)=>{
        if (regExp.test(items['brand']) || regExp.test(items['type'])){
          regExpArr.push(items)
        }
      })
      table.tableData = regExpArr
    }


    /**
     *@function searchProduct 该方法用于管理员搜索想搜索的商品，通过绑定keyUp键盘事件来获取管理员按下的键来判断何时执行搜索方法
     * @let searchArr 获取从后台得到的商品数据
     * @let regExp 正则规则（new RegExp(addProductLogic.searchKeyword)将管理员输入的内容作为正则规则）
     * @let regExpArr 用于存储正则规则匹配到的商品数据
     */
    function searchProduct(e:any){
      if(e.keyCode===13){
        let arr = search(table.manageData,table.tableData,addProductLogic.searchKeyword,e.keyCode,['id','title'])
        table.tableData = arr

      }

    }

    /**
     * @function editProduct该方法控制这当前所选商品是否编辑
     * @param index 当前行的索引
     * @param rows 当前行的商品数据
     */
   let editProductLogic = reactive({
      isShow:<boolean>false,
      currentProductData:<string[]>[]
    })

    function editProduct(index:number,rows:any[]){

      editProductLogic.isShow = true
      //先清空之前编辑的商品项
      editProductLogic.currentProductData = []
      editProductLogic.currentProductData.push( rows[index])

    }
		
		function cancelEdit(){
			 editProductLogic.isShow = false
		}

    function saveEdit(data:any){
			//console.log(data)
			let submitDataCopy =data.alterData
      let submitData = data.submitData
      let emptySubmitCount = data.emptySubmitCount

      //判断用户为修改的数据数量是否跟可修改的数据数量（4）一致，若一致，说明用户未修改任何数据，
      //直接关闭编辑组件不对后台发起的修改请求，若小于可修改数（4），说明用户修改了数据，对后台发起修改请求，并关闭编辑组件
      if (emptySubmitCount < 4){
         alterProduct(data.id,submitData).then(res =>{
           if (res.data.success){
             //编辑数据成功，重新进入当前页面，刷新数据
							//setTimeout(()=>{
							//  location.reload()
						 // },1000)
						 //接收到后台编辑商品成功的反馈后，将修改后的数据修改到当前列表显示的数据中，做到不刷新页面而刷新数据的效果
						 table.currentPageData.filter(item =>{
							 if(item.id === data.id){
								 item.title = submitDataCopy.title
								 item.imagePath = submitDataCopy.imagePath
								 item.price =submitDataCopy.price
								 item.count = submitDataCopy.count + '件'

							 }
						 })
						 alert(res.data.success)
             editProductLogic.isShow = false
           }}).catch(err =>{
           	  console.log(err)
           	})
      }
      //未修改数与可修改数一致，不提交修改请求直接关闭组件
     else {
        editProductLogic.isShow = false
      }
    
    }
    /**
     * @function deleteProduct该方法控制这当前所选商品是否删除
     * @param index 当前行的索引
     * @param rows 商品数据
     * 点击对应行中的删除按钮即可删除该行的商品数据
     */
    function deletePro(index:number,rows:any[]){
      //rows.splice(index,1)
      deleteProduct(rows[index].id).then(result =>{
        //接收到后台删除商品的反馈，删除数组中的对应数据，并提示用户删除成功
        if (result.data.success){
          rows.splice(index,1)
          alert(result.data.success)
        }
        else if(result.data.failed){
          alert(result.data.failed)
        }

      }).catch(err =>{
        console.log(err)
      })
    }

    function selection(val:any){
      console.log(val)
    }


    let { saveShopData } = shopStore()
    /**
     * 获取商品管理数据
     *@function getShopManageData 获取商品管理数据
     */
    function getSMData (){
      getShopManageData().then(result =>{

        result.data.filter((item:any) =>{
          table.manageData.push({
            id:<string>item.product_id,
            title:<string>item.product_title,
            imagePath:<string>item.product_image,
            count:<string>item.stocks +'件',
            price:<string>item.price,
            brand:<string>item.product_brand,
            type:<string>item.product_type
          });

          //将获取道德商品数据提交给pinia管理
          saveShopData(<any[]>result.data)
        })

        //获取商品中的品牌跟类型、活动
        result.data.map((item:any)=>{
          if (addProductLogic.selectBrandOptions.indexOf(item['product_brand'])===-1){
            addProductLogic.selectBrandOptions.push(item['product_brand'])
          }
          if (addProductLogic.selectCategoryOptions.indexOf(item['product_type'])===-1){
            addProductLogic.selectCategoryOptions.push(item['product_type'])
          }

        })
        table.tableData = table.manageData


      })
          .catch(err =>{
            throw err
          })
    }


    onBeforeMount(()=>{
      getSMData()
    })

    return {
      editProduct,
      editProductLogic,
			cancelEdit,
      saveEdit,
      deletePro,
      selection,
      currentPageChange,
      addProductLogic,
      addProduct,
      showGoodsByCategoryOrBrand,
      searchProduct,
      tableToExcel,
      table
    }

  },
  methods:{
    //实现子组件发出的cancelAddClick方法
    cancelAddClick(){
      //关闭添加商品组件
      this.addProductLogic.isShowAddProduct = false
    },
    //实现子组件发出的confirmAddClick方法
    confirmAddClick(ruleForm:any){
      //点击确认添加商品按钮，将商品数据提交给后台保存并接收后台返回的处理结果，若后台返回结果为成功则立即关闭当前组件，反之则将错误反馈给用户
      addProduct(ruleForm).then(result => {
        //根据后台反馈判断商品是否添加成功，若成功则将数据push进tableData中进行数据更新显示
        if (result.data.success){
          this.table.tableData.push({
            id:<string>result.data.product_id,
            title:<string>ruleForm.description,
            imagePath:<string>ruleForm.imageLink,
            count:<string>ruleForm.productCount +'件',
            price:<string>'￥'+ruleForm.price
          })

          //接收到后台添加商品数据成功的反馈，关闭添加商品组件
          this.addProductLogic.isShowAddProduct = false
        }

      }).catch(err => {
        console.log(err)
      })
    }
  }
})
</script>

<style scoped>
.mall-table{
  margin-top:1rem;
  width: 100%;
  height: 70vh;
}
.add-pro{
    position: relative;
    top: 2px;
    padding-right: .2rem;
    font-size: 12px;
}
.product-id{
  color: #1e8efc;
}
.add-btn{
    margin-top: 20px;
    margin-right: 20px;
}
.select-item{
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-right: 20px;
    margin-top: 20px;
    font-size: 14px;
}
.select-item span{
    white-space: nowrap;
}
.title{
  display: block;
  min-width: 200px;
  color: #d91868;
}
.price{
  color: #ff4d00;
}
.table-image{
  padding: .2rem;
  width: 10%;
  min-width: 42px;
  border: 1px solid #bdb6b6;
}
.operation-btn{
  min-width: 200px;
}
.edit-btn,.delete-btn{
  color: #fff;
}
.edit-btn{
  background-color: #1e8efc;
}
.delete-btn{
  background-color: #f00;
}
.pagination{
  margin: 1rem auto;
  height: 3rem;
  width: 60%;
}
.price .character{
  font-size: 12px;
}
.select-group{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  flex-wrap: wrap;
  width: 94%;
  min-width: 1000px;
  padding: 0 20px 20px 20px;
  border: 1px solid #dedada;
}


</style>