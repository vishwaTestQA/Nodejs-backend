const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const https = require('https')
const fs = require('fs');


app.use(logger);

app.use(cookieParser())

app.use(credentials);

app.use(cors(corsOptions))

app.use(express.urlencoded({extended:false}));

app.use(express.json())

app.use(express.static(path.join(__dirname, '/public')));

app.use('/',require('./routes/root')); 

 

//if a req like this (eg: http://localhost:3500/employees) then this routes to the folder 

app.use('/subdir',require('./routes/subdir'));
app.use('/register', require('./routes/registration'))
app.use('/auth', require('./routes/auth')); //once the auth expires it then send req to /refresh
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res)=>{
  res.status(404); //assigning the status as 404
  if(req.accepts("html")){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  }else if(req.accepts("json")){
    res.send({"error": "404 not found"})
  }else{
    res.type('txt').send("404 not found")
  }
})

app.use(errorHandler)

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  },
  app
)


sslServer.listen(3443, ()=> console.log("started ssl server"))