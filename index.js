const express = require('express');
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let smtp_login = process.env.SMPT_LOGIN || "---";
let smtp_pass = process.env.SMTP_PASS || "---";

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtp_login , // generated ethereal user
        pass: smtp_pass  // generated ethereal password
    },
});

app.get('/', (req, res) => {
    res.send({message: 'Hello WWW!'});
});

app.post('/sendMail', async (req, res) => {
       const {name, email, phone, message} = req.body

    let info = await transporter.sendMail({
        from: `${email}`, // sender address
        to: "yuriykholoimov@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: `<b>Сообщение с сайта Портфолио</b>
<div>
name: ${name}, email: ${email}, phone: ${phone}
</div>
<div>
Message: ${message}
</div>
`, // html body
    });

    res.send({message: req.body});
});

let port = process.env.PORT || "http://localhost:3001/"

app.listen(port, () => {
    console.log(`Application listening on port ${port}!`);
});

