import * as connections from "../config/mongoConnection";
import {ObjectId} from "mongodb";

interface User {
    _id?: ObjectId | string,
    name: string,
    address: {
        city: string,
        state: string,
        postal_code: string,
        country: string,

    },
    phone: number,
    gender: string,
    dateOfBirth: Date,
    email: string,
    hostEventArray: string[],
    attendEventArray: string[]
}


export {User};


