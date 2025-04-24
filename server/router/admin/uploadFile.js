const express = require("express");
const fs = require("fs");
const path = require("path");
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

        res.send({code:200})
    })

    //文件合并接口
    router.post('/mergeFile',(req,res)=>{
        const { hash, totalChunks } = req.body;
        const chunkDir = path.join(__dirname, 'chunks', hash);

        const writeStream = fs.createWriteStream(`./uploads/${hash}`);

        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(chunkDir, i.toString());
            writeStream.write(fs.readFileSync(chunkPath));
            fs.unlinkSync(chunkPath);
        }

        writeStream.end();

        res.send({ code: 200, url: `/uploads/${hash}` });
    })

    app.use('/admin', router)
}
