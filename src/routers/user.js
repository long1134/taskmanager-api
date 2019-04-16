const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const jwt  = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Task = require("../models/task")
const multer = require("multer")
//sharp to modifle file before save in server
const sharp = require('sharp')
const {sendEmailWelcome, sendEmailCancel} = require("../account/email")


router.use(express.json())

router.get('/users', async (req, res) => {
    console.log("success")
    try {
        const users = await User.find({})
        if (!users)
            return res.status(401).send()
        return res.status(201).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.get("/users/:id", async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user)
            return res.status(401).send()
        return res.status(201).send(user)
    } catch (e) {
        return res.status(500).send()
    }
})

router.patch("/users/me",auth, async (req, res) => {
    const keyReq = Object.keys(req.body)
    const allowedUpdate = ['name', 'age', 'email', 'password']
    const validatorUpdate = keyReq.every((update) => {
        return allowedUpdate.includes(update)
    })

    if (!validatorUpdate)
        return res.status(401).send({
            error: 'Invalid updates!'
        })

    try {
        // console.log(req.body)
        keyReq.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()

        return res.status(201).send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/users/me',auth, async (req, res) => {
    const user = new User(req.user)
    try {
        await req.user.remove()
        sendEmailCancel(user.email, user.name)
        res.send(req.user)
    } catch (e) {
        return res.status(500).send(e)
    }
})

const uploadImg = multer({
    limits:{
        fileSize:100000
    },
    fileFilter(res,file,cb){
        if(!file.originalname.match(/\.(pdf|jpg)$/))
        {
            return cb(new Error("please upload pdf or jpg file"))
        }

        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,uploadImg.single("upload"),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.get("/users/:id/avatar",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar)
        {
            throw new Error()
        }

        res.set("Content-Type","image/jpg")
        res.send(user.avatar)
    }catch(e){
        res.status(401).send()
    }
})

router.delete("/users/me/avatar",auth, async(req,res)=>{
    req.user.avatar = []
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        sendEmailWelcome(user.email,user.name)
        const token = await user.checkAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        console.log("e "+e)
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try
    {
        const user = await User.findLogin(req.body.email,req.body.password)
        const token = await user.checkAuthToken()
        console.log(token)
        res.status(200).send({user,token})
    }catch(e)
    {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    }catch{
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    console.log(req.token)
    try{
        req.user.tokens = []

        await req.user.save()

        res.send()
    }catch{
        res.status(500).send()
    }
})



module.exports = router