const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

app.use(express.urlencoded({extended:false}));

app.use(express.json())

app.use(cors(corsOptions))

app.use(express.static(path.join(__dirname, '/public')));

app.use(logger);

app.use('/',require('./routes/root')); 

app.use('/subdir',require('./routes/subdir')); 

//if a req like this (eg: http://localhost:3500/employees) then this routes to the folder 
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


app.listen(PORT)