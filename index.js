const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const prog = express()

// Uses
prog.use(bodyParser.json());
prog.use(bodyParser.urlencoded({ extended: true }));
prog.use(session({
    secret: 'megalovania',
    cookie: {
        maxAge: 1000*60*60,
    },
    resave: true,
    saveUninitialized: true
}))

require('dotenv').config()

prog.use(cors())
if(process.env.MODE === 'development') {
    prog.use(cors({
        origin: process.env.INTERFACE_URL
    }))
}

// Database Config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB_URL)
.then(() => console.log('Connected to database'))
.catch(error => console.log(error))

// Routes
const { SysadminRoute } = require('./routes/Sysadmin_route')
const { CompanyRoute } = require('./routes/Company_route')
const { StaffRoute } = require('./routes/Staff_route')
const { UserRoute } = require('./routes/User_route')

prog.use('/sysadmin', SysadminRoute)
prog.use('/company', CompanyRoute)
prog.use('/staff', StaffRoute)
prog.use('/', UserRoute)

// App init
const port = process.env.PORT

prog.listen(port, () => {
    console.log(`Server is running on ${port}`)
})