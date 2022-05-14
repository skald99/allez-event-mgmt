import { Collection } from "mongodb";
import { Event } from "../models/events.model";
import { User } from "../models/user.model";
import { Image } from "../models/image.model";
import { Chunk } from "../models/chunks.model";
import dbConnection = require("./mongoConnection");
const config = process.env

export const collections: {
    users?: Collection<User>,
    events?: Collection<Event>,
    images?: Collection<Image>,
    chunks?: Collection<Chunk>
} = {}

export async function users() {
    let _col: Collection | undefined;
    if (!_col) {
        const db = await dbConnection.connectDB();
        const usersCol = db.collection<User>("Users");
        collections.users = usersCol;
    };
};


export async function events() {
    let _col: Collection | undefined;
    if (!_col) {
        const db = await dbConnection.connectDB();
        const eventsCol = db.collection<Event>("Events");
        collections.events = eventsCol;
    };
};

export async function eventImages() {
    let _col: Collection | undefined
    if (!_col) {
        const db = await dbConnection.connectDB();
        const imageCol = db.collection<Image>(config.IMAGE_BUCKET + ".files")
        collections.images = imageCol
    }
}

export async function imageChunks() {
    let _col: Collection | undefined
    if (!_col) {
        const db = await dbConnection.connectDB();
        const chunkCol = db.collection<Chunk>(config.IMAGE_BUCKET + ".chunks")
        collections.chunks = chunkCol
    }
}

