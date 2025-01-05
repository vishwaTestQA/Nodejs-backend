const userDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
}

const jwt = require('jsonwebtoken');
require('dotenv').config()

const handleRefreshTokenWithRoles = (req, res) => {
  const cookies = req.cookies;
  console.log("cookWithRoles", cookies);
  if (!cookies?.jwt) {
    return res.sendStatus(403);
  }

  const refreshToken = cookies?.jwt;
  const foundUserWithRefreshToken = userDB.users.find(usr => usr.refreshToken === refreshToken);

  if (!foundUserWithRefreshToken) return res.sendStatus(403); //unauthorized

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUserWithRefreshToken.username !== decoded.username){
        console.log(err, decoded.username);
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

module.exports = handleRefreshTokenWithRoles



// refreshTokenWithRolesController.js