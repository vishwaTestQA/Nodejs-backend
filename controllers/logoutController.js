const userDB = {
  users: require('../model/users.json'),
  setUsers: function(data){
    this.users = data;
  }
}

const fsPromises = require('fs').promises
const path =  require('path')

const handleLogout = async (req,res) =>{

  //do dont forget to delete access token from the client(front edn react/angular)
  const cookies = req.cookies;
  console.log(cookies)

  //no content sometimes without any session may try to logout
  if(!cookies?.jwt) return res.sendStatus(204); 

   const refreshToken = cookies?.jwt;
   const foundUserWithRefreshToken = userDB.users.find(usr => usr.refreshToken === refreshToken);

    if(!foundUserWithRefreshToken){
      // sameSite:"none", secure:true
      //sometimes cookies may have expired or sometimes someother use
      res.clearCookie('jwt',{httpOnly:true})  //secure:true has to be given for https, in dev it should be false
      return res.sendStatus(204);  
    } 

    //deleting from database
    const otherUsers = userDB.users.filter(usr=> usr.refreshToken !== foundUserWithRefreshToken.refreshToken);

    const currentUser = {...foundUserWithRefreshToken, refreshToken:''}
    userDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(userDB.users)
    );

    res.clearCookie('jwt',{httpOnly:true, sameSite:"none", secure:true}) //add secure:true for https
    res.sendStatus(204); //no content
    }

module.exports = handleLogout