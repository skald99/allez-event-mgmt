import express, { query } from 'express';

import { Event } from '../models/events.model';
const router = express.Router();
import data from "../data";
import { events } from '../config/mongoCollections';
import { user } from 'firebase-functions/v1/auth';
const eventsData = data.eventsData;
const usersData = data.usersData;
export default router;
const xss = require('xss');

router.post('/create', async(req,res)=>{
    //Sample url:
    // http://localhost:4000/events/create
    try{
    let obj = req.body;
    if(req.session.userId){
        console.log("Nameeeeeeeee")
        console.log(req.session.userName)
        if(!obj.name.trim() || !obj.venue.address.trim() || !obj.venue.city.trim() || !obj.venue.state.trim() || !obj.venue.zip.trim()) throw [400, "Data Not In Right Format"]
        if( isNaN(Number(obj.totalSeats)) || isNaN(Number(obj.minAge)) || isNaN(Number(obj.venue.geoLocation.lat)) || isNaN(Number(obj.venue.geoLocation.long))) throw [400, "Data Not In Correct Format"]
        if( !isNaN(Number(obj.venue.address)) || !isNaN(Number(obj.venue.city)) || !isNaN(Number(obj.venue.state)) ) throw [400, "Data Not In Correct Format"]
        obj.name = xss(obj.name.trim())
        obj.price = xss(obj.price)
        obj.description = xss(obj.description.trim())
        obj.totalSeats = xss(Number(obj.totalSeats))
        obj.minAge = xss(Number(obj.minAge))
        obj.hostId = xss(req.session.userId);
        obj.venue.address = xss(obj.venue.address.trim())
        obj.venue.city = xss(obj.venue.city.trim())
        obj.venue.state = xss(obj.venue.state.trim())
        obj.venue.zip = xss(obj.venue.zip.trim())
        obj.venue.geoLocation.lat = xss(Number(obj.venue.geoLocation.lat))
        obj.venue.geoLocation.long = xss(Number(obj.venue.geoLocation.long))
        obj.eventTimeStamp = xss(obj.eventTimeStamp);
        let addEvent = await eventsData.createEvent(obj)
        let addEventInUserCollection = await usersData.addHostedEvent(xss(req.session.userId), xss(addEvent._id.toString()));
        res.status(200).json({"success": true, "result": addEvent, "hostName": req.session.userName})
        }
        else{
            res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
        catch(e: ?){
            console.log(e)
            res.status(e[0]).json({"success": false, "result": e[1]})
        }
    
   
});

router.get('/', async(req, res)=>{
   
            try{
                let getAll = await eventsData.getAllEvents();
                res.status(200).json({"success": false, "result": getAll})
            }
            catch(e: ?){
                res.status(e[0]).json({"success": false, "result": e[1]})
            }
    });
    
router.get('/event', async (req, res)=>{
//Sample urls:
    // http://localhost:4000/events/event?hostId=62649c2fb9ee449215ca148c
    // http://localhost:4000/events/event?eventId=62649c2fb9ee449215ca148c

    if(req.query.eventId?.toString().trim() || req.query.hostId?.toString().trim()){
        try{
            let obj = req.query;
            obj.eventId = xss(obj.eventId?.toString().trim())
            obj.hostId = xss(obj.hostId?.toString().trim())
            let getById = await eventsData.getbyId(obj)
            res.status(200).json({"success": true, "result": getById})
        }
        catch(e: ?){
            res.status(e[0]).json({"success": false, "result": e[1]})
        }
    }
});

router.get('/free', async (req, res)=>{
    // Sample urls:
    // http://localhost:4000/events/free
            try{
                let getFree = await eventsData.getFreeEvents()
                res.status(200).json({"success": false, "result": getFree})
            }
            catch(e: ?){
                res.status(e[0]).json({"success": false, "result": e[1]})
            }
    });

router.post('/event/:eventid/register', async function(req, res){
    try{
        if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
        if(!req.params.eventid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid.trim())

    if(req.session.userId){
    let newUserid = xss(req.session.userId);
        let addattendees = await eventsData.addAttendee(eventId, newUserid);
        let addEventInUserCollection = await usersData.addRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": addattendees, "hostName": req.session.userName})
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        res.status(400).json({"success": false, "result": e[1]})
    }
});

router.post('/event/:eventid/unregister', async function(req, res){
    try{
        if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
    if(!req.params.eventid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid)

    if(req.session.userId){
    let newUserid = xss(req.session.userId)
   
        let unregister = await eventsData.unRegister(eventId, newUserid);
        let addEventInUserCollection = await usersData.deleteRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": unregister, "hostName": req.session.userName})
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }


});

router.post('/event/:eventid/addcohost/:userid', async function(req, res){
    try{
        if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
        if(!/[0-9A-Fa-f]{24}/.test(req.params.userid.trim())) throw "Provided id is not a valid ObjectId";
    if(!req.params.eventid.trim() || !req.params.userid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid.trim())
    let newUserid = xss(req.params.userid.trim());

    if(req.session.userId){
    let userId = xss(req.session.userId.trim())
    
        if(userId===newUserid) {
            res.status(400).json({"success": false, "result": "You're The Host Already"})
            return;
        }
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});

        if((userId != newUserid) && reqEvent) {
            let addCoHosts = await eventsData.addCohost(eventId, newUserid);
            let addEventInUserCollection = await usersData.addHostedEvent(newUserid, eventId);
            res.status(200).json({"success": true, "result": addCoHosts, "hostName": req.session.userName})
        }
        // res.status(400).json({"success": false, "result": "User is already a co host"})
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        console.log(e)
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
});

router.post('/event/:eventid/modify', async function(req, res){
    try{
    if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
    if(!req.params.eventid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid.trim())

    if(req.session.userId){
    let userId = xss(req.session.userId);
    let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});
    if(reqEvent) {
    let obj = req.body
    if(!obj.name.trim() || !obj.venue.address.trim() || !obj.venue.city.trim() || !obj.venue.state.trim() || !obj.venue.zip.trim()) throw [400, "Data Not In Right Format"]
    if( isNaN(Number(obj.totalSeats)) || isNaN(Number(obj.minAge)) || isNaN(Number(obj.venue.geoLocation.lat)) || isNaN(Number(obj.venue.geoLocation.long))) throw [400, "Data Not In Correct Format"]
    if( !isNaN(Number(obj.venue.address)) || !isNaN(Number(obj.venue.city)) || !isNaN(Number(obj.venue.state)) ) throw [400, "Data Not In Correct Format"]
        obj.name = xss(obj.name.trim())
        obj.price = xss(obj.price)
        obj.description = xss(obj.description.trim())
        obj.totalSeats = xss(obj.totalSeats)
        obj.bookedSeats = xss(obj.bookedSeats)
        obj.minAge = xss(obj.minAge)
        obj.hostId = xss(req.session.userId);
        obj.venue.address = xss(obj.venue.address.trim())
        obj.venue.city = xss(obj.venue.city.trim())
        obj.venue.state = xss(obj.venue.state.trim())
        obj.venue.zip = xss(obj.venue.zip.trim())
        obj.venue.geoLocation.lat = xss(obj.venue.geoLocation.lat)
        obj.venue.geoLocation.long = xss(obj.venue.geoLocation.long)
        obj.eventTimeStamp = xss(obj.eventTimeStamp);
        // obj.hostName = xss(req.session.userName)
        let modEvent = await eventsData.modifyEvent(eventId, obj);
        res.status(200).json({"success": true, "result": modEvent, "hostName": req.session.userName})
        }
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        console.log(e)
        res.status(400).json({"success": false, "result": e[1]})
    }


});

router.post('/event/:eventid/removecohost/:userid', async function(req, res){
    try{
        if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
        if(!/[0-9A-Fa-f]{24}/.test(req.params.userid.trim())) throw "Provided id is not a valid ObjectId";
    if(!req.params.eventid.trim() || !req.params.userid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid.trim());
    let newUserid = xss(req.params.userid.trim());

    if(req.session.userId){
    let userId = xss(req.session.userId);
    let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});

    if(reqEvent) {
            let remcohost = await eventsData.removeCohost(eventId, newUserid);
            let delEventFromUserCollection = await usersData.deleteHostedEvent(newUserid, eventId);
            res.status(200).json({"success": true, "result": remcohost, "hostName": req.session.userName})
        }
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
});

router.delete('/event/:eventid', async function(req, res){
    try{
    if(!/[0-9A-Fa-f]{24}/.test(req.params.eventid.trim())) throw "Provided id is not a valid ObjectId";
    if(!req.params.eventid.trim()) throw [400, 'Data Not In Right Format']
    let eventId = xss(req.params.eventid.trim());

    if(req.session.userId){
    let userId = xss(req.session.userId);
    let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});
    if(reqEvent) {
            let delEvent = await eventsData.deleteEvent(eventId);
            let delEventFromUserCollection = await usersData.deleteHostedEvent(userId, eventId);
            if(delEvent.cohostArr) {
                for(let i=0; i<delEvent.cohostArr.length; i++){
                    let delEventFromRegisteredCollection = await usersData.deleteHostedEvent(xss(delEvent.cohostArr[i]), eventId);
                }
            }
            if(delEvent.attendeesArr) {
                for(let i=0; i<delEvent.attendeesArr.length; i++){
                    let delEventFromRegisteredCollection = await usersData.deleteRegisteredEvent(xss(delEvent.attendeesArr[i]), eventId);
                }
            }
            res.status(200).json({"success": true, "result": delEvent, "hostName": req.session.userName})
        }
        
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
}
    catch(e: ?){
        console.log(e)
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
});