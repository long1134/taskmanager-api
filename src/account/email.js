const sendgrid = require("@sendgrid/mail")

const myEmail = "dauan6969@gmail.com"

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmailWelcome = (email, name)=>{
        
    sendgrid.send({
        to:email,
        from:myEmail,
        subject:"This is my first demo",
        text:`Welcome to join with us ${name}`
    })
}

const sendEmailCancel = (email,name)=>{
    sendgrid.send({
        to: email,
        from:myEmail,
        subject:"Why you want to cancel your email",
        text:`You have cancel your email in our company ${name}`
    })
}

module.exports = {
    sendEmailWelcome,
    sendEmailCancel
}
