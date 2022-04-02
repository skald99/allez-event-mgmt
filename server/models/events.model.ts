import { ObjectId } from "mongodb"
import * as connections from "../config/mongoConnection";

interface Event {
    eventId : ObjectId,
    eventImgs : [],
    name : String,
    category : String,
    price: Number,
    description : String,
    totalSeats: Number,
    bookedSeats : Number,
    minAge: Number,
    hostId : ObjectId,
    cohostArr : [],
    attendeesArr : [],
    venue: {
        address: String,
        city: String,
        state: String,
        zip: String,
        geoLocation: {lat: Number, long: Number}
    },
    eventTimeStamp: Date

}


async function createEventCol() {
    const db = await connections.connectDB();
    const collection = db.collection<Event>("events");
}

createEventCol();