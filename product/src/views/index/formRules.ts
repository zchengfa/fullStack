interface rulesInterface {
    description:[
        {
            required:boolean,
            message:string,
            trigger:string
        }
    ],
    imagePath:[
        {
            required:boolean,
            message:string,
            trigger:string
        }
    ],
}

export const formRules:rulesInterface = {
    description:[
        {
            required:true,
            message:'商品描述不能为空！',
            trigger:'blur'
        }
    ],
    imagePath:[
        {
            required:true,
            message:'图片链接不能为空！',
            trigger:'blur'
        }
    ],
}