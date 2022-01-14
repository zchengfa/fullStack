
const {readFile,writeFile} = require('fs')

let fileName = 'brand'

readFile(`./${fileName}.json`,'utf-8',(err,result)=>{
    if (err) throw err
    else{
        let data = JSON.parse(result)
       // console.log(data)
        let arr = []
        let id = 776465702744654
        data.map((item)=>{
            id++

            arr.push( {
                    brand:item.brand,
                    brand_logo:item.brand_logo,
                    brand_id :id
                }
            )
        })

        writeFile(`./${fileName}deal.json`,JSON.stringify(arr),(err,r)=>{
            if (err) throw err
            else{
                console.log(r)
            }
        })

    }
})