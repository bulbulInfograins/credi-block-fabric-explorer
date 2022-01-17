const { request } = require('express')
const http = require("http")
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));
const port = 3000
const admin = require("./enrollAdmin")
const user = require("./registerUser")
const invoke = require("./invoke")
const query = require("./query")
var pdf = require("pdf-creator-node");
const fs = require("fs");
const jwt = require('jsonwebtoken');



// cors policy
const cors = require('cors')
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Database Connection
var bcrypt = require('bcryptjs');
const  mongoose = require('mongoose')
mongoose
  .connect('mongodb+srv://roshan:user12@cluster0.uoxgo.mongodb.net/credit-block?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to the Database successfully');
  }).catch((err)=>{
    console.log(err);
  })

// Models
const User = require("./model/user")
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}


// endpoint for enrolling Admin - this is called once
app.post('/enrollAdmin', async (req, res) => {
  console.log("\n - Enrolling admin")
  var result = await admin.enrollAdmin()
  res.send(result)
})

// endpoint for registering Broker and Client
app.post('/enrollUser', async (req, res)=> {
  console.log("\n - Enrolling user")
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;
  var role = req.body.role;
  var pic = req.body.pic



  if (req.body.role == "Client") {
      role = 1;
  } if (req.body.role == "Broker") {
      role = 2;
  }
  if (req.body.role == "Supervisor") {
      role = 3;
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    first_name: first_name,
    last_name: last_name,
    userName: first_name+last_name,
    email: email,
    password: hashedPassword,
    confirmpassword: confirmpassword,
    role: role,
    pic: pic,
  });

  
  if(first_name == undefined || first_name == "" || email== undefined || email =="" || password == undefined || password == "" || confirmpassword == undefined || confirmpassword == "" || role == undefined || role==""){
      return res.json({statusCode:403, statusMsj:"please fill required filed"})
  }

  var userData = await User.findOne({ email: req.body.email });
  if(userData){
    return res.json({ statusCode: 402, message: "email already exist" })
  }
  
  if (password != confirmpassword) {
    return res.json({ statusCode: 401, message: "Pasword Mismatch" })
  }

  var userName = first_name+last_name
  var orgName = "Org1"
  var result = await user.registerUser(userName, orgName) 
  if(result.success === false){
    return res.send(result)
  }
  let response = new User(newUser)
  response.save()
  .then( async (data) => {
    return res.send(result)
  }).catch((err) => {
      console.log(err)
      return res.send(err)
  })
  // var userName = req.body.userName
  // var userName = first_name+last_name
  // var orgName = req.body.orgName
  // var result = await user.registerUser(userName, orgName) 
  // res.send(result)
})

// endpoint for invoking all transactions - CreateChat and UpdateChat
app.post('/invoke', async (req, res) => {
  console.log("\n - Invoke triggered")
  // var userName = req.body.userName
  // var channelName = req.body.channelName
  // var chaincodeName = req.body.chaincodeName
  // var functionName = req.body.functionName
  // var args = req.body.args

  var email = req.body.email
  var password = req.body.password
  var role = req.body.role;
  role = Number(role[5])


  const user = await User.findOne({ email });
  console.log("user",user)
  if (!user) return res.json({ statusCode: 401, message: 'Email does not exist!' });

  if (user.role != role) {
      return res.json({ statusCode: 403, message: "Incorrect Role" })
  }
  const validPassword = await validatePassword(password, user.password);
  if (!validPassword) return res.json({ statusCode: 402, message: 'Password is not correct' })

  const accessToken = jwt.sign({
      userId: user._id
  }, 'bulbul', {
      expiresIn: "1d"
  });
  await User.findByIdAndUpdate(user._id, {
      accessToken
  })

  var userName = user.userName;
  var channelName = "mychannel";
  var chaincodeName = "chat-app";
  var functionName= "InitLedger";
  var args = []
  var result = await invoke.invokeChaincode(userName, channelName, chaincodeName, functionName, args)
  result.accessToken = accessToken
  result.data = user
  res.send(result)
})

// endpoint for querying data from blockchain - QueryAllChats, QueryChat
app.post('/query', async (req, res) => {
  console.log("\n - Query operation")
  var userName = req.body.userName
  var channelName = req.body.channelName
  var chaincodeName = req.body.chaincodeName
  var functionName = req.body.functionName
  var args = req.body.args
  var result = await query.queryChaincode(userName, channelName, chaincodeName, functionName, args)
  res.send(result)
})

// endpoint for downloading all the chats, only admin is allowed to perform this operations
app.get('/downloadChats', async (req, res) => {
  console.log("\n - Download chats by admin")
  var userName = req.query.userName
  var channelName = req.query.channelName
  var chaincodeName = req.query.chaincodeName
  var functionName = "QueryAllChats"
  var args = ["admin@gmail.com"]
  var result = await query.queryChaincode(userName, channelName, chaincodeName, functionName, args)
  if(result.success == true){
    var html = fs.readFileSync("./pdfs/template.html", "utf8");
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm"
    }
    var datetime = new Date();
    datetime = datetime.toISOString().slice(0,10)
    var document = {
      html: html,
      data: {
        chats: JSON.parse(result.data),
      },
      path: `./pdfs/${datetime}.pdf`,
      type: "",
    };
    await pdf.create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
        res.download(`./pdfs/${datetime}.pdf`)

  } else {
    res.send(result.message)
  }
})

app.listen(port, () => {
  console.log(`**********************************************\nChating app listening at http://localhost:${port}\n\n**********************************************\n`)
})