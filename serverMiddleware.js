const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')

app.use(express.urlencoded({extended:false}));

app.use(express.json())


const corsOptions = {
  origin: [ 'http://localhost:3000'], // Allowed origins
  methods: [ 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  preflightContinue: false, // Handle OPTIONS requests directly
  optionsSuccessStatus: 204, // For legacy browsers that need a 204 status code for preflight requests
};

// app.use(cors(corsOptions));

// app.use(cors({
//   origin: [ "http://localhost:3000",   "http://localhost:3001"]
// }
// ));

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

app.get('^/$|/index(.html)?', (req, res)=>{  //also it accepts regex
  res.sendFile(path.join(__dirname,'views','index.html'));
})

app.get('/new-page(.html)?', (req, res)=>{
  res.sendFile(path.join(__dirname,'views','new-page.html'));
})


app.get('/old-page(.html)?', (req, res)=>{
  //by default for redirecting express provides 302 so we overriding it as 301
  res.redirect(301, '/new-page.html');
})

app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'views', '404.html'))
})

app.use(errorHandler)


app.listen(PORT)