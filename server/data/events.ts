import { GridFSBucket, GridFSFile, GridFSBucketReadStream } from "mongodb";
import { ObjectId } from "mongodb";
import { collections, users, events, eventImages, imageChunks } from "../config/mongoCollections";
import { Event } from "../models/events.model";
import { Chunk } from "../models/chunks.model";
import usersdata from "./users";
import paymentsData from "./payments"
import { connectDB } from "../config/mongoConnection";
const config = process.env


async function createEvent(eventDetails: Event) {

    if(typeof(eventDetails.name)!='string' || typeof(eventDetails.venue.address)!='string' || typeof(eventDetails.venue.city)!='string'||
    typeof(eventDetails.venue.state)!='string' || typeof(eventDetails.venue.zip)!='string' || typeof(eventDetails.venue.city)!='string'
    ) throw [400, "Event Details Mgiht Not Be String Where Expected"]

    if (!eventDetails.name.trim() || !eventDetails.venue.address.trim() || !eventDetails.venue.city.trim() || 
    !eventDetails.venue.state.trim() || 
    !eventDetails.venue.zip.trim()) throw [400, "Event Details Might Be Empty Strings"]

    if (isNaN(Number(eventDetails.totalSeats)) || 
    isNaN(Number(eventDetails.minAge)) || 
    isNaN(Number(eventDetails.venue.geoLocation.lat)) ||
     isNaN(Number(eventDetails.venue.geoLocation.long)) ||
     isNaN(Number(eventDetails.venue.zip))) throw [400, "Events Data Might Not Be Number Where Expected"]

    if (!isNaN(Number(eventDetails.venue.address)) || !isNaN(Number(eventDetails.venue.city)) || 
    !isNaN(Number(eventDetails.venue.state))) throw [400, "Event Details Might Be A Number Where Expected A String."]

    let newEvent: Event = {
        "eventImgs": eventDetails.eventImgs,
        "name": eventDetails.name.trim(),
        "category": eventDetails.category,
        "price": Number(eventDetails.price),
        "description": eventDetails.description.trim(),
        "totalSeats": Number(eventDetails.totalSeats),
        "bookedSeats": 0,
        "minAge": Number(eventDetails.minAge),
        "hostId": eventDetails.hostId.toString().trim(),
        "cohostArr": [],
        "attendeesArr": [],
        "venue": {
            "address": eventDetails.venue.address.trim(),
            "city": eventDetails.venue.city.trim(),
            "state": eventDetails.venue.state.trim(),
            "zip": eventDetails.venue.zip.trim(),
            "geoLocation": { lat: Number(eventDetails.venue.geoLocation.lat), long: Number(eventDetails.venue.geoLocation.long) }
        },
        "eventTimeStamp": eventDetails.eventTimeStamp
    }
    await events()
    let created = await collections.events?.insertOne(newEvent);
    let insertedEvent = await collections.events?.findOne({ _id: created?.insertedId });
    if (insertedEvent) insertedEvent._id = insertedEvent._id.toString();
    else throw [500, "Event is not inserted properly"];
    let addEvent = await paymentsData.addEvent(insertedEvent)
    if (addEvent) {
        let addPrice = await paymentsData.addEventRegFee(insertedEvent._id, Number(eventDetails.price))
    }
    return insertedEvent;

}

async function modifyEvent(eventId: string | ObjectId, eventDetails: Event) {

    if(typeof(eventDetails.name)!='string' || typeof(eventDetails.venue.address)!='string' || typeof(eventDetails.venue.city)!='string'||
    typeof(eventDetails.venue.state)!='string' || typeof(eventDetails.venue.city)!='string' || typeof(eventDetails.venue.zip)!='string'
    ) throw [400, "Event Details Mgiht Not Be String Where Expected"]

    if (!eventDetails.name.trim() || !eventDetails.venue.address.trim() || !eventDetails.venue.city.trim() ||
     !eventDetails.venue.state.trim() || !eventDetails.venue.zip.trim()) throw [400, "Event Details Might Be Empty Strings"]

    if (isNaN(Number(eventDetails.totalSeats)) ||
     isNaN(Number(eventDetails.minAge)) ||
      isNaN(Number(eventDetails.venue.geoLocation.lat)) ||
     isNaN(Number(eventDetails.venue.geoLocation.long)) ||
     isNaN(Number(eventDetails.venue.zip))
     ) throw [400, "Events Data Might Not Be Number Where Expected"]

    if (!isNaN(Number(eventDetails.venue.address)) || !isNaN(Number(eventDetails.venue.city)) || 
    !isNaN(Number(eventDetails.venue.state))) throw [400, "Event Details Might Be A Number Where Expected A String."]

    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]

    
    eventId = new ObjectId(eventId.toString().trim())
    let newEvent: Event = {
        "eventImgs": eventDetails.eventImgs,
        "name": eventDetails.name.trim(),
        "category": eventDetails.category,
        "price": Number(eventDetails.price),
        "description": eventDetails.description.trim(),
        "totalSeats": Number(eventDetails.totalSeats),
        "bookedSeats": Number(eventDetails.bookedSeats),
        "minAge": Number(eventDetails.minAge),
        "hostId": eventDetails.hostId,
        "cohostArr": eventDetails.cohostArr,
        "attendeesArr": eventDetails.attendeesArr,
        "venue": {
            "address": eventDetails.venue.address.trim(),
            "city": eventDetails.venue.city.trim(),
            "state": eventDetails.venue.state.trim(),
            "zip": eventDetails.venue.zip.trim(),
            "geoLocation": { lat: Number(eventDetails.venue.geoLocation.lat), long: Number(eventDetails.venue.geoLocation.long) }
        },
        "eventTimeStamp": eventDetails.eventTimeStamp
    }
    await events()
    let eventUpdated = await collections.events?.updateOne({ _id: eventId }, { $set: newEvent });

    if (eventUpdated?.modifiedCount === 0) {
        throw [400, "Cannot Update Event"]
    }
    let requestedEvent = await collections.events?.findOne({ _id: eventId });
    if(requestedEvent){
    let modifiedEvent: Event = {
        "_id": requestedEvent._id,
        "eventImgs": requestedEvent?.eventImgs,
        "name": requestedEvent?.name,
        "category": requestedEvent?.category,
        "price": Number(requestedEvent?.price),
        "description": requestedEvent?.description.trim(),
        "totalSeats": Number(requestedEvent?.totalSeats),
        "bookedSeats": Number(requestedEvent?.bookedSeats),
        "minAge": Number(requestedEvent?.minAge),
        "hostId": requestedEvent?.hostId,
        "cohostArr": requestedEvent?.cohostArr,
        "attendeesArr": requestedEvent?.attendeesArr,
        "venue": {
            "address": requestedEvent?.venue.address.trim(),
            "city": requestedEvent?.venue.city.trim(),
            "state": requestedEvent?.venue.state.trim(),
            "zip": requestedEvent?.venue.zip.trim(),
            "geoLocation": { lat: Number(requestedEvent?.venue.geoLocation.lat), long: Number(requestedEvent?.venue.geoLocation.long) }
        },
        "eventTimeStamp": requestedEvent?.eventTimeStamp
    }
    let modifyStripe = await paymentsData.modifyEvent(modifiedEvent)
}
    return "Updated The Event Successfully"
}

async function deleteEvent(eventId: string | ObjectId) {
    if (!/[0-9A-Fa-f]{24}/.test(eventId.toString().trim())) throw "Provided id is not a valid ObjectId";
    eventId = new ObjectId(eventId.toString().trim())
    await events()
    let removingEvent = await collections.events?.findOne({ _id: eventId });
    if (removingEvent) removingEvent._id = removingEvent._id.toString();
    else throw [404, "There is no event with the requested id"];

    let deletedEvent = await collections.events?.deleteOne({ _id: eventId })
    if (deletedEvent?.deletedCount === 0) {
        throw [500, "Could Not Delete Event"]
    }
    return removingEvent
}

async function getAllEvents() {
    await events();
    let requestedEvent = await collections.events?.find().toArray();
    if (requestedEvent?.length === 0) {
        throw [404, "No Events Found"]
    }

    for (let event of requestedEvent!) {
        let imageUrls: string[] = []
        if (event?.eventImgs) {
            let imgIds: string[] = event?.eventImgs
            imageUrls = await populateImageUrl(imgIds)
        }
        event!.eventImgs = imageUrls
    }
    return requestedEvent;

}

async function getFreeEvents() {
    await events();
    let freeEvents = await collections.events?.find({ price: 0 }).toArray();
    if (freeEvents?.length === 0) {
        throw [404, "No Free Events"]
    }
    for (let event of freeEvents!) {
        let imageUrls: string[] = []
        if (event?.eventImgs) {
            let imgIds: string[] = event?.eventImgs
            imageUrls = await populateImageUrl(imgIds)
        }
        event!.eventImgs = imageUrls
    }
    return freeEvents

}
async function addCohost(eventId: string | ObjectId, userId: string) {
    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]
    if(!ObjectId.isValid(userId.toString())) throw [400, "User ID Is Invalid"]
    eventId = new ObjectId(eventId.toString().trim())
    await events();
    let cohostUpdated = await collections.events?.updateOne({ _id: eventId }, { $addToSet: { cohostArr: userId.toString().trim() } });
    if (cohostUpdated?.modifiedCount === 0) {
        throw [500, "Cannot Add Co Host"]
    }
    return cohostUpdated
}

async function addAttendee(eventId: string | ObjectId, userId: string) {
    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]
    if(!ObjectId.isValid(userId.toString())) throw [400, "User ID Is Invalid"]
    let userData = await usersdata.getUser(userId.toString().trim())
    let dob = userData.dateOfBirth
    let ageInYears = new Date().getFullYear() - new Date(dob).getFullYear();
    eventId = new ObjectId(eventId.toString().trim())
    await events();
    let requestedEvent = await collections.events?.findOne({ _id: eventId })
    
    if (!requestedEvent) throw [400, "Event Not Found"]
    if(ageInYears<requestedEvent?.minAge) throw [400, "You Do Not Meet The Minimum Age Requirements To Attend This Event."]
    if (requestedEvent?.totalSeats === requestedEvent?.bookedSeats) {
        throw [400, 'Event Is Full Already']
    }
    if (userId === requestedEvent?.hostId) {
        throw [400, "You're the Host"]
    }
    if (requestedEvent?.cohostArr?.includes(userId)) {
        throw [400, "You're A Cohost"]
    }
    else {

        let attendeeUpdated = await collections.events?.updateOne({ _id: eventId }, { $addToSet: { attendeesArr: userId.toString().trim() } });
        if (attendeeUpdated?.modifiedCount === 0) {
            throw [400, "You Have Already Registered For The Event"]
        }
        else {
            console.log("Attendee added")
            let updateCount = await collections.events?.updateOne({ _id: eventId }, { $inc: { bookedSeats: 1 } })
            return "Attendee added successfully"
        }
    }
}


async function unRegister(eventId: string | ObjectId, userId: string) {
    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]
    if(!ObjectId.isValid(userId.toString())) throw [400, "User ID Is Invalid"]
    eventId = new ObjectId(eventId.toString().trim())
    await events();
    let removeAttendee = await collections.events?.updateOne({ _id: eventId }, { $pull: { attendeesArr: userId.toString().trim() } })
    if (removeAttendee?.modifiedCount === 0) throw [404, "User/Event Not Present"]
    else {
        await collections.events?.updateOne({ _id: eventId }, { $inc: { bookedSeats: -1 } })
        return "Attendee unregistered successfully"
    }
}


async function removeCohost(eventId: string | ObjectId, userId: string) {
    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]
    if(!ObjectId.isValid(userId.toString())) throw [400, "User ID Is Invalid"]
    eventId = new ObjectId(eventId.toString().trim())
    await events();
    let remCohost = await collections.events?.updateOne({ _id: eventId }, { $pull: { cohostArr: userId.toString().trim() } })
    if (remCohost?.modifiedCount === 0) throw [400, "Cohost/Event Not Present"]
    return "Cohost removed successfully"
}


async function getbyId(ids: { eventId?: string | ObjectId, hostId?: string | ObjectId }) {
    // cursor.forEach((file => {
    //     file.
    // }))

    await events();
    if (ids.eventId && ids.hostId) {
        if(!ObjectId.isValid(ids.eventId.toString())) throw [400, "Event ID Is Invalid"]
        if(!ObjectId.isValid(ids.hostId.toString())) throw [400, "Host ID Is Invalid"]
        let neweventId = new ObjectId(ids.eventId.toString().trim())
        let newhostId = ids.hostId.toString().trim();
        let requestedEvent = await collections.events?.findOne({ _id: neweventId, hostId: newhostId });
        if (requestedEvent === null) throw [400, 'Event Not Found With that ID And HostId']
        let imageUrls: string[] = []
        if (requestedEvent?.eventImgs) {
            let imgIds: string[] = requestedEvent?.eventImgs
            imageUrls = await populateImageUrl(imgIds)
        }
        requestedEvent!.eventImgs = imageUrls
        return requestedEvent;

    }
    else if (ids.eventId) {
        let imageUrls: string[] = []
        if(!ObjectId.isValid(ids.eventId.toString())) throw [400, "Event ID Is Invalid"]

        let neweventId = new ObjectId(ids.eventId.toString().trim())

        let requestedEvent = await collections.events?.findOne({ _id: neweventId });

        requestedEvent!._id = requestedEvent!._id.toString()
        // requestedEvent.
        if (requestedEvent === null) throw [400, 'Event Not Found'];
        if (requestedEvent?.eventImgs) {
            let imgIds: string[] = requestedEvent?.eventImgs
            imageUrls = await populateImageUrl(imgIds)
        }
        requestedEvent!.eventImgs = imageUrls
        return requestedEvent
        
    }
    else if (ids.hostId) {
        if(!ObjectId.isValid(ids.hostId.toString())) throw [400, "Host ID Is Invalid"]
        let newhostId = ids.hostId.toString().trim();
        let requestedEvent = await collections.events?.find({ hostId: newhostId }).toArray();
        if (requestedEvent?.length === 0) {
            throw [400, "No Events By that Host Found"]
        }
        for (let event of requestedEvent!) {
            let imageUrls: string[] = []
            if (event?.eventImgs) {
                let imgIds: string[] = event?.eventImgs
                imageUrls = await populateImageUrl(imgIds)
            }
            event!.eventImgs = imageUrls
        }
        return requestedEvent;
    }
    else {
    } throw [404, 'No Events Based On This Filter']

}
async function getAttendees(eventId: string) {
    if(!ObjectId.isValid(eventId.toString())) throw [400, "Event ID Is Invalid"]
    await events();
    let neweventId = new ObjectId(eventId.toString().trim())
    let requestedEvent = await collections.events?.findOne({ _id: neweventId });
    if (requestedEvent === null) throw [404, 'Event Not Found']
    let arr = requestedEvent?.attendeesArr
    if (requestedEvent?.attendeesArr) {
        let finalDetails = []
        for (let i = 0; i < requestedEvent?.attendeesArr?.length; i++) {
            let detailObj = { "name": '', "email": '', "phone": 0 }
            let details = await usersdata.getUser(requestedEvent?.attendeesArr[i])
            detailObj["name"] = details.name
            detailObj["email"] = details.email
            detailObj["phone"] = details.phone
            finalDetails.push(detailObj)
        }
        return finalDetails
    }
    else{
        return 'No Attendees'
    }
}

async function populateImageUrl(imgIds: string[]) {
    let result: string[] = []
    let bucketName = config.IMAGE_BUCkET
    const db = await connectDB()
    const bucket = new GridFSBucket(db, {
        bucketName: bucketName,
    });
    for (let id of imgIds) {
        let objId = new ObjectId(id)
        let fileUrl: string = ""

        let files: GridFSFile[] = await bucket.find({ _id: objId }).toArray()
        await imageChunks()
        if(files.length===0) return []
        let chunks: Chunk[] = await collections.chunks!.find({ files_id: files![0]._id }).toArray()
        let fileData = []
        for (let chunk of chunks!) {
            fileData.push(chunk.data.toString('base64'))
        }
        fileUrl = fileUrl + 'data:' + files![0].contentType + ';base64,' + fileData.join('');
        result.push(fileUrl)

    }
    return result
}

export default {
    createEvent,
    modifyEvent,
    deleteEvent,
    getAllEvents,
    addAttendee,
    unRegister,
    getFreeEvents,
    addCohost,
    getbyId,
    removeCohost,
    getAttendees
}