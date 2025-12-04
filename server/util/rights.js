
const createRight = (target,rights)=>{
    rights.forEach((item,index)=>{
        switch (item.name) {
            case '商品管理':
                item.icon = 'Goods'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'商品列表',
                        path:'/goods',
                        rights:['delete','edit','add']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'商品上下架',
                        path:'/grounding',
                        rights:['up','down']
                    }
                ]
                break;
            case '视频管理':
                item.icon = 'Video'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'视频列表',
                        path:'/video',
                        rights:['delete','add']
                    }
                ]
                break;
            case '用户管理':
                item.icon = 'User'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'用户列表',
                        path:'/user',
                        rights:['delete']
                    }
                ]
                break;
            case '轮播管理':
                item.icon = 'Timer'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'轮播列表',
                        path:'/banner',
                        rights:['close','open']
                    }
                ]
                break;
            case '库存管理':
                item.icon = 'Unlock'
                item.children = [

                    {
                        id:index + new Date().getTime(),
                        children_name:'入库管理',
                        path:'/addStore',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'出库管理',
                        path:'/outStore',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'库存调拨',
                        path:'/transferStore',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'盘点管理',
                        path:'/inventory',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'库存预警',
                        path:'/warningStore',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'库存成本管理',
                        path:'/cost',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'库存监控',
                        path:'/monitor',
                        rights:['delete']
                    }
                ]
                break;
            case '秒杀管理':
                item.icon = 'Van'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'秒杀列表',
                        path:'/seckill',
                        rights:['delete']
                    }
                ]
                break;
            case '优惠管理':
                item.icon = 'Watch'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'优惠列表',
                        path:'/preferential',
                        rights:['delete','push','add','edit']
                    }
                ]
                break;
            case '订单管理':
                item.icon = 'Grape'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'订单列表',
                        path:'/order',
                        rights:['delete']
                    }
                ]
                break;
            case '数据统计':
                item.icon = 'TrendCharts'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'数据监控',
                        path:'/dataMonitor',
                        rights:['delete']
                    },
                    {
                        id:index + new Date().getTime(),
                        children_name:'数据可视化',
                        path:'/dataVisualization',
                        rights:[]
                    }
                ]
                break;
            case '系统设置':
                item.icon = 'Setting'
                item.children = [
                    {
                        id:index + new Date().getTime(),
                        children_name:'退出后台',
                        path:'/logout'

                    }
                ]
                break;
            default:
                return false
        }

        item.id = index
    })

    if (target.identity !== 9999){
        rights.forEach(item=>{
            item.children.forEach(i=>{
                i.rights = []
            })
        })
    }

    return rights
}

module.exports = {
    createRight
}
