const mongoose = require('mongoose');

const gallery = new mongoose.Schema({
    refPostId : { type : mongoose.Schema.ObjectId, required : true, ref : 'posts' },    
    postImagePath : { type : String, required : true },
    isActive : { type : Boolean, default : false },
    isTrash : { type : Number, default : 0 },
    status : { type : Boolean, default : false }
},
{timestamps : true});

module.exports=mongoose.model('gallery',gallery);





