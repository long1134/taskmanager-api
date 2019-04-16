const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const routerUser = require('./routers/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require("./middleware/auth")
const touterTask = require("./routers/tasks")
const multer = require('multer')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(routerUser)
app.use(touterTask)

const upload = multer({
    dest:"images"
})

//upload1 is a key that you declear in key in post man
app.post("/upload",upload.single("upload1"),(req,res)=>{
    res.send()
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



// const main = async()=>{
//     const user = await User.findById("5ca3ede16fc68832648c8519")
//     await user.populate("tasks").execPopulate()
//     // console.log(user.tasks)
// }
// main()

// hashPassword = async () => {
//     const password = "Longvip113"
//     const hash = await bcrypt.hash(password, 8)
//     console.log(hash)

//     const checkPass = await bcrypt.compare(password, hash)
//     console.log(checkPass)
// }

// hashPassword()