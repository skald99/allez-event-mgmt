import * as connections from "../config/mongoConnection";
import {ObjectId} from "mongodb";

interface User {
    id: ObjectId,
    name: String,
    address: {
        city: String,
        state: String,
        zip: String
    },
    gender: String,
    dateOfBirth: Date,
    email: String,
    password: String,
    hostEventArray: [],
    attendEventArray: []
}

async function createUserCol() {
    const db = await connections.connectDB();
    const collection = db.collection<User>("users");
}

createUserCol();