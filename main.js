
const express = require('express')
const { exec } = require("child_process");
const nodemailer = require('nodemailer');
const fs = require('fs');


const app = express()

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs")

app.set("port", process.env.SMART_PORT || 3000)


app.get('/', (req, res) => {
  res.render("index", {
    url: req.url,
    req: req
  });
})

const homeController = require("./controllers/homeController")
app.get("/camera", homeController.showCurrent);

const robotController = require("./controllers/robotController")
app.get("/robot", robotController.getInfo);
app.post("/robot", robotController.postAction);

const hubController = require('./controllers/hubController')
app.get('/hub/action', hubController.getActionObject);
app.get('/hub/startinfo', hubController.getStartInfo);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
  app_init();
})

app_init = function() {
   console.log('Initilize server application, OS: ' + process.platform);
   let cmd = 'ifconfig';
   if (process.platform.includes('32') || process.platform.includes('64')) {
     cmd = 'ipconfig';
   }

   exec(cmd, (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         console.log(`stderr: ${stderr}`);
         return;
      }
      //console.log(`stdout: ${stdout}`);
      //app_sendEmail(stdout);
      app_saveStartInfo(stdout);
   });
}

app_saveStartInfo = function(stdout) {
   const file = 'public/hub/startinfo.txt';
   console.log('Save start info to ' + file);
   let info = 'Smart Serve started at ' + new Date().toString();
   info = info + '\r\n========================================\r\n';
   fs.writeFile(file, info, function(err) {
      if (err) { console.log( "Failed to write startinfo file: " + err); }
   });

   let data = stdout;
   fs.writeFile(file, data, function (err) {
      if (err) { console.log( "Failed to write startinfo file: " + err); }
  });
}

app_sendEmail = function(stdout) {
   var transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
         user: 'xddtech',
         pass: 'Cxxxx6'
      }
   });

   var mailOptions = {
      from: 'xddtech@yahoo.com',
      to: 'xxxx@yahoo.com',
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
}