const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    id: { type: String },
    name: { type: String },
    age: { type: Number }

});
const User = mongoose.model('User', userSchema)

module.exports = User