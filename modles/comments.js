
const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({

    content:{
        type:String,
        required:true,
    },
   blogId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"blog",
   },
   createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
   }

});

const Comments=mongoose.model("comment",commentSchema);

module.exports=Comments;
