import { ObjectId } from "mongodb";
import { emitWarning } from "process";
import { collections, users, events } from "../config/mongoCollections";
import * as mongoConnection from "../config/mongoConnection";
import { User } from "../models/user.model";

// type address = {
//     city: string,
//     state: string,
//     zip: string
// }


async function createUser(person : User) {
                            
    let newUser : User = {
        "name": person.name,
        "password": person.password,
        "address": {
            "city": person.address.city,
            "state": person.address.state,
            "zip": person.address.zip
        },
        "gender": person.gender,
        "email": person.email,
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": person.hostEventArray,
        "attendEventArray": person.attendEventArray
    }
    console.log("Test");
    let user = await users();
    console.log(user);
    let result = await collections.users?.insertOne(newUser);
    console.log(result);

}


async function modifyUser(person : User) {
                            
    let modifiedUser : User = {
        "name": person.name,
        "password": person.password,
        "address": {
            "city": person.address.city,
            "state": person.address.state,
            "zip": person.address.zip
        },
        "gender": person.gender,
        "email": person.email,
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": person.hostEventArray,
        "attendEventArray": person.attendEventArray
    }
    console.log("Test");
    let user = await users();

    let result = await collections.users?.updateOne( {email: person.email}, {$set: modifiedUser});
    console.log(result);

}

export {createUser, modifyUser};