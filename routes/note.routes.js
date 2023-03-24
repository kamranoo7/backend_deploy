const express=require("express")
const noteRouter=express.Router()
const {NoteModel}=require("../model/note.model")
const jwt=require("jsonwebtoken")

noteRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    try{
        if(decoded){
            const notes=await NoteModel.find({"userID":decoded.userID})
            res.status(200).send(notes)
        }
    } catch(err){
        res.status(400).send({"msg":err.message}) 
    }
})

noteRouter.post("/add",async(req,res)=>{
    try{
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"A new Note has been added"}) 
    }catch(err){
        res.status(400).send({"msg":err.message}) 
    }
})

noteRouter.patch("/update/:notesID",async(req,res)=>{
    let {notesID}=req.params
    let payload=req.body
    try{
        await NoteModel.findByIdAndRemove({_id:notesID},payload) 
        res.status(200).send("notes has been updated")
    }catch(err){
       res.status(400).send({"msg":err.message}) 
      }
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    let noteID=req.params.noteID
    let req_id=decoded.userID
    let note=NoteModel.findOne({_id:noteID})
    let userID_in_note=note.userID
    try{
        if(req_id==userID_in_note){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"msg":"notes has been deleted"})
        }else{
            res.status(400).send("not authorised")
        }

}catch(err){
        res.status(400).send({"msg":err.message})
    
    }
})

module.exports={
    noteRouter
}


