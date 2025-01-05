//authWithRolesController

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Users = require('../../model/Users');
const { logEvents } = require('../../middleware/logEvents');

const checkToken =() =>{
    // const authToken = await req.headers.authorization || req.headers.Autorization;
  // console.log("token",authToken);

  // if(authToken !== undefined ){
  //   console.log("tokenVerified",jwt.decode(authToken));

  //   const tokenDetails = jwt.decode(authToken);
  //   const expiration = tokenDetails.exp;
  //   const currentTime = Math.floor(Date.now() / 1000);
  //   // const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss")
  //   // const expiration = format(new Date(tokenDetails.exp * 1000), 'yyyy-MM-dd HH:mm:ss');
  //   // const expirationDate = new Date(tokenDetails.exp);
  
  //   console.log(currentTime, expiration);
  
  //   if(currentTime < expiration) return res.json({"message":"token is not expired"});
  // }
 
}

const handleAuthDB = async(req,res) =>{
  const {user, pswd} = req.body;

  if(!user || !pswd) return res.status(400).json({"message": "username and passwords are required"})

    const foundUser = await Users.findOne({username: user});

    if(!foundUser) return res.sendStatus(401); //unauthorized

    const result = await 
     Users
    .findOne({username: user})
    .select('password')
    .exec();

    //  evaluatePassword 
    // const match = bcrypt.compare(pswd, pa)

    // const result = await Users.findOne(
    //   {username: user},
    //   { projection: { password: 1, _id: 0 }}
    // )
    // console.log("pwd",result.password);

     const match = pswd === result.password;
     console.log("userrrrrrr",user);
    if(match){
      const result = await Users.findOne({username: user})
        .select('roles').exec();
        console.log("roles", result.roles);
      const rolesCodes =  Object.values(result.roles).filter(role => role!== 'undefined'|| role!==null);
      console.log("rolesCodes", rolesCodes);



      // jwt.sign() accepts 3 args 1.payload, 2.token, 3.expiry
      console.log("rolesCodes", rolesCodes);
      const accessToken = jwt.sign(
        {
          "userInfo":{                    //this info shared a decoded value
          "username": foundUser.username, // so no body can read it, 
                                          // anyway this jwt is secure
          "roles": rolesCodes,       
          }
        },
         process.env.ACCESS_TOKEN_SECRET,
         {expiresIn:'1h'}
      );

      console.log('first time', jwt.decode(accessToken));

      const refreshToken =  jwt.sign(
        {"username": foundUser.username},
         process.env.REFRESH_TOKEN_SECRET,
         {expiresIn:'1d'}
      );

      try{
        const res = await Users.updateOne(
          {username: user},
          {'$set': {refreshToken: "tom"}}
        )
        console.log("resRefresh", res);
      }catch(error){
         logEvents(`${error.message}`)
         return res.status(501).json({"message":"error"})
      }
    
      res.cookie('jwt', refreshToken, { httpOnly : true, maxAge: 24 * 60 * 60 * 1000, sameSite:"none", secure:true})
      res.json({accessToken});
    } else{
      res.sendStatus(401);  //unauthorized
    }
}

module.exports = handleAuthDB

