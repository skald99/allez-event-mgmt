import express, { query } from 'express';

import { Event } from '../models/events.model';
const router = express.Router();
import data from "../data";
import { events } from '../config/mongoCollections';
const eventsData = data.eventsData;
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

    let event = req.params.eventid
    let newUserid = req.session.userId;
    try{
        let addattendees = await eventsData.addAttendee(event, newUserid);
        res.status(200).json({"success": true, "result": addattendees})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});

router.post('/event/:eventid/unregister/', async function(req, res){

    let event = req.params.eventid
    let newUserid = req.session.userId;
    try{
        let unregister = await eventsData.unRegister(event, newUserid);
        res.status(200).json({"success": true, "result": unregister})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }
});

router.post('/event/:eventid/addcohost', async function(req, res){

    let event = req.params.eventid
    let newUserid = req.session.userId;
    try{
        let addCoHosts = await eventsData.addCohost(event, newUserid);
        res.status(200).json({"success": true, "result": addCoHosts})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});
router.post('/event/:eventid/removecohost/:userid', async function(req, res){

    let event = req.params.eventid
    let newUserid = req.params.userid
    try{
        let remcohost = await eventsData.removeCohost(event, newUserid);
        res.status(200).json({"success": true, "result": remcohost})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});

router.delete('/event/:eventid', async function(req, res){

    let event = req.params.eventid
    
    try{
        let delEvent = await eventsData.deleteEvent(event)
        res.status(200).json({"success": true, "result": delEvent})
    }
    catch(e: ?){
        res.status(e[0]).json({"success": false, "result": e[1]})
    }

});