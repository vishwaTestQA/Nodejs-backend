const Users = require("../../model/Users");

const handleLogoutDB = async (req,res) =>{

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

    // foundUserWithRefreshToken.refreshToken = ''    //this will update the field with ''
    // const result = await foundUserWithRefreshToken.save();

    // another way
      const result =  await Users.updateOne(     //this will delete the token
      {username: foundUserWithRefreshToken.username},
      {$unset: {refreshToken:''}},
      {strict:false}
    )

    console.log("result", result);

    res.clearCookie('jwt',{httpOnly:true, sameSite:"none", secure:true}) //add secure:true for https
    res.sendStatus(204); //no content
    }

module.exports = handleLogoutDB