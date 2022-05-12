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
    let obj = req.body;
    if(req.session.userId){
        obj.name = xss(obj.name.trim())
        obj.price = xss(obj.price)
        obj.description = xss(obj.description.trim())
        obj.totalSeats = xss(Number(obj.totalSeats))
        obj.bookedSeats = xss(Number(obj.bookedSeats))
        obj.minAge = xss(Number(obj.minAge))
        obj.hostId = xss(req.session.userId.trim());
        obj.venue.address = xss(obj.venue.address.trim())
        obj.venue.city = xss(obj.venue.city.trim())
        obj.venue.state = xss(obj.venue.state.trim())
        obj.venue.zip = xss(Number(obj.venue.zip))
        obj.venue.geoLocation.lat = xss(Number(obj.venue.geoLocation.lat))
        obj.venue.geoLocation.long = xss(Number(obj.venue.geoLocation.long))
        obj.eventTimeStamp = xss(obj.eventTimeStamp);
        try{
        let addEvent = await eventsData.createEvent(obj)
        // console.log("After")
        // console.log(addEvent)
        let addEventInUserCollection = await usersData.addHostedEvent(xss(req.session.userId), xss(addEvent._id.toString()));
        console.log(addEventInUserCollection);
        res.status(200).json({"success": true, "result": addEvent})
        }
        catch(e: ?){
            res.status(e[0]).json({"success": false, "result": e[1]})
        }
    }
    else{
            res.status(400).json({"success": false, "result": "User Not Logged In"})
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

    let eventId = xss(req.params.eventid.trim())
    if(req.session.userId){
    let newUserid = xss(req.session.userId.trim());
    try{
       
        let addattendees = await eventsData.addAttendee(eventId, newUserid);
        let addEventInUserCollection = await usersData.addRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": addattendees})
    }
    catch(e: ?){
        res.status(400).json({"success": false, "result": e[1]})
    }
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
});

router.post('/event/:eventid/unregister', async function(req, res){

    let eventId = xss(req.params.eventid)
    if(req.session.userId){
    let newUserid = xss(req.session.userId)
    try{
        let unregister = await eventsData.unRegister(eventId, newUserid);
        let addEventInUserCollection = await usersData.deleteRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": unregister})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
}
else{
    res.status(400).json({"success": false, "result": "User Not Logged In"})
}
});

router.post('/event/:eventid/addcohost/:userid', async function(req, res){

    let eventId = xss(req.params.eventid.trim())
    let newUserid = xss(req.params.userid.trim());
    if(req.session.userId){
    let userId = xss(req.session.userId.trim())
    try{
        console.log(eventId)
        console.log(newUserid)
        console.log(typeof(eventId))
        console.log(typeof(newUserid))
        if(userId===newUserid) {
            res.status(400).json({"success": false, "result": "You're The Host Already"})
            return;
        }
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});

        if((userId != newUserid) && reqEvent) {
            let addCoHosts = await eventsData.addCohost(eventId, newUserid);
            let addEventInUserCollection = await usersData.addHostedEvent(newUserid, eventId);
            console.log(addEventInUserCollection)
            res.status(200).json({"success": true, "result": addCoHosts})
        }
        // res.status(400).json({"success": false, "result": "User is already a co host"})
    }
    catch(e: ?){
        console.log(e)
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
}
else{
    res.status(400).json({"success": false, "result": "User Not Logged In"})
}
});

router.post('/event/:eventid/modify', async function(req, res){

    let eventId = xss(req.params.eventid.trim())
    if(req.session.userId){
    let userId = xss(req.session.userId);
    let obj = req.body
    obj.name = xss(obj.name.trim())
        obj.price = xss(obj.price)
        obj.description = xss(obj.description.trim())
        obj.totalSeats = xss(obj.totalSeats)
        obj.bookedSeats = xss(obj.bookedSeats)
        obj.minAge = xss(obj.minAge)
        obj.hostId = xss(req.session.userId.trim());
        obj.venue.address = xss(obj.venue.address.trim())
        obj.venue.city = xss(obj.venue.city.trim())
        obj.venue.state = xss(obj.venue.state.trim())
        obj.venue.zip = xss(obj.venue.zip)
        obj.venue.geoLocation.lat = xss(obj.venue.geoLocation.lat)
        obj.venue.geoLocation.long = xss(obj.venue.geoLocation.long)
        obj.eventTimeStamp = xss(obj.eventTimeStamp);
    try{
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});
        if(reqEvent) {
            let modEvent = await eventsData.modifyEvent(eventId, obj);
            res.status(200).json({"success": true, "result": modEvent})
        }
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
}
else{
    res.status(400).json({"success": false, "result": "User Not Logged In"})
}
});
router.post('/event/:eventid/removecohost/:userid', async function(req, res){

    let eventId = req.params.eventid;
    let newUserid = req.params.userid;
    if(req.session.userId){
    let userId = req.session.userId;
    try{
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});

        if(reqEvent) {
            let remcohost = await eventsData.removeCohost(eventId, newUserid);
            let delEventFromUserCollection = await usersData.deleteHostedEvent(newUserid, eventId);
            res.status(200).json({"success": true, "result": remcohost})
        }
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
}
else{
    res.status(400).json({"success": false, "result": "User Not Logged In"})
}
});

router.delete('/event/:eventid', async function(req, res){

    let eventId = xss(req.params.eventid.trim());
    if(req.session.userId){
    let userId = xss(req.session.userId.trim());
    console.log(eventId)
    console.log(userId)
    try{
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});
        console.log(reqEvent)
        if(reqEvent) {
            let delEvent = await eventsData.deleteEvent(eventId);
            let delEventFromUserCollection = await usersData.deleteHostedEvent(userId, eventId);
            if(delEvent.cohostArr) {
                for(let i=0; i<delEvent.cohostArr.length; i++){
                    let delEventFromRegisteredCollection = await usersData.deleteHostedEvent(delEvent.cohostArr[i], userId);
                }
            }
            if(delEvent.attendeesArr) {
                for(let i=0; i<delEvent.attendeesArr.length; i++){
                    let delEventFromRegisteredCollection = await usersData.deleteRegisteredEvent(delEvent.attendeesArr[i], userId);
                }
            }
            res.status(200).json({"success": true, "result": delEvent})
        }
        
    }
    catch(e: ?){
        console.log(e)
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
    }
    else{
        res.status(400).json({"success": false, "result": "User Not Logged In"})
    }
});