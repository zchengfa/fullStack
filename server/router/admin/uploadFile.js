const express = require("express");
const fs = require("fs");
const path = require("path");
const {getFileExtName, getLocalIP} = require('../../util/util');
const mysql_query = require('../../plugins/mysql_query')
const {timeFormatting} = require("../../util/timeFormatting");
const {Promise} = require("mongoose");
const connection = require('../../plugins/connectMysql')()

module.exports = function (app,port) {
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

        try{
            fs.renameSync(req.file.path,path.join(chunkDir,index));
            res.send({code:200})
        }
        catch (e) {
            //分片接收失败、需告诉前端那个文件的哪个分片接受失败、让前端重试上传对应分片
            res.send({code:500,error: '服务器接收文件分片失败',file:{hash,index}});
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

            //删除对应文件夹
            fs.rmdirSync(chunkDir);

            res.send({ code: 200, url: file_save_path });
        }
        catch (e) {
            //需优化、合并失败
            res.send({code:500,error: e});
        }
    })

    router.post('/checkFile',(req,res)=>{
        const { hashArray,file_title} = req.body;
        let existsFileNum = 0
        const data = {
            title:file_title
        }
        hashArray.forEach((item)=>{
            const file_path = `./uploads/${item.file}`;
            try {
                fs.existsSync(file_path);
                existsFileNum ++;
                const type = item.type + '_url';
                //生成文件地址http://ip:port/****
                data[type] = `${req.protocol}://${getLocalIP()}:${port}/${item.file}`;
                data.name = item.name;
                data.last_modified = item.lastModified;
                data.uid = item.uid;
            }
            catch (e){
                console.log(item.name+'文件不存在');
            }
            //文件都存在，可以将视频信息存储到数据库了
            if (existsFileNum === hashArray.length) {
                const upload_time = timeFormatting('yyyy-MM-dd hh:mm:ss');
                data.upload_time = upload_time;

                const saveFileInfo = mysql_query.insert('mall_video',
                    'uid,video_url,image_url,title,name,upload_time,last_modified',
                    `${data.uid},"${data.video_url}","${data.image_url}","${data.title}","${data.name}","${upload_time}",${data.last_modified}`,
                    )
                connection.query(saveFileInfo,(err,result)=>{
                    if (err){
                        console.log('文件信息保存失败：'+err)
                        res.send({code:500,error:'文件信息保存失败'})
                    }
                    else{
                        res.send({code:200,file:data})
                    }
                })

            }
        })
    })

    router.get('/getVideos',(req,res)=>{
        //获取视频数据
        const {index,limit} = req.query;
        const selectVideo = mysql_query.selectAll('mall_video')
        connection.query(selectVideo,(err,result)=>{
            if (err) {
                res.send({code:500,error:'获取视频数据失败'});
            }
            else {
                res.send({code:200,videos:result.slice(index,limit)})
            }
        })
    })

    //删除视频
    router.delete('/deleteFile/:uid/:file_video_name/:file_image_name',(req,res)=>{
        const {uid,file_video_name,file_image_name} = req.params;
        try{
            const deleteFileFromDatabase = mysql_query.deleteOperation('mall_video',`uid=${uid}`)
            connection.query(deleteFileFromDatabase,()=>{
                try{
                    fs.unlinkSync('./uploads/'+file_video_name);
                    fs.unlinkSync('./uploads/'+file_image_name);
                    res.send({code:200,message:'视频删除成功'});
                }
                catch(err){
                    res.send({code: 500 ,error: '服务器错误，视频删除失败'});
                }
            })
        }
        catch(err){
            console.log(err)
            res.send({code: 500 ,error: '服务器错误，视频删除失败'});
        }
    })



    app.use('/admin', router)
}
