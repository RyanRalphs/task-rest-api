const mongoose = require('mongoose')
require('dotenv').config()  
const database = process.env.MONGO_DB_CONNECTION

mongoose.connect(database)