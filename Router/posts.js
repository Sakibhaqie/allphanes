const express=require('express')
const globalfunction = require('../global')
const postsModel=require("../Model/posts")
const galleryModel=require("../Model/gallery")
const usersModel=require("../Model/users")
const router = express.Router()

const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Allphanesdatabase' 

  
// create post************************************************************************************ */
router.post('/create',async(req,res)=>{
    try{
        const data = new postsModel(req.body)
        
        const item= await data.save().then(item=>{
           if(!item) return res.json({ack:0, status:400, message:"postsModel inssert not successfully"})
           return res.json({ack:1, status:200, message:"postsModel insert successFully",id:item._id})
       })   
    }catch(err){
        res.json({ack:"0", status:500, message:"server error", error:err})
    }
})

// /get all post  ************************************** /
router.get("/",async(req,res)=>{
    try{
        MongoClient.connect(url, function (err, db) {
                if (err)
                    throw err
                let dbo = db.db("Allphanesdatabase")
                dbo.collection('posts').aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "referenceUserId",
                            foreignField: "_id",
                            as: "user_info"
                        }
                    },
                    // { $unwind: "$user_info" },
                    // define some conditions here 
                    {
                        $match:{
                            $and:[{"isActive" : true}]
                        }
                    },
                    {$sort: {"createdAt": -1}},
                    // {
                    //     $lookup: {
                    //         from: "userInfo",
                    //         localField: "userId",
                    //         foreignField: "userId",
                    //         as: "userInfo"
                    //     }
                    // },
                    // { $lookup:
                    //   {
                    //     from: 'users',
                    //     localField: 'referenceUserId',
                    //     foreignField: '_id',
                    //     as: 'details'
                    //   }
                    // }
                    {
                        $project: {
                            "posts._id": 1,
                            "postTitle": 1,
                            "postDescription" : 1,
                            "createdAt" : 1,
                            "user_info.firstName": 1,
                            "user_info.lastName": 1,
                            // "userInfo._id":0
                        }
                    }
                    
                ]).toArray(function (err, response) {
                    if (err)
                        throw err
                    // console.log(res[0])
                    res.json({ack:"1", status:200, message:"postsModel data get successfully",view:response})
                    db.close()
                })
            })
    }catch(err){
        res.json({ack:"0", status:500, message:"server error", error:err})
    }
})
// ************************************************************************************ */
router.post("/creategallery",async(req,res)=>{
    try{
        const randvale = (Date.now())
        let imagepath = ""
        if (req.files != null) {
            if (req.files.postImagePath != null) {
               await req.files.postImagePath.mv("./gellary/image/" + randvale + '.jpg', function (err) {
                    if (err) {
                        res.json({ "ack": 0, status: 401, message: "photo upload fail" })
                    }
                })
                imagepath = "gellary/image" + randvale + '.jpg'
            }
        }
        
        const allphanuserdata=await postsModel.find().sort({_id:-1}).limit(1)
        console.log(allphanuserdata)
         const refid=[]
        
        allphanuserdata.forEach(item=>{
            // console.log('',item.id + item.createdAt)
            const val=item.id
            // console.log(val)
            refid.push(val)
        })
        const refId=refid[0]
        
//    console.log(new mongoose.Types.ObjectId())
        const item=new galleryModel({
            refPostId:refId,
            postImagePath:imagepath,
            isactive:true,
            isTrash:1,
            status:true
        })
       await item.save().then(item=>{
           if(!item)return res.json({ack:"0", status:500, message:"Allphanusergellary not insert image"})
           return res.json({ack:"1", status:200, message:"Allphanusergellary image upload"})
       })
    }catch(err){
        res.json({ack:0, status:500, message:"server error",error:err})
    }
})

// router.get("/statusdelete/:id",async(req,res)=>{
//     try{
//     const statuscheck=await Allphanuserpost.findByIdAndDelete(req.params.id).then(item=>{
//         if(!item)return res.json({ack:0, status:400, message:"Allphanesuser post not Delete"});
//         return res.json({ack:1, status:200, message:"Allphanesuser post delete"});
//     })

//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

// router.post("/likes",async(req,res)=>{
//     try{
//       const likesvalue=new Like({
//         RefuserId:1,
//         Lik:1
//       })
//       await likesvalue.save().then(item=>{
//           if(!item)return res.json({ack:0, status:400, message:"Like value not insert"});
//           return res.json({ack:1, status:200, message:"Like value insert success",id:likesvalue._id});
//       })
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error", error:err});
//     }
// });

// router.get("/likescount",async(req,res)=>{
//     try{
//       const count=await Like.countDocuments({Lik:"1"}).then(item=>{
//           if(!item)return res.json({ack:0, status:400, message:"nulll"});
//           return res.json({ack:1, status:200, message:"count success",count:item});
//       })
      
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

// router.post("/dislike/:id",async(req,res)=>{
//     try{
//       const dislikecheck=await Like.findByIdAndUpdate(req.params.id,{
//         Lik:0
//       });
//       await dislikecheck.save().then(item=>{
//           if(item)return res.json({ack:1, status:200, message:"Dislike successFully"});
//           return res.json({ack:1, status:400, message:"dislike id not insert"});
//       })
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// });

// router.get("/dislikecount",async(req,res)=>{
//     try{
//     const discount=await Like.countDocuments({Lik:"0"}).then(item=>{
//         if(!item)return res.json({ack:0, status:400, message:"null"});
//         return res.json({ack:1, status:200, message:"countss",coun:item});
        
//     })
//     console.log(discount);
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

// router.post("/comment",async(req,res)=>{
//     try{
//         const cmd=new Comment({
//             RefuserId:1,
//             comment:req.body.comment
//         });
//         await cmd.save().then(item=>{
//             if(!item)return res.json({ack:0, status:400, message:"comment not insert"});
//             return res.json({ack:1, status:200, message:"comment insert success"});
//         })
//     }catch(err){
//         return res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

// router.get("/commentget",async(req,res)=>{
//     try{
//      const item=await Comment.find().then(item=>{
//          if(!item)return res.json({ack:0, status:400, message:"nulll"});
//          return res.json({ack:1, status:200, message:"comment get",view:item});
//      })
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

// router.get("/commcount",async(req,res)=>{
//     try{
//         const comcount=await Comment.countDocuments().then(item=>{
//             if(!item)return res.json({ack:0, status:400, message:"null count"});
//             return res.json({ack:1, status:200, message:"view count",count:item});
//         })
//     }catch(err){
//         res.json({ack:0, status:500, message:"server error",error:err});
//     }
// })

module.exports = router