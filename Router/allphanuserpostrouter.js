const express=require('express');
const globalfunction = require('../global');
const Allphanuserpost=require("../Model/allphanuserpostmodel");
const Allphanuserimagegellary=require("../Model/allphanuserimagegellarymodel");

const router = express.Router()

router.post('/allphanuserposttitle',async(req,res)=>{
    try{
        const randotp = globalfunction.randNum(6);
       const data=new Allphanuserpost({
        RefrenceUId:randotp,
        PostTitle:req.body.PostTitle,
        PostDescription:req.body.PostDescription,
        PostDateTime:Date.now(),
        Isactive:true,
        Istarsh:true,
        ModifiedDateTime:Date.now(),
        CountViews:1
       })
       await data.save().then(item=>{
           if(!item)return res.json({ack:0, status:400, message:"Allphanuserpost inssert not successfully"});
           
           return res.json({ack:1, status:200, message:"Allphanuserpost insert successFully"});
           
       })
    }catch(err){
        res.json({ack:"0", status:500, message:"server error", error:err});
    }
});

router.post("/allphanuserimagegellary",async(req,res)=>{
    try{
        const randvale = (Date.now());
        let imagepath = ""
        if (req.files != null) {
            if (req.files.PaostImagePath != null) {
               await req.files.PaostImagePath.mv("./gellary/image/" + randvale + '.jpg', function (err) {
                    if (err) {
                        res.json({ "ack": 0, status: 401, message: "phto upload fail" });
                    }
                })
                imagepath = "gellary/image" + randvale + '.jpg';
            }
        }
        
        const allphanuserdata=await Allphanuserpost.find({RefrenceUId:"006362"}).sort({_id:-1}).limit(1);
        // console.log(allphanuserdata)
         const refid=[];
        
        allphanuserdata.forEach(item=>{
            // console.log('',item.id + item.createdAt);
            const val=item.id;
            // console.log(val);
            refid.push(val);
        });
        const refarenid=refid[0];
   
        const item=new Allphanuserimagegellary({
            RefPostId:refarenid,
            PaostImagePath:imagepath,
            IsActive:true,
            IsTarsh:1,
            Status:true
        });
       await item.save().then(item=>{
           if(!item)return res.json({ack:"0", status:500, message:"Allphanusergellary not insert image"});
           return res.json({ack:"1", status:200, message:"Allphanusergellary image upload"});
       })
    }catch(err){
        res.json({ack:0, status:500, message:"server error",error:err});
    }
});


module.exports = router;