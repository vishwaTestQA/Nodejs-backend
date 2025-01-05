const usersDB = {
  users: require('../../model/users.json'),
  setUsers: (data)=>{
    usersDB.users = data;
  }
}

const fs = require('fs')
const fsPromises =  fs.promises;
const path = require('path')
const bcrypt = require('bcrypt');

const handleUser = async (req, res)=>{
   const {user, pswd} = req.body;
   if(!user || !pswd) return res.status(400).json({"message": "username and password are required"})

    //check for duplicate user in json
    const duplicate = usersDB.users.find(usr=> usr.username === user)
    if(duplicate) return res.sendStatus(409); //conflict

    try{
      //we gave salt 10 as to protect the user privacy incase of db comprmise, sometimes attackers able to crack hashed pswd hence we need to add salts in it and bycrypt is great in storing it together
      const hashedPswd = await bcrypt.hash(pswd, 10); 

      //store new user
      const newUser = {username: user, password: hashedPswd}
      usersDB.setUsers([...usersDB.users, newUser]);

      await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)     //writefile is enough becz full file we overriting here
      )
      console.log(usersDB.users);
      res.status(201).json({"success": `New user ${newUser.username} is created`})
    }catch{

      //while creating pswd or storing we may face error so this error handling
      res.status(500).json({"error": `${err.message}`})
    }
}

module.exports = {
  handleUser
}