const express = require("express");
const fs = require("fs");
const path = require("path");
const {getFileExtName, getLocalIP, currentFileName} = require('../../util/util');
const {timeFormatting} = require("../../util/timeFormatting");
const SupabaseAdmin = require('../../plugins/supabase')

module.exports = function (app,port,prisma) {
    const router = express.Router()
    //使用multer中间件来解析formData
    const multer = require("multer");
    let storage,upload,supabaseStorage;
    if(process.env.NODE_ENV === 'development'){
        //设置文件存储位置，否则req.file.path会为undefined
        storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, 'temp_uploads/'), // 指定存储目录
            filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
        });
        upload = multer({ storage });
    }
    else{
        //使用内存存储，适配（vercel环境）
        upload = multer({storage: multer.memoryStorage()})
        supabaseStorage = new SupabaseAdmin()
    }

    //文件上传接口
    router.post('/upload', upload.single('chunk'), async (req, res) => {
        const { hash, index, mimetype } = req.body;

        // 基础校验
        if (!hash || index === undefined) {
            return res.status(400).send({ code: 400, error: '缺少必要参数: hash 或 index' });
        }
        if (!req.file) {
            return res.status(400).send({ code: 400, error: '未接收到文件分片' });
        }

        const chunkDir = path.join(__dirname, 'chunks', hash);
        const chunkPath = path.join(chunkDir, index);
        const chunkPathInSupabase = `chunks/${hash}/${index}`;
        if(process.env.NODE_ENV === 'production'){
            try{
                //上传到分片存储bucket
                const {data,error} = await supabaseStorage.upload({
                    filePath: chunkPathInSupabase,
                    fileBuffer: req.file.buffer,
                    fileMimetype: mimetype
                })
                if(error){
                    return res.status(500).send({error: '分片上传失败' + error.message})
                }

                res.send({ code: 200,chunkIndex:index, message: `分片 ${index} 上传至supabase storage成功`,fileHash:hash });
            }
            catch(err){
                console.log(`${currentFileName(__filename)}分片上传失败` + err);
                res.status(500).send({
                    error:'服务器错误，分片上传失败'
                })
            }
        }
        if(process.env.NODE_ENV === 'development'){
            try {
                // 使用异步递归创建目录，如果目录已存在也不会报错
                await fs.promises.mkdir(chunkDir, { recursive: true });

                // 移动文件
                await fs.promises.rename(req.file.path, chunkPath)
                res.send({ code: 200,chunkIndex:index, message: `分片 ${index} 上传成功`,fileHash:hash });
            } catch (error) {
                console.error(`${currentFileName(__filename)}接收分片失败 (文件: ${hash}, 分片: ${index}):`, error);

                // 尝试清理可能不完整的临时文件
                try {
                    await fs.promises.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error(`${currentFileName(__filename)}清理临时文件失败:`, unlinkError);
                }

                res.status(500).send({
                    code: 500,
                    error: '服务器接收文件分片失败',
                    file: { hash, index }
                });
            }
        }
    });

    // 文件合并接口
    router.post('/mergeFile', async (req, res) => {
        const { hash, totalChunks, file_info } = req.body;
        const chunkDir = path.join(__dirname, 'chunks', hash);
        const file_ext_name = getFileExtName(file_info.type); // 请确保此函数已安全定义
        const file_save_path = path.join('./uploads', `${hash}${file_ext_name}`);

        // 验证必要参数
        if (!hash || totalChunks === undefined) {
            return res.status(200).send({ code: 400, error: '缺少必要参数: hash 或 totalChunks' });
        }

        if(process.env.NODE_NEV === 'production'){
            try{
                const chunkPathInSupabase = `chunks/${hash}`;
                const {data,error} = await supabaseStorage.listChunks(chunkPathInSupabase)
                if(error){
                    return res.status(200).send({code:500,error:'获取分片失败'})
                }
                //分片排序
                const sortedChunks = data.sort((a,b)=>{
                    return Number(a.name) - Number(b.name)
                })
                const blobArr = []
                //分片组合
                for (const chunk of sortedChunks) {
                    const {data,error} = await supabaseStorage.downloadChunk(chunkPathInSupabase + '/' + chunk.name)
                    if(data){
                        blobArr.push(data)
                    }
                }
                const mergedBlob = new Blob(blobArr)
                // 设置正确的文件扩展名
                const fileType = file_info.type.split('/')[0];
                const finalFileName = hash+getFileExtName(file_info.type);
                //将合并后的文件再次上传到supabase storage的另一个bucket（用于用户访问的公开bucket）
                const mergeResult = await supabaseStorage.upload({
                    fileName: finalFileName,
                    fileMimetype: file_info.type,
                    fileBuffer: mergedBlob,
                    isChunk: false
                })
                if(!mergeResult.error){
                    const {data,error} = await supabaseStorage.publicUrl(finalFileName)
                    //将文件信息存储到postgresql
                    if(!error){
                        return res.status(200).send({code:200,url: file_save_path, message: '文件合并成功' })
                    }
                    res.status(200).send({ code: 500, error: `服务器文件合并失败: ${error.message}` })
                }
            }
            catch (error) {
                console.log(`${currentFileName(__filename)}服务器文件合并失败: ${error.message}`)
                res.status(200).send({ code: 500, error: `服务器文件合并失败: ${error.message}` });
            }
        }

        if(process.env.NODE_ENV === 'development'){
            try {
                // 1. 检查分片目录是否存在
                try {
                    await fs.promises.access(chunkDir);
                } catch (error) {
                    return res.status(200).send({ code: 404, error: `未找到哈希值为 ${hash} 的分片目录` });
                }

                // 2. 创建可写流（最终文件）
                const writeStream = fs.createWriteStream(file_save_path);

                // 3. 串行合并：按顺序将每个分片流导入最终文件
                for (let i = 0; i < totalChunks; i++) {
                    const chunkPath = path.join(chunkDir, i.toString());

                    try {
                        await fs.promises.access(chunkPath); // 检查分片是否存在
                    } catch (error) {
                        writeStream.destroy(); // 关闭文件流
                        await fs.promises.unlink(file_save_path) // 尝试删除可能不完整的最终文件
                        return res.status(200).send({ code: 400, error: `分片 ${i} 不存在` });
                    }

                    // 核心操作：创建一个分片的可读流，并通过管道导入到可写流中
                    const readStream = fs.createReadStream(chunkPath);

                    // 使用promise包装，以便等待当前分片写入完成
                    await new Promise((resolve, reject) => {
                        readStream.pipe(writeStream, { end: false }); // `end: false` 确保写完当前分片后不自动关闭最终文件流
                        readStream.on('end', resolve); // 当前分片读取完毕
                        readStream.on('error', reject); // 当前分片读取错误
                    });

                    // 可选：立即删除已合并的分片，及时释放空间
                    await fs.promises.unlink(chunkPath)
                }

                // 4. 所有分片合并完成，安全关闭写入流
                writeStream.end();
                await new Promise((resolve) => writeStream.on('close', resolve));

                // 5. 删除空的分片目录
                await fs.promises.rmdir(chunkDir);

                // 6. 返回成功响应
                res.send({ code: 200, url: file_save_path, message: '文件合并成功' });

            } catch (error) {
                console.error(`${currentFileName(__filename)}文件合并失败 (${hash}):`, error);

                // 7. 精细化的错误处理与响应
                if (error.code === 'ENOENT') {
                    res.status(200).send({ code: 404, error: '合并过程中文件或目录不存在' });
                } else {
                    res.status(200).send({ code: 500, error: `服务器文件合并失败: ${error.message}` });
                }
            }
        }
    });
    router.post('/checkFile', async (req, res) => {
        const { hashArray, file_title } = req.body

        try {
            if(process.env.NODE_ENV === 'production'){
                // 1. 参数验证
                if (!hashArray || !Array.isArray(hashArray) || hashArray.length === 0) {
                    return res.status(200).send({ code: 400, error: '缺少有效的文件哈希数组' })
                }

                if (!file_title) {
                    return res.status(200).send({ code: 400, error: '缺少文件标题' })
                }

                const results = await Promise.all(
                    hashArray.map(async (item) => {
                        const {data,error} = await supabaseStorage.publicUrl(item.file)
                        if(!error){
                            return {
                                ...item,
                                isExist: true,
                                url: data.publicUrl
                            }
                        }
                        return {
                            ...item,
                            isExist: false,
                            url: ''
                        }
                    })
                )
                let existCount = 0
                const prismaData = {}
                results.map((item)=>{
                    prismaData.uid = item.uid
                    prismaData.title = file_title
                    prismaData.name = item.name
                    item.type === 'image' ? prismaData.image_url = item.url : prismaData.video_url = item.url
                    return item.isExist ? existCount ++ : null
                })

                const existFile = await prisma.mall_video.findUnique({
                    where:{
                        uid: prismaData.uid
                    }
                })

                if(existFile){
                    return res.status(200).send({code: 409,message:'您已上传过该文件'})
                }
                const saveFile = await prisma.mall_video.upsert({
                    where:{
                        uid: prismaData.uid
                    },
                    create:{
                        ...prismaData
                    },
                    update:{
                        image_url: prismaData.image_url,
                        video_url: prismaData.video_url
                    }
                })
                res.send({
                    code: 200,
                    file: saveFile,
                    message: '文件保存完成'
                })
            }

            if(process.env.NODE_ENV === 'development'){
                //2. 并行检查所有文件是否存在（使用异步非阻塞方式）
                const fileCheckResults = await Promise.all(
                    hashArray.map(async (item) => {
                        const file_path = `./uploads/${item.file}`

                        try {
                            await fs.promises.access(file_path)
                            return {
                                exists: true,
                                data: {
                                    ...item,
                                    type_url: `${item.type}_url`,
                                    url: `${req.protocol}://${getLocalIP()}:${port}/${item.file}`
                                }
                            }
                        } catch (error) {
                            console.log(`${currentFileName(__filename)}${item.name} 文件不存在: ${error.message}`)
                            return {
                                exists: false,
                                data: item
                            }
                        }
                    })
                )

                    // 3. 分离存在和不存在的文件
                    const existingFiles = fileCheckResults.filter(result => result.exists).map(result => result.data)
                    const missingFiles = fileCheckResults.filter(result => !result.exists).map(result => result.data)

                    // 4. 如果有文件不存在，立即返回错误
                    if (missingFiles.length > 0) {
                        return res.status(200).send({
                            code: 404,
                            error: '部分文件不存在',
                            missingFiles: missingFiles.map(f => f.name),
                            existingFiles: existingFiles.map(f => f.name)
                        })
                    }

                    // 5. 所有文件都存在，准备数据库数据
                    const upload_time = timeFormatting('yyyy-MM-dd hh:mm:ss')

                    //假设 hashArray 中包含视频和图片文件，根据 type 区分
                    const videoFile = existingFiles.find(f => f.type === 'video')
                    const imageFile = existingFiles.find(f => f.type === 'image')

                    if (!videoFile) {
                        return res.status(200).send({ code: 400, error: '未找到视频文件' })
                    }

                    // 6. 使用 Prisma 进行数据库操作
                    try {
                        const savedFile = await prisma.mall_video.create({
                            data: {
                                uid: videoFile.uid,
                                video_url: videoFile.url,
                                image_url: imageFile?.url || null, // 图片可选
                                title: file_title,
                                name: videoFile.name,
                                upload_time: upload_time,
                                last_modified: videoFile.last_modified
                            },
                            select: {
                                uid: true,
                                video_url: true,
                                image_url: true,
                                title: true,
                                name: true,
                                upload_time: true,
                                last_modified: true
                            }
                        })

                        //序列化BigInt数据
                        savedFile.uid = savedFile.uid.toString()
                        savedFile.last_modified = savedFile.last_modified.toString()
                        // 7. 返回成功响应
                        res.send({
                            code: 200,
                            message: '文件检查完成，信息已保存到数据库',
                            file: savedFile,
                            stats: {
                                totalFiles: hashArray.length,
                                existingFiles: existingFiles.length,
                                missingFiles: missingFiles.length
                            }
                        })

                    } catch (dbError) {
                        console.error(`${currentFileName(__filename)}数据库保存失败:`, dbError)

                        // 处理 Prisma 特有错误
                        if (dbError.code === 'P2002') {
                            return res.status(200).send({
                                code: 409,
                                error: '记录已存在（唯一约束冲突）'
                            })
                        }

                        res.status(200).send({
                            code: 500,
                            error: '数据库保存失败',
                            details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
                        })
                    }
            }

        } catch (error) {
            console.error(`${currentFileName(__filename)}服务器错误:`, error)
            res.status(200).send({
                code: 500,
                error: '服务器内部错误',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    })

    router.get('/getVideos',async (req,res)=> {
        //获取视频数据
        const {index, limit} = req.query;
        const page = (index * 1) + 1
        const pageSize = limit * 1
        try{
            const [videos, totalCount] = await Promise.all([
                prisma.mall_video.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: {
                        last_modified: 'desc'
                    }
                }),
                prisma.mall_video.count()
            ])

            //序列化BigInt类型数据
            videos.map((item)=>{
               item.uid = item.uid.toString()
               item.last_modified = item.last_modified.toString()
            })

            const totalPages = Math.ceil(totalCount / pageSize);
            // 返回给前端的数据结构示例
            const result = {
                videos,
                pagination: {
                    currentPage: page,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                    total: totalCount
                }
            }
            res.status(200).send(result)
        }
        catch (e) {
            console.log(currentFileName(__filename)+ e)
            res.status(500).send({errMessage:'服务器出现错误'})
        }
    })

    //删除视频
    router.delete('/deleteFile/:uid/:file_video_name/:file_image_name', async (req, res) => {
        const { uid, file_video_name, file_image_name } = req.params

        // 安全验证：防止路径遍历攻击
        if (file_video_name.includes('..') || file_image_name.includes('..')) {
            return res.status(400).send({
                code: 400,
                error: '文件名包含非法字符'
            })
        }

        const videoPath = path.join('./uploads', file_video_name)
        const imagePath = path.join('./uploads', file_image_name)

        try {
            // 1. 先验证文件是否存在
            try {
                await fs.promises.access(videoPath)
                if (file_image_name) {
                    await fs.promises.access(imagePath)
                }
            } catch (error) {
                return res.status(404).send({
                    code: 404,
                    error: '一个或多个文件不存在',
                    missingFiles: {
                        video: !fs.existsSync(videoPath),
                        image: file_image_name ? !fs.existsSync(imagePath) : false
                    }
                })
            }

            // 2. 使用 Prisma 删除数据库记录
            const deletedRecord = await prisma.mall_video.delete({
                where: {
                    uid: uid
                },
                select: {
                    uid: true,
                    video_url: true,
                    image_url: true
                }
            })

            // 3. 异步删除文件（不阻塞响应）
            const deletePromises = []

            deletePromises.push(fs.promises.unlink(videoPath).catch(e =>{
                return {
                    value:"video",
                    message:e
                }
            }))

            if (file_image_name) {
                deletePromises.push(fs.promises.unlink(imagePath).catch(e =>{
                    return {
                        value:"image",
                        message:e
                    }
                }))
            }

            const deleteResults = await Promise.allSettled(deletePromises)

            // 4. 检查文件删除结果
            const failedDeletes = deleteResults
                .filter(result => result.status === 'rejected' || result?.value?.error)
                .map(result => result?.reason || result?.value)

            if (failedDeletes.length > 0) {
                console.error(`${currentFileName(__filename)}部分文件删除失败:`, failedDeletes)
                // 记录到日志系统，便于后续人工处理
            }

            // 5. 返回成功响应
            res.send({
                code: 200,
                message: '视频删除成功',
                details: {
                    database: { deleted: true },
                    files: {
                        video: { deleted: !await failedDeletes.some(f => f.file === 'video') },
                        image: { deleted: !await failedDeletes.some(f => f.file === 'image') }
                    },
                    warnings: failedDeletes.length > 0 ?
                        `部分文件删除失败，请联系管理员处理: ${failedDeletes.map(f => f.file).join(', ')}` :
                        null
                }
            })

        } catch (error) {
            console.error(`${currentFileName(__filename)}删除视频失败:`, error)

            // Prisma 特定错误处理
            if (error.code === 'P2025') {
                return res.status(404).send({
                    code: 404,
                    error: '未找到对应的视频记录'
                })
            }

            if (error.code === 'P2003') {
                return res.status(409).send({
                    code: 409,
                    error: '存在关联记录，无法删除'
                })
            }

            res.status(500).send({
                code: 500,
                error: '服务器错误，视频删除失败',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    })
    app.use('/admin', router)
}
