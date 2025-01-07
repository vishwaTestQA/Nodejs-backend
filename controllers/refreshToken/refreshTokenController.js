const userDB = {
  users: require('../../model/users.json'),
  setUsers: function(data){
    this.users = data;
  }
}

const jwt = require('jsonwebtoken');
require('dotenv').config()

const handleRefreshToken = (req, res) =>{
  const cookies = req.cookies;
console.log("cook",cookies);
  if(!cookies?.jwt) {
    return res.sendStatus(403);}

   const refreshToken = cookies?.jwt;
   const foundUserWithRefreshToken = userDB.users.find(usr => usr.refreshToken === refreshToken);

    if(!foundUserWithRefreshToken) return res.sendStatus(403); //unauthorized

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) =>{
        if(err || foundUserWithRefreshToken.username !== decoded.username)
           return res.sendStatus(401);

        const accessToken = jwt.sign(
          {"username": decoded.username},
           process.env.ACCESS_TOKEN_SECRET,
           {expiresIn:'1h'}
        );

        res.json({accessToken});
        
      }
    )
}

module.exports = handleRefreshToken