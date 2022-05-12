import { ObjectID } from "bson";

import { ObjectId } from "mongodb";
import { collections, users, events } from "../config/mongoCollections";
import { Event } from "../models/events.model";
import newEvent from "../task/events";
import usersdata from "./users";


async function createEvent(eventDetails: Event){
    console.log(eventDetails.bookedSeats)
    console.log(typeof(eventDetails.bookedSeats))
    let newEvent : Event = {
        "eventImgs" : eventDetails.eventImgs,
        "name" : eventDetails.name,
        "category" : eventDetails.category,
        "price": Number(eventDetails.price),
        "description" : eventDetails.description,
        "totalSeats": Number(eventDetails.totalSeats),
        "bookedSeats" : Number(eventDetails.bookedSeats),
        "minAge": Number(eventDetails.minAge),
        "hostId" : eventDetails.hostId,
        "cohostArr" : [],
        "attendeesArr" : [],
        "venue": {
            "address": eventDetails.venue.address,
            "city": eventDetails.venue.city,
            "state": eventDetails.venue.state,
            "zip": eventDetails.venue.zip,
            "geoLocation": {lat: Number(eventDetails.venue.geoLocation.lat), long: Number(eventDetails.venue.geoLocation.long)}
        },
        "eventTimeStamp": eventDetails.eventTimeStamp
    }
    await events()
    let created = await collections.events?.insertOne(newEvent);
    console.log(created)
    let insertedEvent = await collections.events?.findOne({_id: created?.insertedId});
    if(insertedEvent) insertedEvent._id = insertedEvent._id.toString();
    else throw "Event is not inserted properly";
    return insertedEvent;
}

async function modifyEvent(eventId: string | ObjectId, eventDetails: Event){

    eventId = new ObjectId(eventId)
    let newEvent : Event = {
        "eventImgs" : eventDetails.eventImgs,
        "name" : eventDetails.name,
        "category" : eventDetails.category,
        "price": eventDetails.price,
        "description" : eventDetails.description,
        "totalSeats": eventDetails.totalSeats,
        "bookedSeats" : eventDetails.bookedSeats,
        "minAge": eventDetails.minAge,
        "hostId" : eventDetails.hostId,
        "cohostArr" : [],
        "attendeesArr" : [],
        "venue": {
            "address": eventDetails.venue.address,
            "city": eventDetails.venue.city,
            "state": eventDetails.venue.state,
            "zip": eventDetails.venue.zip,
            "geoLocation": {lat: eventDetails.venue.geoLocation.lat, long: eventDetails.venue.geoLocation.long}
        },
        "eventTimeStamp": eventDetails.eventTimeStamp
    }
    await events()
    let eventUpdated = await collections.events?.updateOne({_id: eventId},{$set: newEvent});
    if(eventUpdated?.modifiedCount===0){
        throw [400, "Cannot Update Event"]
    }
    return "Updated The Event Successfully"
}

async function deleteEvent(eventId: string | ObjectId){
    eventId = new ObjectID(eventId)
    await events()
    let removingEvent = await collections.events?.findOne({_id: eventId});
    console.log(removingEvent)
    if(removingEvent) removingEvent._id = removingEvent._id.toString();
    else throw [400, "There is no event with the requested id"];

    let deletedEvent = await collections.events?.deleteOne({_id: eventId})
    if(deletedEvent?.deletedCount===0){
        throw [400, "Could Not Delete Event"]
    }
    return removingEvent
}
// async function getEventById(eventId: string | ObjectId){
//     eventId = new ObjectId(eventId)
//     await events();
//     let requestedEvent = await collections.events?.findOne({_id: eventId})
    
//     console.log(requestedEvent)
//     return requestedEvent;
// }
// async function getEventsByCategory(eventCategory: string){
//     await events();

//     let requestedEvent = await collections.events?.find({category: eventCategory}).toArray();
//     if(requestedEvent===null) throw 'Error: Event Not Found'
//     console.log(requestedEvent)
//     if(requestedEvent?.length===0){
//         throw [400, "No Events In That Category"]
//     }
//     return requestedEvent;

// }

async function getAllEvents(){
    await events();
    let requestedEvent = await collections.events?.find().toArray();
    if(requestedEvent?.length===0){
        throw [400, "No Events Found"]
    }
    return requestedEvent;

}
// async function getEventsByHost(hostId: string | ObjectId){
//     hostId = new ObjectId(hostId)
//     await events();
//     let requestedEvent = await collections.events?.find({hostId: hostId}).toArray();
//     if(requestedEvent?.length===0){
//         throw [400, "No Events By that Host Found"]
//     }
//     console.log(requestedEvent)
//     return requestedEvent;

// }
// async function getEventsByCity(cityFind: string){
//     await events();
//     let requestedEvent = await collections.events?.find({'venue.city': cityFind}).toArray()
//     console.log(requestedEvent)
//     if(requestedEvent?.length===0){
//         throw [400, "No Events In That City"]
//     }
//     return requestedEvent;

// }
// async function getEventsByState(stateFind: string){
//     await events();
//     let requestedEvent = await collections.events?.find({'venue.state': stateFind}).toArray()
//     console.log(requestedEvent)
//     if(requestedEvent?.length===0){
//         throw [400, "No Events In That State"]
//     }
//     return requestedEvent;

// }

async function addImage(eventId: string){

}

async function getFreeEvents(){
    await events();
    let freeEvents = await collections.events?.find({price: 0}).toArray();
    if(freeEvents?.length===0){
        throw [400, "No Free Events"]
    }
    console.log(freeEvents)
    return freeEvents

}
async function addCohost(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();
    let cohostUpdated = await collections.events?.updateOne({_id: eventId},{$addToSet: {cohostArr: userId}});
    console.log(cohostUpdated)
    if(cohostUpdated?.modifiedCount===0){
        throw [400, "Cannot Add Co Host"]
    }
    return cohostUpdated
}

async function addAttendee(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();
    let requestedEvent = await collections.events?.findOne({_id: eventId})
    if(!requestedEvent) throw [400, "Event Not Found"]
    if(requestedEvent?.totalSeats===requestedEvent?.bookedSeats){
        throw [400, 'Event Is Full Already']
    }
    if(userId===requestedEvent?.hostId){
        throw [400, "You're the Host"]
    }
    if(requestedEvent?.cohostArr?.includes(userId)){
        throw [400, "You're A Cohost"]
    }
    else{

      let attendeeUpdated = await collections.events?.updateOne({_id: eventId},{$addToSet: {attendeesArr:userId}});
    if(attendeeUpdated?.modifiedCount===0){
        throw [400, "You Have Already Registered For The Event"]
    }
    else{
        console.log("Attendee added")
        let updateCount = await collections.events?.updateOne({_id:eventId}, {$inc:{bookedSeats: 1}})
        return "Attendee added successfully"
    }

}

}

async function unRegister(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();
    let removeAttendee = await collections.events?.updateOne({_id: eventId},{$pull: {attendeesArr:userId}})
    if(removeAttendee?.modifiedCount===0) throw [400, "User/Event Not Present"]
    else{
        await collections.events?.updateOne({_id:eventId}, {$inc:{bookedSeats: -1}})
        return "Attendee unregistered successfully"
    }   
}


async function removeCohost(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();
    let remCohost = await collections.events?.updateOne({_id: eventId},{$pull: {cohostArr:userId}})
    if(remCohost?.modifiedCount===0) throw [400, "Cohost/Event Not Present"]
    return "Cohost removed successfully"
}

async function getByFilter(filters: {city ?: string, state ?: string, category ?: string}){
    await events();
    // City, state, category
    console.log("Insdei getbyfilter function")
    console.log(filters)
    if(filters.city && filters.category && filters.state){
        let requestedEvent = await collections.events?.find({"venue.city": filters.city, "venue.state": filters.state, "category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;
    }
    else if(filters.city && filters.state){
        console.log("Only city, state")
        let requestedEvent = await collections.events?.find({"venue.city": filters.city, "venue.state": filters.state}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;
    } 
    else if(filters.city && filters.category){
        let requestedEvent = await collections.events?.find({"venue.city": filters.city, "category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;

    } 
    else if(filters.category && filters.state){
        let requestedEvent = await collections.events?.find({"venue.state": filters.state, "category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;

    } 
    else if(filters.city){
        console.log("Only city filter")
        let requestedEvent = await collections.events?.find({"venue.city": filters.city}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;
    } 
    else if(filters.state){
        let requestedEvent = await collections.events?.find({"venue.state": filters.state}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;

    } 
    else if(filters.category){
        let requestedEvent = await collections.events?.find({"category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        return requestedEvent;

    } 
    else{
        throw [400, 'No Events Based On This Filter']
    }

}
async function getbyId(ids: {eventId ?: string | ObjectId, hostId ?: string | ObjectId }){
    await events();
    console.log("Inside getbyid functiion")
    if(ids.eventId && ids.hostId){
        let neweventId = new ObjectId(ids.eventId)
        let newhostId = ids.hostId.toString();
        console.log(neweventId)
        console.log(newhostId)
        let requestedEvent = await collections.events?.findOne({_id: neweventId, hostId: newhostId});
        if(requestedEvent===null) throw [400, 'Event Not Found With that ID And HostId']
        return requestedEvent;

    }
    else if(ids.eventId){
        let neweventId = new ObjectId(ids.eventId)
        let requestedEvent = await collections.events?.findOne({_id: neweventId});
        if(requestedEvent===null) throw [400, 'Event Not Found']
        return requestedEvent
    }
    else if(ids.hostId){
    let newhostId = ids.hostId.toString();
    let requestedEvent = await collections.events?.find({hostId: newhostId}).toArray();
    if(requestedEvent?.length===0){
        throw [400, "No Events By that Host Found"]
    }
    return requestedEvent;
    }
    else{
    }throw [400, 'No Events Based On This Filter']

}
async function getList(eventId: string){
    await events();
    let neweventId = new ObjectId(eventId)
    let requestedEvent = await collections.events?.findOne({_id: neweventId});
    if(requestedEvent===null) throw [400, 'Event Not Found']
    let arr = requestedEvent?.attendeesArr
    if(requestedEvent?.attendeesArr)
    {
        let finalDetails = []
    for(let i=0;i<requestedEvent?.attendeesArr?.length;i++)
    {
        let detailObj={"name": '', "email": '', "phone": 0}
        let details = await usersdata.getUser(requestedEvent?.attendeesArr[i])
        detailObj["name"] = details.name
        detailObj["email"] = details.email
        detailObj["phone"] = details.phone
        finalDetails.push(detailObj)
    }
    return finalDetails
    }
}
export default {
    createEvent,  //checked
    modifyEvent, 
    deleteEvent, //Checked
    getAllEvents, //checked
    addAttendee,//checked
    unRegister, //Checked
    getFreeEvents, //Checked
    addImage,
    addCohost,
    getByFilter,
    getbyId,
    removeCohost,
    getList
}