import { ObjectId } from "mongodb";

import { collections, users, events } from "../config/mongoCollections";
import * as mongoConnection from "../config/mongoConnection";
import { User } from "../models/user.model";

/**
 * This function is only for internal purpose
 * @param id is of string type. Here id represents user's id
 * Takes the userId and finds the required user data from the mongo collection using id parameter
 * @returns data of the requested user and also id is converted into string when returned
 */
async function getUser(id : string) {
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [404,'could not find the requested user']; // if the data returned is null throw an error
    
    requestedUser._id = requestedUser._id.toString(); // convert the id format from ObjectId to String
    console.log(requestedUser);
    return requestedUser;
}

/**
 * This method creates a user account and store it in database with the details provided
 * @param person represents the entire interface : User
 * @returns the newly created user details 
 */
async function createUser(person : User) {
    if(typeof(person.name)!='string'||typeof(person.gender)!='string'||typeof(person.email)!='string'||
    typeof(person.address.city)!='string'||
    typeof(person.address.state)!='string'||
    typeof(person.address.postal_code)!='string'||
    typeof(person.address.country)!='string') throw [400, "Registration Details Not In String Format"]

    if(!person.name.trim() || !person.gender.trim() || !person.email.trim()  || 
    !person.address.city.trim() || !person.address.state.trim() || !person.address.postal_code.trim() ||
     !person.address.country.trim() ) throw [400, "Registration Details Might Be Empty Strings"]

     if(isNaN(Number(person.phone)))throw [400, "Phone Number Is Not Number"]
     if(isNaN(Number(person.address.postal_code))) throw [400, "ZIP Is Not Number"]
     if( !isNaN(Number(person.name)) || !isNaN(Number(person.address.city)) || !isNaN(Number(person.address.state)) ||
     !isNaN(Number( person.address.country)) || !isNaN(Number(person.gender)) ||
     !isNaN(Number(person.email))
     ) throw [400, "Any Detail Of The User Might Be A Number Which Require To Be A String"]                        
    let newUser : User = { // creating an object that can be inserted into database
        "name": person.name.trim(),
        "address": {
            "city": person.address.city.trim(),
            "state": person.address.state.trim(),
            "postal_code": person.address.postal_code.trim(),
            "country": person.address.country.trim()
        },
        "phone": Number(person.phone),
        "gender": person.gender.trim(),
        "email": person.email.trim(),
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": [],
        "attendEventArray": []
    }
    
    await users(); // instantiating the mongoCollection
    let existingUserData = await collections.users?.findOne({email: person.email.trim()}); 
    if(!existingUserData){
    let result = await collections.users?.insertOne(newUser); // inserting the object into the database along with a newly created user objectId
    if(result?.acknowledged == false) throw [500,'could not register the user']; // if unable to store the details throw an error
    let createUserData = await collections.users?.findOne({_id: result?.insertedId}); // finding the newly inserted object with the new userId
    if(createUserData == null) throw [404,'could not find the details of the registered user']; // if unable to find details of user throw an error
    createUserData._id = createUserData._id.toString(); // converting id from ObjectId to string
    console.log(createUserData);
    return createUserData;
    }
    else{
        throw [400, "User Already Exists"]
    }
}


/**
 * updates the details of the user in the database
 * @param person represents the entire interface : User
 * @returns the modified details of the user
 */
async function modifyUser(person : User) {
    if(typeof(person.name)!='string'||typeof(person.gender)!='string'||typeof(person.email)!='string'||
    typeof(person.address.postal_code)!='string'||
    typeof(person.address.city)!='string'||
    typeof(person.address.state)!='string'||
    typeof(person.address.country)!='string') throw [400, "Updation Details Not In String Format"]

    if(!person.name.trim() || !person.gender.trim() || !person.email.trim()  || 
    !person.address.city.trim() || !person.address.state.trim() || !person.address.postal_code.trim() ||
     !person.address.country.trim() ) throw [400, "Updation Details Might Be Empty Strings"]

     if(isNaN(Number(person.phone)))throw [400, "Phone Number Is Not Number"]
     if(isNaN(Number(person.address.postal_code))) throw [400, "ZIP Is Not Number"]
     if( !isNaN(Number(person.name)) || !isNaN(Number(person.address.city)) || !isNaN(Number(person.address.state)) ||
    !isNaN(Number( person.address.country)) || !isNaN(Number(person.gender)) ||
     !isNaN(Number(person.email))
     ) throw [400, "Any Detail Of The User Might Be A Number Which Require To Be A String"]

    // ObjectId.isValid(person._id)
    let parseId = new ObjectId(person._id);

    let modifiedUser : User = {
        "name": person.name.trim(),
        "address": {
            "city": person.address.city.trim(),
            "state": person.address.state.trim(),
            "postal_code": person.address.postal_code.trim(),
            "country": person.address.country.trim()
        },
        "phone": Number(person.phone),
        "gender": person.gender.trim(),
        "email": person.email.trim(),
        "dateOfBirth": person.dateOfBirth,
        "hostEventArray": person.hostEventArray,
        "attendEventArray": person.attendEventArray
    }
    
    await users(); // instantiating the mongoCollection
    
    let result = await collections.users?.updateOne( {_id: parseId}, {$set: modifiedUser});
    if(result?.modifiedCount === 0) throw [500,'could not modify the users details']; // if unable to update throw an error
    let createUserData = await collections.users?.findOne({email: person.email.trim()}); // finding the newly inserted object with the new userId
    if(createUserData == null) throw [404,'could not find the details of the registered user']; // if unable to find details of user throw an error
    createUserData._id = createUserData._id.toString(); // converting id from ObjectId to string
    return createUserData;
}

/**
 * this method is used to retrieve the events that user has hosted
 * @param id is of string type. Here id represents user's id
 * @returns all the events that are hosted by the user
 */
async function getHostedEvents(id : string) {
   
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [404,'could not find the requested user']; // if the data returned is null throw an error
    
    let hostedEventIds = requestedUser.hostEventArray
    let hostedEventIds_parsed:ObjectId[] = []
    for(let id of hostedEventIds){
        let id_new:ObjectId = new ObjectId(id)
        hostedEventIds_parsed.push(id_new)
    }
    let events = await collections.events?.find({_id: {$in: hostedEventIds_parsed}}).toArray()
    if(events?.length === 0) return []

    for(let event of events!){
        event._id = event._id.toString()
    }
    return events;
}

/**
 * this method is used to retrieve the events that user has registered
 * @param id is of string type. Here id represents user's id
 * @returns all the events that user has registered
 */
async function getRegisteredEvents(id: string) {

    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestedUser = await collections.users?.findOne({_id: parseId}); // finds the requestedUser using id

    if(requestedUser == null) throw [400,'could not find the requested user']; // if the data returned is null throw an error
    let registeredEventIds = requestedUser.attendEventArray
    let registeredEventIds_parsed:ObjectId[] = []
    for(let id of registeredEventIds){
        let id_new:ObjectId = new ObjectId(id)
        registeredEventIds_parsed.push(id_new)
    }
    await events()
    let eventList = await collections.events?.find({_id: {$in: registeredEventIds_parsed}}).toArray()
    if(eventList?.length === 0) return []

    for(let event of eventList!){
        event._id = event._id.toString()
    }
    return eventList;
}

/**
 * this method is used to delete the user and user's details
 * @param id is of string type. Here id represents user's id
 * @returns if the user is deleted or will throw an error
 */
async function deleteUser(id: string) {
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let requestDeleteUser = await collections.users?.deleteOne({_id: parseId}); // deletes the requestedUser using id

    if(requestDeleteUser?.deletedCount === 0) throw [500,'could not delete the requested user']; // if the data is not deleted will throw an error

    return {userDeleted: true};
}

async function addHostedEvent(id: string, eventId: string) {
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    if(!ObjectId.isValid(eventId)) throw [400, "Event ID Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId
   
    let addingHostedEvent = await collections.users?.updateOne({_id: parseId}, {$addToSet: {hostEventArray: eventId}}); // finds the requestedUser using id
    
    if(addingHostedEvent?.modifiedCount == 0) throw [500,'could not modify hostEventArray'];

    return {addedHostedEvent: true};
}

async function addRegisteredEvent(id: string, eventId: string) {
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    if(!ObjectId.isValid(eventId)) throw [400, "Event ID Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let addingRegisteredEvent = await collections.users?.updateOne({_id: parseId}, {$addToSet: {attendEventArray: eventId}}); // finds the requestedUser using id

    if(addingRegisteredEvent?.modifiedCount == 0) throw [500,'could not modify attendEventArray'];

    return {addedRegisteredEvent: true};
}

async function deleteHostedEvent(id: string, eventId: string) {
    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    if(!ObjectId.isValid(eventId)) throw [400, "Event ID Is Invalid"]
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let deletingHostedEvent = await collections.users?.updateOne({_id: parseId}, {$pull: {hostEventArray: eventId}}); // finds the requestedUser using id

    if(deletingHostedEvent?.modifiedCount == 0) throw [500,'could not modify hostEventArray'];

    return {deletingHostedEvent: true};
}

async function deleteRegisteredEvent(id: string, eventId: string) {

    if(!ObjectId.isValid(id)) throw [400, "User Id Is Invalid"]
    if(!ObjectId.isValid(eventId)) throw [400, "Event ID Is Invalid"]
    
    await users(); // instantiating the mongoCollection

    let parseId : ObjectId = new ObjectId(id); // converting the id from string to ObjectId

    let deletingRegisteredEvent = await collections.users?.updateOne({_id: parseId}, {$pull: {attendEventArray: eventId}}); // finds the requestedUser using id

    if(deletingRegisteredEvent?.modifiedCount == 0) throw [500, 'could not modify attendEventArray'];

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