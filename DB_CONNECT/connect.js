const mongoose=require("mongoose");
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Allphanesdatabase' ;
mongoose.connect(uri,{
    useNewUrlParser: true,
    // useFindAndModify: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database connection successfull");
}).catch((err)=>{
    console.log(err)
})



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://imdadulhaque72:fC1euRARcq6JrCKX@cluster0.3hgo0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('connection successfull')
//   // perform actions on the collection object
//   client.close();
// })
