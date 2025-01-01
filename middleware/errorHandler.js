const {logEvents} = require('./logEvents')

const errorHandler = (err, req,res, next)=>{
  logEvents(`${err.name}: ${err.message}`, 'expressErrorLog.txt');
  res.status(500).send("error ocuured");
  next();
}

module.exports = errorHandler