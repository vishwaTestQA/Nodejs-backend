const Users = require('../../model/Users');
const bcrypt = require('bcrypt');

const handleRegistrationOnMongo = async (req, res) => {
  const {user, pswd} = req.body;
  console.log("comming", req.body);
  if(!user || !pswd) return res.send(400).json({"message":"username and password are required "});
  console.log(user," ", pswd);
  //check if duplicate username in mongodb
  const duplicate = await Users.findOne({username: user}).exec();
  if(duplicate) return res.sendStatus(409);
   
  try{
  //passwordhashing
  const hashedPswd = await bcrypt.hash(pswd, 10);

  //create and store new user
  const result  = await Users.create({
    "username": user,
    "password": pswd,
  })
   
  //otherways to create collection
  // const newUser = new Users();
  // newUser.username = user;
  // newUser.password = pswd;
  // const result1 = await newUser.save();

  // const newUser2 = new Users({
  //   "username": user,
  //   "password": pswd,
  // });
  // const result2 = await newUser2.save();

  console.log(result);
  res.status(201).json({"message":`new use ${user} is created successfully`})
}catch(err){
  res.status(500).json({"message":"internal server error"})
}
}

module.exports = handleRegistrationOnMongo