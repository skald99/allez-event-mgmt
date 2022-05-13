import { ObjectId } from "mongodb";
import { collections, users, events } from "../config/mongoCollections";
import * as mongoConnection from "../config/mongoConnection";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

// type address = {
//     city: string,
//     state: string,
//     zip: string
// }


const bcryptRounds: number = 10; // used for encrypting the password using bcrypt



/**
 * This function is only for internal purpose
 * @param id is of string type. Here id represents user's id
 * Takes the userId and finds the required user data from the mongo collection using id parameter
 * @returns data of the requested user and also id is converted into string when returned
 */
async function getUser(id : string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [400,'could not find the requested user']; // if the data returned is null throw an error
    
    requestedUser._id = requestedUser._id.toString(); // convert the id format from ObjectId to String
    console.log(requestedUser);
    return requestedUser;
}


// /**
//  * This function is used to check whether a person is passing correct credentials when the client is trying to login
//  * @param email is of string type
//  * @param password is of string type
//  * takes the email and checks the password with the userData that contains this email
//  * @returns whether the userLoggedIn is true or it will throw an error if the parameters are incorrect.
//  */
// async function checkUser(email: string, password: string) {
//     await users(); // instantiating the mongoCollection

//     let requestedUser = await collections.users?.findOne({email: email}); // finds the requestedUser using email

//     if(requestedUser == null) throw 'either email or password is incorrect'; // if the data returned is null throw an error

//     const checkPassword = await bcrypt.compare(password, requestedUser.password); // check the password using bcrypt

//     if(checkPassword == false) throw 'either email or password is incorrect'; // if compared passwords are not equal throw an error
//     console.log(requestedUser);
//     return {"userLoggedIn" : true, "userId": requestedUser._id.toString()};
// }


/**
 * This method creates a user account and store it in database with the details provided
 * @param person represents the entire interface : User
 * @returns the newly created user details 
 */
async function createUser(person : User) {
                            
    let newUser : User = { // creating an object that can be inserted into database
        "name": person.name,
        "address": {
            "city": person.address.city,
            "state": person.address.state,
            "postal_code": person.address.postal_code,
            "country": person.address.country
        },
        "phone": person.phone,
        "gender": person.gender,
        "email": person.email,
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": person.hostEventArray,
        "attendEventArray": person.attendEventArray
    }
    console.log("Test");
    
    await users(); // instantiating the mongoCollection

    let result = await collections.users?.insertOne(newUser); // inserting the object into the database along with a newly created user objectId
    console.log(result);
    if(result?.acknowledged == false) throw [400,'could not register the user']; // if unable to store the details throw an error
    let createUserData = await collections.users?.findOne({_id: result?.insertedId}); // finding the newly inserted object with the new userId
    if(createUserData == null) throw [400,'could not find the details of the registered user']; // if unable to find details of user throw an error
    createUserData._id = createUserData._id.toString(); // converting id from ObjectId to string
    console.log(createUserData);
    return createUserData;
}


/**
 * updates the details of the user in the database
 * @param person represents the entire interface : User
 * @returns the modified details of the user
 */
async function modifyUser(person : User) {
                            
    let parseId = new ObjectId(person._id);

    let modifiedUser : User = {
        "name": person.name,
        "address": {
            "city": person.address.city,
            "state": person.address.state,
            "postal_code": person.address.postal_code,
            "country": person.address.country
        },
        "phone": person.phone,
        "gender": person.gender,
        "email": person.email,
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": person.hostEventArray,
        "attendEventArray": person.attendEventArray
    }
    console.log("Test");
    
    await users(); // instantiating the mongoCollection

    let result = await collections.users?.updateOne( {_id: parseId}, {$set: modifiedUser});
    console.log(result);
    if(result?.modifiedCount === 0) throw [400,'could not modify the users details']; // if unable to update throw an error
    let createUserData = await collections.users?.findOne({email: person.email}); // finding the newly inserted object with the new userId
    if(createUserData == null) throw [400,'could not find the details of the registered user']; // if unable to find details of user throw an error
    createUserData._id = createUserData._id.toString(); // converting id from ObjectId to string
    return createUserData;
}

/**
 * this method is used to retrieve the events that user has hosted
 * @param id is of string type. Here id represents user's id
 * @returns all the events that are hosted by the user
 */
async function getHostedEvents(id : string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [400,'could not find the requested user']; // if the data returned is null throw an error
    
    return requestedUser.hostEventArray;
}

/**
 * this method is used to retrieve the events that user has registered
 * @param id is of string type. Here id represents user's id
 * @returns all the events that user has registered
 */
async function getRegisteredEvents(id: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [400,'could not find the requested user']; // if the data returned is null throw an error
    
    return requestedUser.attendEventArray;
}

/**
 * this method is used to delete the user and user's details
 * @param id is of string type. Here id represents user's id
 * @returns if the user is deleted or will throw an error
 */
async function deleteUser(id: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestDeleteUser = await collections.users?.deleteOne({_id: parseId}); // deletes the requestedUser using id

    if(requestDeleteUser?.deletedCount === 0) throw [400,'could not delete the requested user']; // if the data is not deleted will throw an error

    return {userDeleted: true};
}

async function addHostedEvent(id: string, eventId: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId
   
    let addingHostedEvent = await collections.users?.updateOne({_id: parseId}, {$addToSet: {hostEventArray: eventId}}); // finds the requestedUser using id
    
    if(addingHostedEvent?.modifiedCount == 0) throw [400,'could not modify hostEventArray'];

    return {addedHostedEvent: true};
}

async function addRegisteredEvent(id: string, eventId: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let addingRegisteredEvent = await collections.users?.updateOne({_id: parseId}, {$addToSet: {attendEventArray: eventId}}); // finds the requestedUser using id

    if(addingRegisteredEvent?.modifiedCount == 0) throw [400,'could not modify attendEventArray'];

    return {addedRegisteredEvent: true};
}

async function deleteHostedEvent(id: string, eventId: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let deletingHostedEvent = await collections.users?.updateOne({_id: parseId}, {$pull: {hostEventArray: eventId}}); // finds the requestedUser using id

    if(deletingHostedEvent?.modifiedCount == 0) throw [400,'could not modify hostEventArray'];

    return {deletingHostedEvent: true};
}

async function deleteRegisteredEvent(id: string, eventId: string) {
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let deletingRegisteredEvent = await collections.users?.updateOne({_id: parseId}, {$pull: {attendEventArray: eventId}}); // finds the requestedUser using id

    if(deletingRegisteredEvent?.modifiedCount == 0) throw [400, 'could not modify attendEventArray'];

    return {deletingRegisteredEvent: true};
}
export default {
    getUser,
    createUser, 
    modifyUser,
    getHostedEvents,
    getRegisteredEvents,
    deleteUser,
    addHostedEvent,
    addRegisteredEvent,
    deleteHostedEvent,
    deleteRegisteredEvent
};