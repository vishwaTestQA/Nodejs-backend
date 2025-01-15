const jwt = require('jsonwebtoken');
const Users = require('../../model/Users');


//we have array of refresh token can be used for multiple device
const handleRefreshTokenWithDBRotation = async (req, res) => {
  const cookies = req.cookies;
  console.log('cook', cookies.jwt)
  if (!cookies?.jwt) {
    return res.sendStatus(403);  //forbidden
  }
  const refreshToken = cookies?.jwt;

  //to send new one we need to delete the old one first
  res.clearCookie('jwt',{httpOnly:true, sameSite:"None"}) //add secure:true 

  // find the user holds the same token in mongodb
  //  const result = await Users.findOneAndUpdate(
  //   {refreshToken: refreshToken},
  //   {$unset:{refreshToken:''}},
  //   // {returnDocument:"after"}
  // ).exec();

  const foundUserWithRefreshToken = await Users.findOne({refreshToken})

  //Detect rt reuse
  if (!foundUserWithRefreshToken) { //may user did logout 
     jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async(err, decoded) =>{   //checking token in db so async required
         if(err) return res.sendStatus(403); //forbidden

         //if the token is valid but user is not found in db, then it can be misuse so we have to invalidate immediately
         const hackedUser = await Users.findOne({username: decoded.username}) //now we getting the use from db and making all the rt if he/she has to null
         hackedUser.refreshToken = [];
         const result = await hackedUser.save();
         console.log(result);
      }
     )
    res.sendStatus(403);
  }

  //now the incomming token is present in db becz user found for the token, now we need to check if the token is valida if valid just give a new token else return 401 becz logout
  //  because it has the correct user, but still we need to remove the old token from the database in refreshToken array
  const newRefreshTokenArray = foundUserWithRefreshToken.refreshToken
                                               .filter(rt => rt !== refreshToken);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
        if(err){  //if the incomming token has expired
           foundUserWithRefreshToken.refreshToken = [...newRefreshTokenArray]; //old RT's
           const result = await foundUserWithRefreshToken.save();
        }
      console.log("decodedname",decoded.username, "foundUserWithRefreshToken ",foundUserWithRefreshToken.username);

      if (err || foundUserWithRefreshToken.username !== decoded.username){
        return res.sendStatus(401);
      }

      //if Refresh token is still valid and user is correct, so now we can sendback a new rt and access token

      const roles = Object.values(foundUserWithRefreshToken.roles);
      const accessToken = jwt.sign(
        {
          "userInfo": {       //this info shared a decoded value
            "username": foundUserWithRefreshToken.username, // so no body can read it, 
                                          // anyway this jwt is secure
            "roles": roles,         //here we sending roles to check if the accToken has rights to access to the route, same accToken can be used in front end to get the roles using jwt decoder if we dont want to send roles through json
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      //new RT
      const newRefreshToken = jwt.sign(   //we only send username for checking, no roles
          {"username": foundUserWithRefreshToken.username},
          process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      //saving refreshToken with current user
      foundUserWithRefreshToken.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = foundUserWithRefreshToken.save();

      //need to send back the cookie
      res.cookie('jwt', newRefreshToken, { httpOnly : true, maxAge: 24 * 60 * 60 * 1000, sameSite:"None"}); // for thunderclinet secure:true not works

      res.json({ roles, accessToken });  //can send the roles in json to frontend

    }
  )
}

module.exports = handleRefreshTokenWithDBRotation