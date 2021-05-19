const User = require('../models/user');
const Post = require('../models/post');


exports.signUp = (req, res) => {
    res.render('sign-up', { signUpError: false });
}

exports.signIn = (req, res) => {
    res.render('sign-in');
}

exports.index = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        const posts = await Post.find({ author: { $in: user.following } }).sort({ addedDate: 'desc' }).populate('author').populate('likes')
        res.render('index', { posts, user });
    } catch(err) {
        console.log(err);
    }
}

exports.addPost = (req, res) => {
    res.render('add-post');
}

exports.deletePost = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.session.user._id })
        res.render('delete-post', { posts });
    } catch(err) {
        console.log(err);
    }
}

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('profile', { user });
    } catch(err) {
        console.log(err);
    }
}