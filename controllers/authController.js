const userDB = {
  users: require('../model/users.json'),
  setUsers: function(data){
    this.users = data;
  }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const fsPromises = require('fs').promises
const path =  require('path')

const handleAuth = async(req,res) =>{
  const {user, pswd} = req.body;
  if(!user || !pswd) return res.status(400).json({"message": "username and passwords are required"})

    const foundUser = userDB.users.find(usr => usr.username === user);

    if(!foundUser) return res.sendStatus(401); //unauthorized

     //evaluatePassword 
    const match = await bcrypt.compare(pswd, foundUser.password)
    if(match){
      const accessToken = jwt.sign(
        {"username": foundUser.username},
         process.env.ACCESS_TOKEN_SECRET,
         {expiresIn:'1h'}
      );

      const refreshToken = jwt.sign(
        {"username": foundUser.username},
         process.env.REFRESH_TOKEN_SECRET,
         {expiresIn:'1d'}
      );

      //save refresh token in database, it allow us to create a logout route to invalidate the token  
      const otherUsers = userDB.users.filter(usr=> usr.username !== foundUser.username);
      console.log('before passing', refreshToken)
      const currentUserWithRefreshToken = {...foundUser, refreshToken}
      console.log("currentUser", currentUserWithRefreshToken)
      userDB.setUsers([...otherUsers, currentUserWithRefreshToken])
      
      //writing file to db
      await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(userDB.users)
      );

      //sameSite:"none", secure:false
      res.cookie('jwt', refreshToken, { httpOnly : true, maxAge: 24 * 60 * 60 * 1000, sameSite:"none", secure:true})
      res.json({accessToken}); // front end devs will store it in memory

      // res.json({accessToken, refreshToken}); refToken on json not recommended now
    
      // res.json({"success":`user ${user} is logged in`})
    } else{
      res.sendStatus(401);  //unauthorized
    }
}

module.exports = handleAuth