// function data(){
//   let a = b = 5;
// }

// data();

// console.log(b, a);

const ROLES_LIST = {
  user: 201,
  admin: 101,
  editor: 301
}

const reqRole = Object.values(ROLES_LIST);
console.log(reqRole)    //will give some number

function acceptRoles(...accRole){
  const rlArr = [...accRole]
  const hasAccess = reqRole.map(codes=> rlArr.includes(codes)).find(val => val === true)
  console.log(hasAccess)
}

function acceptRoleOne(accRole){
  const hasAccess = reqRole.find(codes => codes === accRole)
  console.log(hasAccess);
}

acceptRoles(ROLES_LIST.user)  //req with only as a user
acceptRoles(ROLES_LIST.user, ROLES_LIST.editor) //req with roles having both editor & admin
acceptRoleOne(ROLES_LIST.user)