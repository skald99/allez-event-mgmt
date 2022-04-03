import * as connections from "../config/mongoConnection";
import {ObjectId} from "mongodb";

interface User {
    _id?: ObjectId,
    name: string,
    address: {
        city: string,
        state: string,
        zip: string
    },
    gender: string,
    dateOfBirth: Date,
    email: string,
    password: string,
    hostEventArray: string[],
    attendEventArray: string[]
}


export {User};