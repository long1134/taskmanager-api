require('../db/mongoose')
const Task = require('../models/task')
const User = require('../models/user')

// Task.findByIdAndDelete("5c88838c4190f4355c5762ce").then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeAndCount = async (id, age)=>{
    const user = await User.findByIdAndUpdate(id,{age:age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount("5c898c26af9c51e2a0135cc7",19).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log("e"+e)
})