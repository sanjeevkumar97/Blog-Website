const {Schema,model}=require('mongoose');

const blogImageSchema=new Schema({
    data:{
        type:Buffer,
        required:true,
    },
    contentType:{
        type:String,
        required:true,
        enum:['image/jpeg','image/png','image/gif','image/webp'],
    },
},{timestamps:true});

module.exports=model("blogImage",blogImageSchema);
