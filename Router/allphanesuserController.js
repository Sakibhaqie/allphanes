const express = require('express')
const globalfunction = require('../global')
const jwt = require('jsonwebtoken')
const config = require("../config")
const nodemailer = require("nodemailer")
const Allphanesusermodel = require("../Model/allphanesusermodel")
const router = express.Router()
const bcrypt = require("bcrypt")
const { genSalt } = require('bcrypt')
const { route } = require('express/lib/router')
const { updateOne, findOne } = require('../Model/allphanesusermodel')
const { response } = require('express')

const checkUnique = async (req, res, next)=>{
    console.log(req.body)
    await Allphanesusermodel.findOne(req.body)
    .then(user =>{
        if(user) return res.json({ ack: "0", status: 401, message: Object.keys(req.body) + " already Exist" })
        return res.json({ ack: "0", status: 200, message: req.body })
    })
    .catch(err =>{
        console.log(err)
    })
}

router.post('/checkunique', checkUnique)

router.post('/allphanuser', async (req, res, next) => {
    try {
        // checkUnique({Email: req.body.email})
        "use strict"
        async function main() {

            let testAccount = await nodemailer.createTestAccount()

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                // port: 587,
                auth: {
                    user: 'boton.cob2@gmail.com',
                    pass: '7031445611',
                },
            })
            const randval = (Date.now())
            let imagepath = ""
            if (req.files != null) {
                if (req.files.image != null) {
                    console.log(req.files)
                    await req.files.image.mv("./uploads/image/" + randval + '.jpg', function (err) {
                        if (err) {
                            res.json({ "ack": 0, status: 401, message: "phto upload fail" })
                        }
                    })
                    imagepath = "uploads/image" + randval + '.jpg'
                }
            }

            const currentDate = new Date()
            let otpExp = new Date()
            otpExp.setTime(currentDate.getTime() + (10 * 60 * 1000))
            // currentDate.getTime() > otpExp.getTime()
            const Email = req.body.Email
            const salt = await bcrypt.genSalt(10)
            const secpassword = await bcrypt.hash(req.body.Password, salt)
            const randotp = globalfunction.randNum(6)
            const randToken = globalfunction.randAlphaNum(64)
            const dbOtp = await bcrypt.hash(randotp, salt)
            const item = new Allphanesusermodel({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                PhoneNo: req.body.PhoneNo,
                Password: secpassword,
                otp: dbOtp,
                otpExpTime: otpExp,
                OtherPhoneNo:req.body.OtherPhoneNo,
                Mostinterested:req.body.Mostinterested,
                CreationDate:Date.now(),
                LastLoginDateTime:Date.now(),
                ModifiedDate:Date.now(),
                IsCompletedRegistration:req.body.IsCompletedRegistration,
                IsActive:req.body.IsActive,
                CountryId:req.body.CountryId,
                StateId:req.body.StateId,
                CityId:req.body.CityId,
                Isemailverified:req.body.Isemailverified,
                DateOfBirth:req.body.DateOfBirth,
                profile_pic:imagepath,
                cover_pic:imagepath,
                commend_status:req.body.commend_status,
                userToken:randToken
            })


            const a1 = await item.save( err => {
                err ?
                    res.json({ ack: "0", status: 401, message: "AllphaneUser data Not Insert" }):
                    res.json({ ack: "1", status: 200, message: "AllphaneUser data  Insert SuccesFully", token : randToken,otp : randotp })
            })

            let info = await transporter.sendMail({
                from: 'noreplyAllphanes@<boton.cob2@gmail.com>',
                to: Email,
                subject: "Allphanes OTP",
                html: "<b>Otp for account varification is :</b><h3 style='font-weight:bold; margin-left: 10px;'>" + randotp + "</h3>", // html body
            })

            info.messageId ? res.send("email send") : res.send("error with sending fail")

            console.log("Message sent: %s", info.messageId)
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        }
        main().catch(console.error)
    } catch (err) {
        return res.json({ ack: 0, status: 500, message: "server error" })
    }
})


router.post('/allphanuseredit/:id',async(req,res)=>{
    try{
        const randval = (Date.now())
        let profileimage = ""
        if (req.files != null) {
            if (req.files.profile_pic != null) {
                await req.files.profile_pic.mv("./uploads/image/" + randval + '.jpg', function (err) {
                    if (err) res.json({ "ack": 0, status: 401, message: "phto upload fail" })
                })
                profileimage = "uploads/image" + randval + '.jpg'
            }
        }
        const randvale = (Date.now())
        let coverpath = ""
        if (req.files != null) {
            if (req.files.cover_pic != null) {
                await req.files.cover_pic.mv("./uploads/image/" + randvale + '.jpg', function (err) {
                    if (err) res.json({ "ack": 0, status: 401, message: "phto upload fail" })
                })
                coverpath = "uploads/image" + randvale + '.jpg'
            }
        }
        const dataEdit=await Allphanesusermodel.findByIdAndUpdate(req.params.id,{
            CountryId:req.body.CountryId,
            StateId:req.body.StateId,
            CityId:req.body.CityId,
            profile_pic:profileimage,
            cover_pic:coverpath,
            commend_status:req.body.commend_status
        })
        await dataEdit.save().then(item=>{
            if(!item)return res.json({message:"Allphanuser not update successfully"})
            return res.json({ack:1, status:200, message:"Allphanuser update successFully"})
        })
      }catch(err){
        res.json({ack:0, status:500, message:"Server error",error:err})
    }
})

router.get("/allphanuserprofileget",async(req,res)=>{
    try{
        const data = await Allphanesusermodel.find()
        const response = data ? 
            res.json({ack:"1", status:200, message:"request succesfull", data}) 
            : res.json({ack:"0", status:400, message:"No data found",error:err})
        return response
    }catch(err){
        res.json({ack:"0", status:500, message:"server error",error:err})
    }
})

router.post("/login", async (req, res) => {
    try {
        const email = req.body.Email
        const Passwordx = req.body.Password
        const randotp = globalfunction.randNum(6)
        const salt = await bcrypt.genSalt(10)
        const hashOTP = await bcrypt.hash(randotp, salt)
        const randToken = globalfunction.randAlphaNum(64)
        Allphanesusermodel.findOne({ Email: email }).then(user => {
            ///if user not exit
            if (!user) return res.json({ ack: "0", status: 400, message: "User Not Exist" })
            bcrypt.compare(Passwordx, user.Password, (err, data) => {
                if (err) throw err
                //if both match than you can do anything
                const response = data ?
                    res.json({ ack: "1", status: 200, message: "Login Successfully", token: user.userToken })
                    : res.json({ ack: "0", status: 400, message: "invallid credential" })
                return response
            })

            // Allphanesusermodel.updateOne({ Email: email }, { $set: { otp: hashOTP, userToken: randToken } }, err => {
            //     if (err) return res.json({ "ack": 0, status: 401, message: err })
            //     return res.json({ ack: "1", status: 200, message: "OTP updated successfully", userToken: randToken})
            // })
            // need mailer
        })

    } catch (err) {
        res.json({ ack: "0", status: 500, message: "Server Errors", error: err })
    }
})


router.get("/emailreset", async (req, res) => {
    try {
        const emailmatch = await Allphanesusermodel.find({ Email: req.body.Email })
        if (!emailmatch) return res.json({ ack: "0", status: 400, message: "Email not matching" })
        const emailupdate = await Allphanesusermodel.updateOne({ Email: req.body.Email }, { $set: { Email: req.body.conEmail } }).then(user => {
            if (!user) return res.status(400).json({ msg: "Email not update" })
            return res.status(200).json({ msg: "Email update success" })
        })
    } catch (err) {
        res.json({ ack: "0", status: 500, message: "Server Error", error: err })
    }
})



router.get("/forgetpassword",async(req,res)=>{
    try{   
        const randotp = globalfunction.randNum(6)
        const Emailmatch=await Allphanesusermodel.findOne({Email:req.body.Email}).then(user=>{
       if(!user) return res.json({ack:"0", status:400, message:"Email not matching"})
        //  return res.json({ack:"1", status:200, message:"Email matching success",randotp})
        const token = jwt.sign({ id: Allphanesusermodel.id }, config.secret, {
            expiresIn: 86400
        })    
    })
    }catch(err){
        res.json({ack:0, status:500, message:"server Error", error:err})
    }
})

//otp verification
router.post("/otpverification", async(req,res) => {
    try{
        const token = req.body.userToken
        const verifyOtp = req.body.otp
        const currentTime = new Date()
        await Allphanesusermodel.findOne({userToken: token})
        .then(user =>{
            if(!user) return res.json({ack:"0", status:400, message:"Cannot find user"})
            if(currentTime > user.otpExpTime) return res.json({ack:"0", status:400, message:"OTP Expired, Please resend OTP to try again"})
            bcrypt.compare(verifyOtp, user.otp, (err, data) => {
                //if error than throw error
                if (err) throw err
                //if both match than you can do anything
                if(!data) return res.json({ ack: "0", status: 400, message: "OTP not matched, Please enter valid OTP"})
                //updating user data   
                Allphanesusermodel.updateOne({ userToken: token }, { $set: { IsActive: true } }, function (err) {
                    if (err) return res.json({ "ack": 0, status: 401, message: err })
                    return res.json({ ack: "1", status: 200, message: "OTP matched succesfully"})
                })
            })
        })
    }catch(err){
        res.json({ack:0, status:500, message:"server Error", error:err})
    }
})

//user get api
router.get('/allphanesuserget',async(req,res)=>{
    try{
        const data=await Allphanesusermodel.find()
        const response = data ?
            res.json({ack:1, status:1, message:"Allphanusers data get",view:data}):
            res.json({ack:"0", status:400, message:"Allphanuser data not get"})
        return response
    }catch(err){
       res.json({ack:"0", status:500, message:"server error",error:err})
    }
})


module.exports = router
