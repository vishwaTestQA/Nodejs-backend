const express = require('express')
const app = express()
const PORT = 3500;
const path = require('path')



app.get('^/$|/index.html', (req, res)=>{  //also it accepts regex
  // res.send("hellow");
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname,'views','index.html'));
})

// app.get('^/$|/index.html', (req, res)=>{  //also it accepts regex
//   // res.send("hellow");
//   // res.sendFile('./views/index.html', {root: __dirname})
//   res.sendFile(path.join(__dirname,'views','index.html'));
// })


// app.get('/new-page(.html)?', (req, res)=>{
//   // res.send("hellow");
//   // res.sendFile('./views/index.html', {root: __dirname})
//   res.sendFile(path.join(__dirname,'views','new-page.html'));
// })


app.get('/old-page(.html)?', (req, res)=>{
  //by default for redirecting express provides 302 so we overriding it as 301
  res.redirect(301, '/new-page.html');
})

app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'views', '404.html'))
})

const one = (req, res, next)=>{  //also it accepts regex
  // res.send("hellow");
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname,'views','index.html'));
  next();
}


const two = (req, res)=>{
  // res.send("hellow");
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname,'views','new-page.html'));
}

app.get('/chaining(.html)?', [one,two]);






app.listen(PORT)