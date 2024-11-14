authUsers = require("../models/UsersAuth")
const getAllUsers = async (req, res) =>
{
    const users = await authUsers.find().select("-password").lean()
    if (!users)
    {
        return res.status(400).json(({ message: " No users found" }))
    }
    res.json(users)
};
module.exports = {
    getAllUsers,
}