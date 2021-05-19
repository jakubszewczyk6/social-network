const path = require('path');
const fs = require('fs').promises;

const Post = require('../models/post');

exports.addPost = async (req, res) => {
    const author = req.session.user._id;
    const textContent = req.body.textContent;
    const imageURI = req.files.image ? req.files.image[0].filename : null;

    const post = new Post({
        author,
        textContent,
        imageURI
    })
    try {
        await post.save();
        res.redirect('/');
    } catch(err) {
        console.log(err);
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.body['delete-post']);

        if(post.imageURI && post.author.toString() === req.session.user._id.toString()) {
            await fs.unlink(path.join(__dirname, '..', 'public', 'post-images', post.imageURI));
        }

        await Post.deleteOne({
            _id: req.body['delete-post'],
            author: req.session.user._id
        })

        res.redirect('/delete-post');
    } catch(err) {
        console.log(err);
    }
}

exports.like = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.body.postID, { $addToSet: { likes: req.session.user._id } }, { new: true });
        res.end(updatedPost.likes.length.toString());
    } catch(err) {
        console.log(err);
    }
}