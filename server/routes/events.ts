import express, { query } from 'express';

import { Event } from '../models/events.model';
const router = express.Router();
import data from "../data";
import { events } from '../config/mongoCollections';
const eventsData = data.eventsData;
const usersData = data.usersData;
export default router;



//create
//delete
//getall
//getbyid
//getbycatgory
//getbyhost
//getbycity
//getbystate
//addAttendee
//unregister


router.post('/create', async(req,res)=>{
    //Sample url:
    // http://localhost:4000/events/create
    let obj = req.body;
    obj.hostId = req.session.userId;
    // console.log(obj)
    try{
    let addEvent = await eventsData.createEvent(obj);
    let addEventInUserCollection = await usersData.addHostedEvent(req.session.userId, addEvent._id.toString());
    console.log(addEventInUserCollection);
    res.status(200).json({"success": true, "result": addEvent})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});

router.get('/', async(req, res)=>{
    //Sample urls:
    //localhost:3000/events?city=
    //localhost:3000/events?state=
    //localhost:3000/events?category=
    //localhost:3000/events/
       
    // if(req.query.city || req.query.state || req.query.category){
    //     try{
    //     let getFilterEvents = await eventsData.getByFilter(req.query)
    //     res.status(200).json({"success": false, "result": getFilterEvents});
    //     }
    //         catch(e: ?){
    //             res.status(e[0]).json({"success": false, "result": e[1]})
    //         }
    //     }
    //     else {
            //Getallevents
            console.log("No filters applied")
            try{
                let getAll = await eventsData.getAllEvents();
                res.status(200).json({"success": false, "result": getAll})
            }
            catch(e: ?){
                res.status(e[0]).json({"success": false, "result": e[1]})
            }
        // }
    
    });
    
router.get('/event', async (req, res)=>{
//Sample urls:
    // http://localhost:4000/events/event?hostId=62649c2fb9ee449215ca148c
    // http://localhost:4000/events/event?eventId=62649c2fb9ee449215ca148c
    if(req.query.eventId || req.query.hostId){
        try{
            let getById = await eventsData.getbyId(req.query)
            res.status(200).json({"success": false, "result": getById})
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

    let eventId = req.params.eventid
    let newUserid = req.session.userId;
    try{
        let addattendees = await eventsData.addAttendee(eventId, newUserid);
        let addEventInUserCollection = await usersData.addRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": addattendees})
    }
    catch(e: ?){
        res.status(400).json({"success": false, "result": e[1]})
    }

});

router.post('/event/:eventid/unregister', async function(req, res){

    let eventId = req.params.eventid
    let newUserid = req.session.userId;
    try{
        let unregister = await eventsData.unRegister(eventId, newUserid);
        let addEventInUserCollection = await usersData.deleteRegisteredEvent(newUserid, eventId);
        res.status(200).json({"success": true, "result": unregister})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
});

router.post('/event/:eventid/addcohost/:userid', async function(req, res){

    let eventId = req.params.eventid
    let newUserid = req.params.userid;
    let userId = req.session.userId;
    try{
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});

        if((userId != newUserid) && reqEvent) {
            let addCoHosts = await eventsData.addCohost(eventId, newUserid);
            let addEventInUserCollection = await usersData.addHostedEvent(newUserid, eventId);
            res.status(200).json({"success": true, "result": addCoHosts})
        }
        throw "user is already participating in the event";
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});
router.post('/event/:eventid/removecohost/:userid', async function(req, res){

    let eventId = req.params.eventid;
    let newUserid = req.params.userid;
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

});

router.delete('/event/:eventid', async function(req, res){

    let eventId = req.params.eventid;
    let userId = req.session.userId;
    
    try{
        let reqEvent = await eventsData.getbyId({eventId: eventId, hostId: userId});
        
        if(reqEvent) {
            let delEvent = await eventsData.deleteEvent(eventId);
            let delEventFromUserCollection = await usersData.deleteHostedEvent(req.session.userId, eventId);
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
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});