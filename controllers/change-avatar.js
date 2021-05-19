const User = require('../models/user');

module.exports = async (req, res) => {
    try {
        if(req.files['avatar-change-file-input']) {
            await User.findByIdAndUpdate(req.session.user._id, { avatarURI: req.files['avatar-change-file-input'][0].filename })
            res.redirect('/profile');
        } else {
            throw 'avatar change failed';
        }
    } catch(err) {
        console.log(err);
    }
}