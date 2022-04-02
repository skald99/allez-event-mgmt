import { Collection } from "mongodb";
import {Event} from "../models/events.model";
import { User } from "../models/user.model";
import dbConnection = require("./mongoConnection");

export const collections: {users ?: Collection<User>, events ?: Collection<Event> } = {}

export async function users()  {
    let _col : Collection | undefined;
    if(!_col) {
        const db = await dbConnection.connectDB();
       const usersCol = db.collection<User>("Users");
       collections.users = usersCol;
    };
};


export async function events()  {
    let _col : Collection | undefined;
    if(!_col) {
        const db = await dbConnection.connectDB();
       const eventsCol = db.collection<Event>("Events");
       collections.events = eventsCol;
    };
};

