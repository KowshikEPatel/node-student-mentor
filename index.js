require("dotenv").config()

const express = require("express")
const mongodb = require("mongodb")

const port = process.env.PORT||4000;
const app = express()
const mongoclient = mongodb.MongoClient;
const objectId = mongodb.ObjectId;

app.use(express.json())
const dbUrl = process.env.DB_URL
//read all the mentor details
app.get("/mentor",async (req,res)=>{
    try {
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let data  = await db.collection('mentostudentm').find().toArray()
         res.status(200).json({
            "message":"ok",
            "data":data

            })
        }
        catch(e){
            console.log(e)
        }}    
)
//create a mentor 
app.post("/mentor",async (req,res)=>{
    try {
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let data  = await db.collection('mentostudentm').insertOne()
         res.status(200).json({
            "message":"ok",
            "data":data

            })
        }
        catch(e){
            console.log(e)
        }}    
)
//get all the students of a particular mentor
app.get("/mentor/:id",async (req,res)=>{
    try {
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let data  = await db.collection('mentostudentm').find({"mentor_id":parseInt(req.params.id)}).toArray()
        
        let studata = await db.collection('mentostudents').find({"mentor_id":objectId(data[0]["_id"]) }).toArray()
        res.status(200).json({
            
            "data":studata

            })
            client.close() 
        }
        catch(e){
            console.log(e)
        }
    }        
)

app.put("/mentor/:id",async (req,res)=>{
    try {
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let data  = await db.collection('mentostudentm').findOneAndUpdate({"mentor_id":parseInt(req.params.id)},{$set:req.body})
         res.status(200).json({
            "data":data
            })
        }
        catch(e){
            console.log(e)
        }}    
)

app.put("/mentor/:id/edit",async (req,res)=>{
    try {
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let mentordetails = await db.collection('mentostudentm').findOne({"mentor_id":parseInt(req.params.id)})
    
        let data2 = await db.collection('mentostudents').updateMany({"student_id":{$in:req.body["students"]}},{$set:{"mentor_id":mentordetails._id}})
        
       
        res.status(200).json({
            "message":"ok",
            "data":data2
        })    
    }
        catch(e){
            console.log(e)
        }}    
)

app.put("/student/:id/edit",async (req,res)=>{
    try{
        const client = await mongoclient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        const db = client.db('projectrestapi')
        let mentor = await db.collection("mentostudentm").find({"mentor_id":req.body["mentor_id"]}).toArray()
        
        let studentd = await db.collection("mentostudents").findOneAndUpdate({"student_id":parseInt(req.params.id)},{$set:{"mentor_id":mentor[0]._id}})
        res.status(200).json({
        "data":studentd
    })
    client.close()
}
    catch(e){
        console.log(e)
    }
})



app.listen(port,()=>console.log('app is running with '+port))