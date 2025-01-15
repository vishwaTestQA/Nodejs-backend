const verifyRoles = (...ROLES_LIST) =>{
  console.log(...ROLES_LIST)
  return (req, res, next) => {
    if(!req?.roles) return res.sendStatus(401);  //unauthorized
    const rolesArr = [...ROLES_LIST];
    //incomming req can have 1 or more roles, but for the specific route we need to check the atmost role, so we map through to check if the specific role the req has, if it has then return true

    //req.roles is an array of codes [201,101,301] based on the user
    //each route has some specific role to access eg for post atmost we need "editor":301 for delete need "admin":201 so whan calling a route it verifies the role it attached with
    console.log("resp",req.roles, " ", rolesArr);
    const hasAccessToTheRoute = req.roles.map(role => rolesArr.includes(role)).find(val => val === true); 
 
    console.log("token",hasAccessToTheRoute);  // we only need true or false, 
    if(!hasAccessToTheRoute) return res.sendStatus(403);  //forbidden
    next();   //if its true then the req has access to the route so go ahead(next())
  }
}

module.exports = verifyRoles