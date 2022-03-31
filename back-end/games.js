const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Prepare for server downloads from the Rayfield Modding API
const fs = require('fs');
const https = require('https');

// Zip file handling
const AdmZip = require("adm-zip");

// Promise-based game download function
async function downloadGame(gameId) {
    return new Promise((resolve, reject) => {
        const filePath = "./public/games/" + gameId + ".zip";
        const file = fs.createWriteStream(filePath);

        const request = https.get("https://raymon.musitraynes.com/games/" + gameId + ".zip", response => {
            if (response.statusCode !== 200) {
                fs.unlink(filePath, () => {
                    reject(new Error(`Download failed: (${response.statusCode})`));
                });
                return;
            }
            response.pipe(file);
        });

        file.on('finish', () => resolve("Success!"));

        request.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        file.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        request.end();
    });
}

// User schema, model, and middleware
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    path: String,
    title: String,
    created: {
        type: Date,
        default: Date.now
    },
});

const Game = mongoose.model('Game', gameSchema);

// create / publish / update game
router.post("/", validUser, async (req, res) => {
    let publishNew = true;
    // Access control
    try {
        let existing = await Game.findOne({
            title: req.body.gameId
        }).populate('user');
        // Only the author can publish updates
        if (existing.user.username !== req.user.username) {
            return res.sendStatus(403);
        } else {
            publishNew = false;
        }
    } catch (error) {
        // If the game is not found, do nothing (new publication)
    }
    // Main operation
    try {
        // Pull zip archive of game from Rayfield Engine API
        let downloadResult = await downloadGame(req.body.gameId);
        // Extract zip archive into games directory
        let gameZip = new AdmZip("./public/games/" + req.body.gameId + ".zip");
        gameZip.extractAllTo("./public/games/", true);
        if (publishNew) {
            // Save game to database
            const game = new Game({
                user: req.user,
                path: "/games/" + req.body.gameId + "/index.html",
                title: req.body.gameId
            });
            await game.save();
        }
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        if (error.toString().includes("404")) {
            return res.sendStatus(404);
        }
        return res.sendStatus(500);
    }
});

// get all games
router.get("/", async (req, res) => {
    try {
        let games = await Game.find().sort({
            created: -1
        }).populate('user');
        return res.send(games);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// delete all of the authenticated user's games
router.delete("/", validUser, async(req, res) => {
    try {
        let games = await Game.deleteMany({
            user: req.user
        });
        return res.send("Success! Deleted " + games.deletedCount + " items.");
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    model: Game,
    routes: router,
}
