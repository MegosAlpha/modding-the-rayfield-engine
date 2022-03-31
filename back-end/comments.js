const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const games = require("./games.js");
const Game = games.model;

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    game: {
        type: mongoose.Schema.ObjectId,
        ref: 'Game'
    },
    content: String,
    created: {
        type: Date,
        default: Date.now
    },
});

const Comment = mongoose.model('Comment', commentSchema);

// comment on a game / mod
router.post("/:id", validUser, async (req, res) => {
    let game = await Game.findOne({
        title: req.params.id,
    });
    let comment = new Comment({
        content: req.body.content,
        user: req.user,
        game: game,
    });
    try {
        await comment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get comments for a game / mod
router.get("/:id", async (req, res) => {
    try {
        let game = await Game.findOne({
            title: req.params.id,
        });
        let comments = await Comment.find({
            game: game
        }).populate("user");
        return res.send(comments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    model: Comment,
    routes: router,
}
