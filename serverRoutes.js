const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')

// const subdir = require('./routes/subdir')
// const root = require('./routes/root')
const router = require('./routes/root')


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

 //it routes if any request comming for the subdir
//for eg: http://localhost/subdir  if after / finds subdir then it routes to this file

app.use('/subdir',require('./routes/subdir')); 


// app.get('/*', (req, res)=>{
//   res.sendFile(path.join(__dirname, 'views', '404.html'))
// })

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