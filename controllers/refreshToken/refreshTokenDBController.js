const jwt = require('jsonwebtoken');
const Users = require('../../model/Users');

const handleRefreshTokenWithDB = async (req, res) => {
  const cookies = await req.cookies;
  console.log("reqCookies", cookies)
  console.log("reqUsers", req.body)
  if (!cookies?.jwt) {
    return res.sendStatus(403);
  }
  const refreshToken = cookies?.jwt;
  // const foundUserWithRefreshToken = userDB.users.find(usr => usr.refreshToken === refreshToken);

  // find the user holds the same token in mongodb
  //  const result = await Users.findOneAndUpdate(
  //   {refreshToken: refreshToken},
  //   {$unset:{refreshToken:''}},
  //   // {returnDocument:"after"}
  // ).exec();

  const foundUserWithRefreshToken = await Users.findOne({refreshToken})

  console.log(foundUserWithRefreshToken);

  if (!foundUserWithRefreshToken) return res.sendStatus(403); //unauthorized

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      console.log("decodedname",decoded.username, "foundUserWithRefreshToken ",foundUserWithRefreshToken.username);
      if (err || foundUserWithRefreshToken.username !== decoded.username){
        return res.sendStatus(401);}
      const roles = Object.values(foundUserWithRefreshToken.roles);
      const accessToken = jwt.sign(
        {
          "userInfo": {       //this info shared a decoded value
            "username": foundUserWithRefreshToken.username, // so no body can read it, 
                                          // anyway this jwt is secure
            "roles": roles,
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ accessToken });

    }
  )
}

module.exports = handleRefreshTokenWithDB