const Users = require("../../model/Users");

const handleLogoutRotationDB = async (req,res) =>{

  //do dont forget to delete access token from the client(front edn react/angular)
  const cookies = req.cookies;
  console.log(cookies)

  //no content sometimes without any session may try to logout
  if(!cookies?.jwt) return res.sendStatus(204); 

   const refreshToken = cookies?.jwt;


   const foundUserWithRefreshToken = await Users.findOne({refreshToken}).exec();

    if(!foundUserWithRefreshToken){
      // sameSite:"none", secure:true
      //sometimes cookies may have expired or sometimes someother use
      res.clearCookie('jwt',{httpOnly:true, sameSite:"none", secure:true})  //secure:true has to be given for https, in dev it should be false
      return res.sendStatus(204);  
    } 

    //deleting refreshToken from database

  //  delete foundUserWithRefreshToken.refreshToken;  //this is not doing anything

    foundUserWithRefreshToken.refreshToken = foundUserWithRefreshToken.refreshToken
                                              .filter(rt=> rt!== refreshToken);
    const result = await foundUserWithRefreshToken.save();

    res.clearCookie('jwt',{httpOnly:true, sameSite:"none", secure:true}) //add secure:true for https
    res.sendStatus(204); //no content
    }

module.exports = handleLogoutRotationDB