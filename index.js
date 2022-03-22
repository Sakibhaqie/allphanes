const express=require('express');
let fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors=require("cors")
require("./DB_CONNECT/connect");

const PORT = process.env.PORT || 8000


const app=express()

app.use(cors())
app.use(express.json());
app.use(fileUpload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const allphanesuserController=require("./Router/allphanesuserController");
const allphanuserpostcontroller=require("./Router/allphanuserpostrouter");
app.use('/AllphanesuserAdd',allphanesuserController);
app.use('/Allphanesuserpost',allphanuserpostcontroller);
app.listen(PORT,function(){
    console.log("server is running");
})