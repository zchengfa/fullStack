const express = require("express");
const fs = require("fs");
const path = require("path");
const {getFileExtName} = require('../../util/util')

module.exports = function (app) {
    const router = express.Router()
    //使用multer中间件来解析formData
    const multer = require("multer");
    //设置文件存储位置，否则req.file.path会为undefined
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'temp_uploads/'), // 指定存储目录
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    });
    const upload = multer({ storage });

    //文件上传接口
    router.post('/upload',upload.single('chunk'),(req, res)=>{
        const {hash,index} = req.body;

        //执行这一步前需要在当前文件目录下创建chunks文件夹
        const chunkDir = path.join(__dirname,'chunks',hash);

        if(!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);

        fs.renameSync(req.file.path,path.join(chunkDir,index));
        try{
           fs.readdirSync(chunkDir)
           res.send({code:200})
        }
        catch (e) {
            res.send({code:500,error: e});
        }
    })

    //文件合并接口
    router.post('/mergeFile',(req,res)=>{
        const { hash, totalChunks,file_info } = req.body;
        const chunkDir = path.join(__dirname, 'chunks', hash);
        //文件后缀名
        let file_ext_name = getFileExtName(file_info.type)
        //文件的最终存储路径
        const file_save_path = `./uploads/${hash}${file_ext_name}`

        try {
            //创建文件写入流
            const writeStream = fs.createWriteStream(file_save_path);
            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = path.join(chunkDir, i.toString());
                writeStream.write(fs.readFileSync(chunkPath));
                //写入后删除分片文件
                fs.unlinkSync(chunkPath);
            }
            //写入完成，关闭写入流
            writeStream.end();
            //

            res.send({ code: 200, url: file_save_path });
        }
        catch (e) {
            res.send({code:500,error: e});
        }
    })

    app.use('/admin', router)
}
