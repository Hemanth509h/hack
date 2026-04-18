"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.likePost = exports.getSocialFeed = exports.createPost = void 0;
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
const createPost = async (req, res) => {
    try {
        const { content, attachments, category, clubContext } = req.body;
        const post = await Post_1.Post.create({
            author: req.user?._id,
            content,
            attachments,
            category,
            clubContext
        });
        // Award points for posting
        await User_1.User.findByIdAndUpdate(req.user?._id, { $inc: { points: 10 } });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPost = createPost;
const getSocialFeed = async (req, res) => {
    try {
        const posts = await Post_1.Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name avatar major')
            .populate('clubContext', 'name logo');
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSocialFeed = getSocialFeed;
const likePost = async (req, res) => {
    try {
        const post = await Post_1.Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        const isLiked = post.likes.includes(req.user?._id);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user?._id.toString());
        }
        else {
            post.likes.push(req.user?._id);
            // Award 2 points to author for receiving a like
            await User_1.User.findByIdAndUpdate(post.author, { $inc: { points: 2 } });
        }
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.likePost = likePost;
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post_1.Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        post.comments.push({
            author: req.user?._id,
            content,
            createdAt: new Date()
        });
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addComment = addComment;
