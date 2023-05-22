const usersDB = {
    users: require('../model/users.json'), 
    setUsers : function(data) {this.users = data}
}

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises =  require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) {
        return res.status(400).json({'message' : 'username and password are required'})
    }

    //check database if user exists 
    const foundUser = usersDB.users.find(x => x.username == user)
       

    if (!foundUser) {
        res.status(401).json({'message': 'User not found'}) //Unauthorized
    }

     //evaluate password
     const match = await bcrypt.compare(pwd, foundUser.password)

    if(match) {
        //create JWT
        const accessToken = jwt.sign(
            {'username': foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {'expiresIn' : '30s'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {'expiresIn' : '1d'}
        );
        
        //filter out the present user 
        const otherUsers = usersDB.users.filter(x=> x.username !== foundUser.username)
        //get current user, and add a refresh token
        const currentUser = {...foundUser, refreshToken}; 
        //set users to add the other users and the current users 
        usersDB.setUsers([...otherUsers, currentUser]); 
        //write the new users file to our mock db
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users))
        
        //send token as a cookie 
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60* 1000})
        console.log(accessToken)
        res.json({'success' : ` User ${user} is logged in`, 'accessToken' : accessToken})
    } else {
        res.status(401).json({'message': 'User not found'}) //Unauthorized
    }

}

module.exports = ({handleLogin})