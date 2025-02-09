const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        require:true,
    },
    last_name: {
        type: String,
        require:true,
    },
    email: {
        type: String,
        require: true,
        unique: true 
    },
    password: {
        type: String,
        require: true,
         unique: true 
    },
 
}, {timestamps:true},)



module.exports =  mongoose.model("UserAuth",userSchema)