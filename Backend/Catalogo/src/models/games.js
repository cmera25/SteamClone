const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    developerId: {
        type: String,
        required: true
    },

    publisher: {
        type: String,
        required: true,
        trim: true
    },

    releaseDate: {
        type: Date,
        required: true
    },

    version: {
        type: String,
        default: "1.0.0"
    },

    status: {
        type: String,
        enum: [
            "DRAFT",
            "PUBLISHED",
            "SUSPENDED"
        ],
        default: "DRAFT"
    },

    categories: [{
        type: String,
        trim: true
    }],

    tags: [{
        type: String,
        trim: true
    }],

    media: {

        cover: {
            type: String,
            default: ""
        },

        banner: {
            type: String,
            default: ""
        },

        screenshots: [{
            type: String
        }],

        trailers: [{
            type: String
        }]
    },

    requirements: {

        minimum: {

            os: String,

            processor: String,

            memory: String,

            graphics: String,

            storage: String
        },

        recommended: {

            os: String,

            processor: String,

            memory: String,

            graphics: String,

            storage: String
        }
    },

    dlcs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DLC"
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "Game",
    gameSchema
);