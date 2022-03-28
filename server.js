const express=require('express')
let fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors=require("cors")
require("./DB_CONNECT/connect")

const PORT = process.env.PORT || 8000

const app=express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const usersController=require("./Router/users")
const postsController=require("./Router/posts")

app.use('/api/users',usersController)
app.use('/api/posts',postsController)

app.listen(PORT,function(){
    console.log("server is running")
})