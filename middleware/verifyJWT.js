const jwt = require('jsonwebtoken')
require('dotenv').config();

//whatever req or whole route using this middleware then first the req comes inside and verify if the req has follwing requirments
const verifyJWT = (req, res, next)=>{
   const authHeader = req.headers['authorization']  //Bearer Token
   if(!authHeader) return res.sendStatus(403); //not have token
   const token = authHeader.split(' ')[1] //Token
   console.log("authHeader", authHeader) 
   jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) =>{
      // here we recived token but it may have expired or tampered(so invalid token)
      console.log('err', err)
      if(err) return res.sendStatus(401); 
      
      req.user = decoded.username;  //we have passed username to jwt
      console.log("usernameDecoded", req.user)
         // only if this condition satisifies it moves to next request(eg get or post etc)
      next(); 
    } 
   )
}

module.exports = verifyJWT