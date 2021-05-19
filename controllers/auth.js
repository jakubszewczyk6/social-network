const bcrypt = require('bcrypt');

const User = require('../models/user');

// registration
exports.signUp = async (req, res) => {
    const firstName = req.body['first-name'];
    const lastName = req.body['last-name'];
    const gender = req.body.gender;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hash = await bcrypt.hash(password, 13);

        const user = new User({
            firstName,
            lastName,
            gender,
            email,
            password: hash,
            avatarURI: null
        })
    
        await user.save();
        
        res.redirect('/signin');
    } catch(err) {
        console.log(err);
        res.render('sign-up', { signUpError: true });
    }
}
// logging in
exports.signIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw `${email} not found in the database`;
        }
        const passwordCorrect = await bcrypt.compare(password, user.password);
        
        if(passwordCorrect) {
            req.session.user = user;
            await User.findByIdAndUpdate(req.session.user._id, { $addToSet: {following: req.session.user._id }})
            res.redirect('/');
        } else {
            throw 'incorrect password';
        }
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
}
// logging out
exports.signOut = (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/signin');
    })
}