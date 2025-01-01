// import { logEvents } from './logEvents.js';

// import LogEventEmitter from 'events'

const { logEvents } = require('./middleware/logEvents');

const LogEventEmitter = require('events')

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

class Emitter extends LogEventEmitter { };

const emitter = new Emitter();

emitter.on('log', (message, logFilePath)=> logEvents(message, logFilePath));

// emitter.on('log', (msg)=> logEvents(msg));

// setTimeout(()=> emitter.emit('log', 'logevent emitted'), 2000);

// const server = http.createServer(async (req, res)=>{
//   // res.write("helow1");
//   let path1;
//   try{
//   if(req.url === '/'){
//       path1 = path.join(__dirname, 'index.html')
//       const data = await fsPromises.readFile(path1, 'utf8');
//       // res.write(data);
//       // res.end();
//       res.writeHead(200, {'Content-Type':'text/html'})
//       res.end(data);
//   }else if(req.url === '/css/styles.css'){
//      path1 = path.join(__dirname, 'css', 'styles.css')
//     const data = await fsPromises.readFile(path1);
//     // res.write(data);
//     // res.end();
//     res.writeHead(200, { 'Content-Type': 'text/css' });
//     res.end(data);

//   }else{
//     path1 = path.join(__dirname, 'views','404.html')
//     const data = await fsPromises.readFile(path1, 'utf8');
//     res.write(data);
//     res.end();
//   }


// }catch(err){
//   console.log(err);
// }

// })


const server = http.createServer(async (req, res) => {

  emitter.emit('log', `${req.url}\t${req.method}`, './log.txt');
  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:   //it could be .html file or just /
      contentType = 'text/html';
      break;
  }

  //this is to create the filepath to check if the file exist 
  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html') :
      contentType === 'text/html' && req.url.slice(-1) === '/'
        ? path.join(__dirname, 'views', req.url, 'index.html')
        : contentType === 'text/html'
          ? path.join(__dirname, 'views', req.url)
          : path.join(__dirname, req.url)


  //when we make .html extensions not required in the browser
  //when hits the server without any extension then this line runs 
  if (!extension && req.url.slice(-1) !== '/')
    filePath += '.html';

  const fileExist = fs.existsSync(filePath);
  if (fileExist) {
    //if file exist then serve the file when serving if any error then it wouldbe server error
    serveTheFile(filePath, contentType, res);  
    console.log(req.url);

  } else {
    //else handle the error
    console.log(path.parse(filePath));

    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { 'Location': '/new-page.html' });
        break;

      case 'www-page.html':
        res.writeHead(301, { 'Location' : '/' });
        break;

      default:
        //serve a 404 response
        serveTheFile(path.join(__dirname,'views', '404.html'), 'text/html', res)

    }
  }
})

async function serveTheFile(filePath, contetType, response) {
  try {
    const data = await fsPromises.readFile(
      filePath, 
      !contetType.includes('image')? 'utf8':''
    );

    const jsonData = contetType === 'aplication/json' ? JSON.parse(data) : data;

    response.writeHead(
      filePath.includes('404.html') ? 404 : 200, contetType
    );

    response.end(
      contetType === 'aplication/json' ? JSON.stringify(jsonData) : data
    );
  } catch (err) {
    console.log(err);
    
    emitter.emit('log', `${err.name}: ${err.message}`, './errorlog.txt');
    response.statuCode = 500;
    response.end();
  }
}

server.on('close', ()=> {setTimeout(()=> console.log("closing so cleanup")),10000})

server.listen(3500, () => console.log("server is listening"))



// server.close();