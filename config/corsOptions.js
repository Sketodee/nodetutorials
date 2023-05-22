const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin : (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin ) { //this line checks the array of whitelist to see if the incoming origin is present in the list or if originis undefined(for dev purpose) 
            callback(null, true) //this tells cors to proceed with giving the origin access
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions