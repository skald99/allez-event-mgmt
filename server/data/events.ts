import { ObjectID } from "bson";

import { ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import { collections, users, events } from "../config/mongoCollections";
import * as mongoConnection from "../config/mongoConnection";
import { Event } from "../models/events.model";

async function createEvent(eventDetails: Event){

    // if (typeof(eventDetails.name)!='string') throw 'Error: Name Of The Event Is Not a String.'
    // if (typeof(eventDetails.category)!='string') throw 'Error: Category Of The Event Is Not a String.'
    // if (typeof(eventDetails.description)!='string') throw 'Error: Description Of The Event Is Not a String.'
    // if (typeof(eventDetails.totalSeats)!='number') throw 'Error: TotalSeats Of The Event Is Not a Number.'
    // if (typeof(eventDetails.price)!='number') throw 'Error: Price Of The Event Is Not a Number.'
    // if (typeof(eventDetails.bookedSeats)!='number') throw 'Error: Booked Seats Of The Event Is Not a Number.'
    // if (typeof(eventDetails.minAge)!='number') throw 'Error: Minimum Age Of The Event Is Not a Number.'

    // if (typeof(eventDetails.hostId)!='string') throw 'Error: Host ID Of The Event Is Not a String.'
    // // if (typeof(ObjectId(event.hostId))!='string') throw 'Error: Host ID Of The Event Is Not a ObjectID.'
    // if (typeof(eventDetails.venue.address)!='string') throw 'Error: Address Of The Venue Is Not a String.'
    // if (typeof(eventDetails.venue.city)!='string') throw 'Error: City Of The Venue Is Not a String.'
    // if (typeof(eventDetails.venue.state)!='string') throw 'Error: State Of The Venue Is Not a String.'
    // // if (typeof(eventDetails.venue.zip)!='string') throw 'Error: ZIP Of The Venue Is Not a String.'

    // if (typeof(eventDetails.venue.geoLocation.lat)!='number') throw 'Error: Latitude Of The GeoLocation Of The Event Is Not a Number.'
    // if (typeof(eventDetails.venue.geoLocation.long)!='number') throw 'Error: Longitude Of The GeoLocation Of The Event Is Not a Number.'
    // // if (typeof(eventDetails.eventTimeStamp)!='object') throw 'Error: Date Of The Event Is Invalid.'
    // let hostIdgen = 
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
    let created = await collections.events?.insertOne(newEvent)
    return created
}

async function modifyEvent(eventId: string | ObjectId, eventDetails: Event){

}


async function deleteEvent(eventId: string | ObjectId){
    eventId = new ObjectID(eventId)
    await events()
    let deletedEvent = await collections.events?.deleteOne({_id: eventId})
    if(deletedEvent?.deletedCount===0){
        throw [400, "Could Not Delete Event"]
    }
    // return requestedEvent;
    console.log(deletedEvent)
    return deletedEvent
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
    // if(requestedEvent===null) throw 'Error: No Events Found'
    // console.log(requestedEvent)
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
        //Already registered
        throw [400, "Cannot Add Co Host"]
    }
    return cohostUpdated
}
async function addAttendee(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();
    //Check a condition where all seats are booked
    let attendeeUpdated = await collections.events?.updateOne({_id: eventId},{$addToSet: {attendeesArr:userId}});
    console.log(attendeeUpdated)
    if(attendeeUpdated?.modifiedCount===0){
        //Already registered
        throw [400, "You Have Already Registered For The Event"]
    }
    else{
        await collections.events?.updateOne({_id:eventId}, {$inc:{bookedSeats: 1}})
        return "Attendee added successfully"
    }
    // return attendeeUpdated;
    
}
async function unRegister(eventId: string | ObjectId, userId: string){

    eventId = new ObjectId(eventId)
    await events();

    let removeAttendee = await collections.events?.updateOne({_id: eventId},{$pull: {attendeesArr:userId}})
    console.log(removeAttendee)
    if(removeAttendee?.modifiedCount===0) throw [400, "User Not Present"]
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
        console.log(requestedEvent)
        return requestedEvent;
    }
    else if(filters.city && filters.state){
        console.log("Only city, state")
        let requestedEvent = await collections.events?.find({"venue.city": filters.city, "venue.state": filters.state}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;
    } 
    else if(filters.city && filters.category){
        let requestedEvent = await collections.events?.find({"venue.city": filters.city, "category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;

    } 
    else if(filters.category && filters.state){
        let requestedEvent = await collections.events?.find({"venue.state": filters.state, "category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;

    } 
    else if(filters.city){
        console.log("Only city filter")
        let requestedEvent = await collections.events?.find({"venue.city": filters.city}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;
    } 
    else if(filters.state){
        let requestedEvent = await collections.events?.find({"venue.state": filters.state}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;

    } 
    else if(filters.category){
        let requestedEvent = await collections.events?.find({"category": filters.category}).toArray()
        if(requestedEvent == null) throw  [400, 'No Events Based On This Filter']
        console.log(requestedEvent)
        return requestedEvent;

    } 
    else{
        throw [400, 'No Events Based On This Filter']
    }

}
async function getbyId(ids: {eventId ?: string | ObjectId, hostId ?: string | ObjectId }){
    await events();
    console.log(ids)
    if(ids.eventId && ids.hostId){
        console.log("Both")
        let neweventId = new ObjectId(ids.eventId)
        let newhostId = new ObjectId(ids.hostId)
        let requestedEvent = await collections.events?.findOne({_id: neweventId, hostId: newhostId});
        if(requestedEvent===null) throw [400, 'Event Not Found With that ID And HostId']
        console.log(requestedEvent)
        return requestedEvent;

    }
    else if(ids.eventId){
        console.log("Only eventid")
        console.log(ids.eventId)
        let neweventId = new ObjectId(ids.eventId)
        console.log(neweventId)
        let requestedEvent = await collections.events?.findOne({_id: neweventId});
        console.log(requestedEvent)
        if(requestedEvent===null) throw [400, 'Event Not Found']
        console.log(requestedEvent)
        return requestedEvent;
    }
    else if(ids.hostId){
        console.log("Only hostId")
    let newhostId = new ObjectId(ids.hostId)
    let requestedEvent = await collections.events?.find({hostId: newhostId}).toArray();
    if(requestedEvent?.length===0){
        throw [400, "No Events By that Host Found"]
    }
    console.log(requestedEvent)
    return requestedEvent;
    }
    else{
        
    }throw [400, 'No Events Based On This Filter']

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
    removeCohost
}