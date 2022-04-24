import { ObjectId } from "mongodb"
// import * as connections from "../config/mongoConnection";

interface Event {
    eventId ?: ObjectId | string,
    eventImgs : [],
    name : string,
    category : string,
    price: number,
    description : string,
    totalSeats: number,
    bookedSeats : number,
    minAge: number,
    hostId : ObjectId | string,
    cohostArr ?: string[],
    attendeesArr ?: string[],
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