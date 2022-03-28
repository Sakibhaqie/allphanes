const mongoose = require('mongoose');
const { Schema } = mongoose;

const posts= new Schema({
    referenceUserId : { type : mongoose.Schema.ObjectId, required : true, ref : 'users' },
    postTitle : { type : String, required : true },
    postDescription : { type : String, required : true },
    isActive : { type : Boolean, default : true},
    isTrash : { type : Boolean, default : false },
    countViews : { type : Number , default : 0 }
},
{timestamps : true});

module.exports = mongoose.model('posts', posts);