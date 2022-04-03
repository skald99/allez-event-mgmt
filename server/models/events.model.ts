import { ObjectId } from "mongodb"
import * as connections from "../config/mongoConnection";

interface Event {
    _id ?: ObjectId,
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

export {Event};