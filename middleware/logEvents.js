const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const {format} = require('date-fns')
const {v4: uuid} = require('uuid');

// import fs from 'fs'
// import fsPromises from 'fs/promises'
// import path from 'path';
// import {format} from 'date-fns'
// import {v4 as uuid} from 'uuid'

const logEvents = async (message, logPath) =>{
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem= `${dateTime}\t${uuid()}\t${message}\n` 
  try{
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logPath), logItem);
  }catch(err){
    console.log(err);
  }
 
}

const logger = (req,res, next)=> {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'expressLogs.txt');
  next();
}

module.exports = {logger, logEvents}
