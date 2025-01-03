const allowedOrgin = require('../config/allowedOrgin')

const credentials = (req, res, next)=>{
  console.log(allowedOrgin, req.headers.origin)
  const orgin = req.headers.origin;
  if(allowedOrgin.includes(orgin)){
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = credentials;