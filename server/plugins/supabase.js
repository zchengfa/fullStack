const {createClient} = require('@supabase/supabase-js')
module.exports = class SupabaseAdmin {
    constructor(){
        this.supabaseAdmin = createClient(process.env.SUPABASE_BASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)
    }
    upload = ({filePath,fileName,fileBuffer,fileMimetype,isChunk = true})=>{
        return this.supabaseAdmin.storage
            .from(isChunk ? process.env.SUPABASE_STORAGE_CHUNK_BUCKET : process.env.SUPABASE_STORAGE_BUCKET)
            .upload(isChunk ? filePath : fileName,fileBuffer,{
                contentType: fileMimetype,
                upsert: true,
            })
    }
    listChunks = (filePath)=>{
        return this.supabaseAdmin.storage
            .from(process.env.SUPABASE_STORAGE_CHUNK_BUCKET)
            .list(filePath)
    }
    downloadChunk = (fileName)=>{
        return this.supabaseAdmin.storage
            .from(process.env.SUPABASE_STORAGE_CHUNK_BUCKET)
            .download(fileName)
    }
    publicUrl = (fileName)=>{
        return this.supabaseAdmin.storage
            .from(process.env.SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(fileName)
    }
}
