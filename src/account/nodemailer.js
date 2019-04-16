var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '17520714@gm.uit.edu.vn',
    pass: 'longvip113'
  }
});

var mailOptions = {
  from: '17520714@gm.uit.edu.vn',
  to: 'dauan6969@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});