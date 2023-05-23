const verifyRoles = (...allowedRoles) =>{
    return (req, res, next) => {
        if(!req?.roles)  return res.sendStatus(401)
        const rolesArray = [...allowedRoles] //allowedRoles are the role that you want to give access to your endpoint, req.roles are the roles of the user accessing the endpoint, coming from the jwt
        console.log(rolesArray)
        console.log(req.roles)

        //this lines checks the user's roles and compare it with the allowedroles for an endpoint, and returns true if any of the user role is included in the allowedRoles for an endpoint
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401)
        next();
    }
}  

module.exports = verifyRoles