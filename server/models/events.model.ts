import { ObjectId } from "mongodb"
import * as connections from "../config/mongoConnection";

interface Event {
    _id ?: ObjectId,
    eventImgs : [],
    name : string,
    category : string,
    price: number,
    description : string,
    totalSeats: number,
    bookedSeats : number,
    minAge: number,
    hostId : ObjectId,
    active: Boolean,
    // stripe_product_id: string,
    cohostArr : [],
    attendeesArr : [],
    venue: {
        address: string,
        city: string,
        state: string,
        zip: string,
        geoLocation: {lat: number, long: number}
    },
    eventTimeStamp: Date

}

export {Event};