const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')

app.use(express.urlencoded({extended:false}));

app.use(express.json())

const whitelist = ["http://localhost:3000"];

const corsOpt = {
  origin: (origin, callback)=>{
    if(whitelist.indexOf(origin) !== -1 || !origin){
      callback(null, true)
    } else{
      callback(new Error("Not allowed by CORS"))
    }
  },
  optionsSuccessStatus: 200,
}

app.use(cors(corsOpt))

app.use(express.static(path.join(__dirname, '/public')));

app.use(logger);

app.use('/',require('./routes/root')); 

app.use('/subdir',require('./routes/subdir')); 

//if a req like this (eg: http://localhost:3500/employees) then this routes to the folder 
app.use('/employees', require('./routes/api/employeesOld'))

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


app.listen(PORT)