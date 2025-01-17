const jwt = require('jsonwebtoken')
require('dotenv').config();

//whatever req or whole route using this middleware then first the req comes inside and verify if the req has follwing requirments
const verifyJWT = (req, res, next)=>{
  console.log(req.headers);
  //Bearer Token
   const authHeader = req.headers.Authorization || req.headers.authorization
   console.log("authHeader injwtVerify",authHeader)
   if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); //not have token
   const token = authHeader.split(' ')[1] //Token
   jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) =>{
      // here we recived token but it may have expired or tampered(so invalid token)
      console.log('err', err)
      if(err) return res.sendStatus(403); 
      
      req.user = decoded.userInfo.username;  //we have previously passed username to jwt
      req.roles = decoded.userInfo.roles
      console.log("decoded")
      next(); 
    } 
   )
}

module.exports = verifyJWT