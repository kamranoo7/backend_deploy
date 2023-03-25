const express=require("express")
const cors=require("cors")
const {connection}=require("./db")
const {userRouter}=require("./routes/user.routes")
const {noteRouter}=require("./routes/note.routes")
require('dotenv').config()
const {auth}=require("./middleware/auth.middleware")

const app=express()
app.use(cors())
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Hello to home page")
})

app.use("/users",userRouter)
app.use(auth)
app.use("/notes",noteRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to the DB")
    }catch(err){
        console.log("Cannot connect to DB")
        console.log(err)
    }
    console.log("Server is running at port 4500")
})



