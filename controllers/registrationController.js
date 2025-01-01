const usersDB = {
  users: require('../model/users.json'),
  setUsers: (data)=>{
    usersDB.users = data;
  }
}