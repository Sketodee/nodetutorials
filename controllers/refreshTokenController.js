const usersDB = {
    users: require('../model/users.json'), 
    setUsers : function(data) {this.users = data}
}

const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleRefreshToken =  (req, res) => {
    //look for cookie in request.. don't forget you have saved the refresh token as a cookie in the AuthController
   const cookies = req.cookies
    if(!cookies?.jwt) {
        return res.sendStatus(401)
    }

    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    //check database if refresh token exist
    const foundUser = usersDB.users.find(x => x.refreshToken == refreshToken)
       
    if (!foundUser) {
        res.sendStatus(403) //forbidden
    }

     //evaluate jwt
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {
            if(err || foundUser.username != decoded.username)  return res.sendStatus(403) //username in the jwt was declared when creating the token in authcontroller 
            const accessToken = jwt.sign(
                {'username' : decoded.username}, 
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: '30s'}
            )

            res.json({accessToken})
        }
    )

}

module.exports = ({handleRefreshToken})