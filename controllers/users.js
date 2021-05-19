const User = require('../models/user');

exports.search = async (req, res) => {
    const searchQuery = req.query.username ? req.query.username.split(' ') : [];

    if (searchQuery.length === 2) {

        let [firstName, lastName] = searchQuery;
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();

        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

        try {
            const user = await User.findById(req.session.user._id)
            const users = await User.find({ firstName, lastName })
            res.render('search', { authUser: user, users });
        } catch(err) {
            console.log(err);
        }

    } else if (searchQuery.length === 1) {

        let [username] = searchQuery;
        username = username.toLowerCase();
        username = username.charAt(0).toUpperCase() + username.slice(1);

        try {
            const user = await User.findById(req.session.user._id)
            const users = await User.find({ $or: [{ firstName: username }, { lastName: username }] })
            res.render('search', { authUser: user, users });
        } catch(err) {
            console.log(err);
        }

    } else {
        res.render('search', { users: [] });
    }
}

exports.follow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.session.user._id, { $addToSet: {following: req.body.userID }})
        if(user.following.includes(req.body.userID.toString())) {
            const index = user.following.findIndex(followingUserID => followingUserID.toString() === req.body.userID.toString());
            user.following.splice(index, 1);
            user.save();
            res.end('removed');
        } else {
            res.end('added');
        }
    } catch(err) {
        console.log(err);
    }
}

exports.following = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('following')
        user.following.shift();
                
        res.render('following', {
            authUser: user,
            users: user.following
        });
    } catch(err) {
        console.log(err);
    }
}