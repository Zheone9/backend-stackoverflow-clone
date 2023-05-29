const User = require('../models/User');

const findByUsername =  (username) => {
    return User.findOne({username});
};

const updateUsername =  (uid, oldUsername, newUsername) => {
    return User.findOneAndUpdate({_id: uid, username: oldUsername}, {username: newUsername}, {new: true});
};

const updateUsernameById =  (uid, username) => {
    return User.findByIdAndUpdate(uid, {username,usernameIsSet:true}, {new: true});
};

module.exports = {
    findByUsername,
    updateUsername,
    updateUsernameById,
};