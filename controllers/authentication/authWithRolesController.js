//authWithRolesController

const userDB = {
  users: require('../../model/users.json'),
  setUsers: function(data){
    this.users = data;
  }
}

const {format} = require('date-fns');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const fsPromises = require('fs').promises
const path =  require('path')

const handleAuth = async(req,res) =>{
 console.log(req);
  const {user, pswd} = await req.body;
  const authToken = await req.headers.authorization || req.headers.Autorization;
  console.log("token",authToken);

  if(authToken !== undefined ){
    console.log("tokenVerified",jwt.decode(authToken));

    const tokenDetails = jwt.decode(authToken);
    const expiration = tokenDetails.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    // const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss")
    // const expiration = format(new Date(tokenDetails.exp * 1000), 'yyyy-MM-dd HH:mm:ss');
    // const expirationDate = new Date(tokenDetails.exp);
  
    console.log(currentTime, expiration);
  
    if(currentTime < expiration) return res.json({"message":"token is not expired"});
  }
 

  if(!user || !pswd) return res.status(400).json({"message": "username and passwords are required"})

    const foundUser = userDB.users.find(usr => usr.username === user);

    if(!foundUser) return res.sendStatus(401); //unauthorized

     //evaluatePassword 
    const match = await bcrypt.compare(pswd, foundUser.password)
    if(match){
      //get the roles of an user from db
      const roles = Object.values(foundUser.roles)

      // jwt.sign() accepts 3 args 1.payload, 2.token, 3.expiry
      const accessToken = jwt.sign(
        {
          "userInfo":{                    //this info shared a decoded value
          "username": foundUser.username, // so no body can read it, 
                                          // anyway this jwt is secure
          "roles": roles,       
          }
        },
         process.env.ACCESS_TOKEN_SECRET,
         {expiresIn:'1h'}
      );

      console.log('first time', jwt.decode(accessToken));

      const refreshToken = jwt.sign(
        {"username": foundUser.username},
         process.env.REFRESH_TOKEN_SECRET,
         {expiresIn:'1d'}
      );

      //save refresh token in database, it allow us to create a logout route to invalidate the token  
      const otherUsers = userDB.users.filter(usr=> usr.username !== foundUser.username);
      const currentUserWithRefreshToken = {...foundUser, refreshToken}
      userDB.setUsers([...otherUsers, currentUserWithRefreshToken])
      
      //writing file to db
      await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(userDB.users)
      );

      res.cookie('jwt', refreshToken, { httpOnly : true, maxAge: 24 * 60 * 60 * 1000, sameSite:"none", secure:true})
      res.json({accessToken});
    } else{
      res.sendStatus(401);  //unauthorized
    }
}

module.exports = handleAuth

