//authWithRolesController

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Users = require('../../model/Users');
const { logEvents } = require('../../middleware/logEvents');

const handleAuthRotationDB = async(req,res) =>{
  const cookies = req.cookies;  //sometimes the user donot do logout and then he loggsin so that time client sends the rt back 
  console.log(`cookies availble at login: ${JSON.stringify(cookies)}`)
  
  const {user, pswd} = req.body;
  if(!user || !pswd) return res.status(400).json({"message": "username and passwords are required"})
  const foundUser = await Users.findOne({username: user});
  if(!foundUser) return res.sendStatus(401); //unauthorized

  // const result1 = await            //it will fetch an obj with id and password
  //    Users
  //   .findOne({username: user})
  //   .select('password')
  //   .exec();

  const result = await Users.findOne({username: user}).exec();   //it fetch the documents, we can use it later as well

    // evaluatePassword 
    const match = bcrypt.compare(pswd, result.password)

    if(!match) return res.sendStatus(401);  //unauthorized
    
      // const result = await Users.findOne({username: user})    //here agan we no need to fetch becz fetched 
      //                         .select('roles').exec();                             //alredy above
     

      // const rolesCodes =  Object.values(result.roles).filter(role => role!== 'undefined'|| role!==null);

      const rolesCodes =  Object.values(result.roles).filter(Boolean);

      // jwt.sign() accepts 3 args 1.payload, 2.token, 3.expiry
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

      const newRefreshToken =  jwt.sign(
        {"username": foundUser.username},
         process.env.REFRESH_TOKEN_SECRET,
         {expiresIn:'1d'}
      );

      //if the incomming req may have access token due to vari0ous reasons such as 
      // 1) user may not logged out and request login after sometimes 
    
      let newRTArray = !cookies.jwt     //if user uses multiple device then returns list of [rt1, rt2] else []
                              ? foundUser.refreshToken
                              : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)


            //this point we found auth is comming with some refreshToken, so need to detect reuse
              // hackers may have stole rt and can use so need to check the validity 
            if(cookies?.jwt){
              const refreshToken = cookies.jwt;
              const foundToken = await Users.findOne({refreshToken}) // ensuring if the token in db
              if(!foundToken){       //if not in db but we recive then its supicious, so make all rt empty
                console.log('attemped refresh token reuse')
                newRTArray = [];
              } 
              res.clearCookie('jwt' ,{ httpOnly: true, sameSite:'None', secure:true})
            }                  
                             
      //  if we have rt but user found in db then its from the correct user, now we can update him a new rt
      try{
        foundUser.refreshToken = [...newRTArray, ...newRefreshToken];
        const result = await foundUser.save();

        // const res = await Users.updateOne(
        //   {username: user},
        //   {$set: {refreshToken: refreshToken}},
        //   // {upsert:true},
        //   // { multi: true }
        //   { strict: false }
        // )
        console.log("resRefresh", result);
      }catch(error){
         logEvents(`${error.message}`)
         return res.status(501).json({"message":"error"})
      }
    
      res.cookie('jwt', newRefreshToken, { httpOnly : true, maxAge: 24 * 60 * 60 * 1000, sameSite:"none", secure:true}); // for thunderclinet secure:true not works
      res.json({rolesCodes, accessToken});
}

module.exports = handleAuthRotationDB

