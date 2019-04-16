const express = require('express')
const router = new express.Router()
const Task = require("../models/task")
const auth = require("../middleware/auth")

router.patch('/tasks/:id', async (req, res) => {
    const keyReq = Object.keys(req.body)
    const allowedUpdate = ['description']
    const validatorUpdate = keyReq.every((update) => {
        return allowedUpdate.includes(update)
    })

    if (!validatorUpdate)
        return res.status(401).send({
            error: "Invalud updates!"
        })

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })

        if (!task)
            return res.status(400).send()
        return res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/tasks/:id",auth, async(req,res)=>{
    const _id = req.params.id
    console.log(_id)
    try{
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task)
            res.status(404)
        // console.log(req)
        res.status(201).send(task)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})


router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body ,
        owner : req.user._id
    })
    console.log(task)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log("e", e)
    }
})

router.get("/tasks",auth,async(req,res)=>{
    const match = {}
    const sort ={}
    if(req.query.completed)
    {
        match.completed = req.query.completed === "true"
    }
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === "desc" ? -1:1
        console.log(sort)
    }
    try{
        // const tasks = await Task.find({owner: req.user._id})
        //add a property name tasks to user
       await req.user.populate({
           path:"tasks",
           match,
           options:{
               limit:parseInt(req.query.limit) ,
               skip:parseInt(req.query.skip),
               sort
           }
       }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.delete("/tasks/:id",auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id, owner : req.user._id})
        if(!task)
            res.status(404).send()
        res.status(200).send(task) 
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router