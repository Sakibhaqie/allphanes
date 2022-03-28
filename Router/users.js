const express = require('express')
const globalfunction = require('../global')
const jwt = require('jsonwebtoken')
const config = require("../config")
const usersModel = require("../Model/users")
const router = express.Router()
const bcrypt = require("bcrypt")
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({ 
//     cloud_name: 'dyr5pe2er', 
//     api_key: '468257612725834', 
//     api_secret: '58qyQs40AuFUk_O1i8P1cbaivuI',
//     secure: true
// });

//   
const create = async (req, res, next) => {
    try {
        const currentDate = new Date()
        let otpExp = new Date()
        otpExp.setTime(currentDate.getTime() + (10 * 60 * 1000))
        const email = req.body.email
        const phone = req.body.phone
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(req.body.password, salt)
        const randotp = globalfunction.randNum(6)
        const hashOTP = await bcrypt.hash(randotp, salt)
        const item = new usersModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashPass,
            otp: hashOTP,
            otpExpTime: otpExp
        })

        await usersModel.findOne({ email: email, phone : phone })
        .then(user => {
            if(user) return res.json({ ack: "0", status: 401, message: "Registration not succesfull, email or Phone Number alredy exist"})
            const a1 = item.save( err => {
                err ?
                    res.json({ ack: "0", status: 401, message: "AllphaneUser data Not Insert"}):
                    res.json({ ack: "1", status: 200, message: "AllphaneUser data  Insert SuccesFully", otp : randotp, id : item._id})
            })
        })
        .catch(err =>{console.log(err)})
            
    } catch (err) {
        return res.json({ ack: 0, status: 500, message: "server error" })
    }
}

// edit ********************************************************************** /
const update = async (req,res) => {
    try{
        const randval = (Date.now())
        let profileImagePath = ""
        if (req.files != null) {
            if (req.files.profilePhoto != null) {
                await req.files.profilePhoto.mv("./uploads/image/" + randval + '.jpg', function (err) {
                    if (err) res.json({ "ack": 0, status: 401, message: "phto upload fail" })
                })
                profileImagePath = "uploads/image" + randval + '.jpg'
            }
        }
        const randvale = (Date.now())
        let coverPhotoPath = ""
        if (req.files != null) {
            if (req.files.coverPhoto != null) {
                await req.files.coverPhoto.mv("./uploads/image/" + randvale + '.jpg', function (err) {
                    if (err) res.json({ "ack": 0, status: 401, message: "phto upload fail" })
                })
                coverPhotoPath = "uploads/image" + randvale + '.jpg'
            }
        }
        const dataEdit=await usersModel.findByIdAndUpdate(req.params.id,{
            countryId : req.body.countryId,
            stateId : req.body.stateId,
            cityId : req.body.cityId,
            profilePhoto : profileImagePath,
            coverPhoto : coverPhotoPath,
            commendStatus : req.body.commendStatus
        })
        await dataEdit.save().then(item=>{
            if(!item) return res.json({message:"Allphanuser not update successfully"})
            return res.json({ack:1, status:200, message:"Allphanuser update successFully"})
        })
      }catch(err){
        res.json({ack:0, status:500, message:"Server error",error:err})
    }
}

// Retrive users ********************************************************************** /
router.get('/',async(req,res)=>{
    try{
        const data = await usersModel.find()
        console.log(data)
        const response = data ?
            res.json({ack:"1", status:200, message:"Request Successfull",data : data}):
            res.json({ack:"0", status:400, message:"Allphanuser data not get"})
        return response
    }catch(err){
       res.json({ack:"0", status:500, message:"server error",error:err})
    }
})
// delete users id********************************************************************** /
router.delete("/:id",async(req,res)=>{
    try{
        const deleted = await usersModel.findByIdAndRemove({_id : req.params.id})
        if(deleted) res.json({ack:"1", status:200, message:"Deleted Successfully"});
    }catch(err){
        res.json({ack:0, status:500, message:"server error",error:err});
    }
})

// login controller ********************************************************** /
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const randotp = globalfunction.randNum(6)
        const salt = await bcrypt.genSalt(10)
        const hashOTP = await bcrypt.hash(randotp, salt)
        const currentDate = new Date()
        let otpExT = new Date()
        otpExT.setTime(currentDate.getTime() + (10 * 60 * 1000))
        
        await usersModel.findOne({ email: email }).then(user => {
            ///if user not exit
            if (!user) return res.json({ ack: "0", status: 400, message: "User Not Exist" })
            const item = bcrypt.compare(password, user.password, (err, data) => {
                if (err) throw err  
                // if(!user.isEmailVerified){
                //     let response
                //     usersModel.findOneAndUpdate({email: email},{$set: {otp : hashOTP, otpExpTime : otpExT}})
                //     .then(user=>{
                //         response = res.json({ ack: "0", status: 401, message: "Please verify your email", otp : randotp })
                //     })
                //     //needed mail code
                //     return response
                // }             
                const response = data ?
                    res.json({ ack: "1", status: 200, message: "Login Successfully", id: user._id, isVerified: user.isEmailVerified, otp : randotp, hashOTP : hashOTP })
                    : res.json({ ack: "0", status: 400, message: "invallid credential" })
                
                return response
            })
        })

    } catch (err) {
        res.json({ ack: "0", status: 500, message: "Server Errors", error: err })
    }
})

// emailreset ********************************************************************** /
router.get("/resetemail", async (req, res) => {
    try {
        const findEmail = await usersModel.find({ email: req.body.email })
        if (!findEmail) return res.json({ ack: "0", status: 400, message: "email not matching" })
        const emailupdate = await usersModel.updateOne({ email: req.body.email }, { $set: { email: req.body.conemail } }).then(user => {
            if (!user) return res.status(400).json({ msg: "email not update" })
            return res.status(200).json({ msg: "email update success" })
        })
    } catch (err) {
        res.json({ ack: "0", status: 500, message: "Server Error", error: err })
    }
})

// Forgot password ********************************************************************** /
router.get("/forgetpassword",async(req,res)=>{
    try{   
        const randotp = globalfunction.randNum(6)
        const findEmail=await usersModel.findOne({email:req.body.email}).then(user=>{
       if(!user) return res.json({ack:"0", status:400, message:"email not matching"})
        //  return res.json({ack:"1", status:200, message:"email matching success",randotp})
        const token = jwt.sign({ id: usersModel.id }, config.secret, {
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
        const id = req.body.id
        const verifyOTP = req.body.otp
        const currentTime = new Date()
        await usersModel.findOne({_id: id})
        .then(user =>{
            if(!user) return res.json({ack:"0", status:400, message:"Cannot find user"})
            if(currentTime > user.otpExpTime) return res.json({ack:"0", status:400, message:"OTP Expired, Please resend OTP to try again"})
            bcrypt.compare(verifyOTP, user.otp, (err, data) => {
                //if error than throw error
                if (err) throw err
                //if both match than you can do anything
                if(!data) return res.json({ ack: "0", status: 400, message: "OTP not matched, Please enter valid OTP"})
                //updating user data   
                usersModel.updateOne({ _id: id }, { $set: { isEmailVerified: true } }, function (err) {
                    if (err) return res.json({ "ack": 0, status: 401, message: err })
                    return res.json({ ack: "1", status: 200, message: "OTP matched succesfully"})
                })
            })
        })
    }catch(err){
        res.json({ack:0, status:500, message:"server Error", error:err})
    }
})

// all Roueters ********************************************* _*/
router.post('/create', create)
router.post('/edit/:id', update)

module.exports = router
