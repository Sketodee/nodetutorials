const whitelist = ['https://www.mysite.com', 'http://localhost:3500'] //list of site you want to give access to the backend app

const corsOptions = {
    origin : (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin ) { //this line checks the array of whitelist to see if the incoming origin is present in the list or if originis undefined(for dev purpose) 
            callback(null, true) //this tells cors to proceed with giving the origin access
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions