const express = require ('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require ('./config/corsOptions')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500

//custom middleware
app.use(logger)

//apply third party middleware 
app.use(cors(corsOptions))

//middlewares  (note that built in midd;ewares don't use next because they  have been pre-built)
app.use(express.urlencoded({extended: false})) //this middleware is used to handle  url encoded data (e.g form data)

//middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//middleware to serve static files (e.g css, js files and the rest)
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public'))) //tells express to reference public directory with subdir

//for routers
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))

app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT) //every route after this makes use of the JWT authorization
app.use('/employees', require('./routes/api/employees'))

//Route handlers
app.all('*', (req, res) => { //formerly used app.get('/*)
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html')) //reason for the status chaining here is because express automatically sends a 200 once it can find a file
    res.status(404); 
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({error: "404 Not Found"})
    } else {
        res.type('txt').send("404 Not Found")
    }
}) 

//custom error handling to display cors on frontend instead of writing cors error to console
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))






// setTimeout(() => {
//     myEmitter.emit('log', 'Log event emitted!')
// }, 2000);
