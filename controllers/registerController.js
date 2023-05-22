const usersDB = {
    users: require ('../model/users.json'),
    setUsers : function(data) {this.users = data}
}

const fsPromises = require ('fs').promises;
const path = require('path');
const bcrypt = require ('bcrypt')

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) {
        return res.status(400).json({'message' : 'username and password are required'})
    }

    //check for duplicate username in database 
    if(usersDB.users.find(x => x.username === user)) {
        return res.status(409).json({'message': 'User already exists'})
    }

    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser = {
            "username": user,
            "password" : hashedPassword
        }
        //write the registered user to our mockDB (which is a file here)
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users)
        )

        console.log(usersDB.users)
        res.status(201).json({'message': `new user ${user} created`})
    } catch (error) {
        res.status(500).json({'message' : error.message})
    }

}

module.exports = ( {handleNewUser})