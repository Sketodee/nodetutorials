const usersDB = {
    users: require('../model/users.json'), 
    setUsers : function(data) {this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')

const handleLogout =  async (req, res) => {
   const cookies = req.cookies
    if(!cookies?.jwt) {
        return res.sendStatus(204) //No content 
    }

    const refreshToken = cookies.jwt

    //check database if refresh token exist
    const foundUser = usersDB.users.find(x => x.refreshToken == refreshToken)
       
    if (!foundUser) {
        //erase the cookie
        res.clearCookie('jwt', {httpOnly: true})
        res.sendStatus(204) //No content
    }

     //Delete refreshtoken in our mockDB 
     const otherUsers = usersDB.users.filter(x => x.refreshToken !== foundUser.refreshToken)

     const currentUser = {...foundUser, refreshToken: ' '}
     usersDB.setUsers([...otherUsers, currentUser])
     await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users))
    
    res.clearCookie('jwt', {httpOnly: true})  //in production, add secure: true, so that it is true for https also
    res.sendStatus(204)
}

module.exports = ({handleLogout})