const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK

// connecting to database
mongoose.connect(DB_LINK)
.then(res=>console.log("Connected to Database."))
.catch(error=>console.log("Error while connection to database, Error: ",error))