import express, { query } from 'express';

import multer, { FileFilterCallback } from "multer"
import { Request, Response } from 'express';
import { Event } from '../models/events.model';
import { connectDB } from "../config/mongoConnection";
import { GridFSBucket, GridFSFile, GridFSBucketReadStream } from "mongodb";
import { ObjectId } from "mongodb";
import { GridFile, GridFsStorage, UrlStorageOptions } from 'multer-gridfs-storage'
const router = express.Router();
import data from "../data";
import { collections, events, imageChunks } from '../config/mongoCollections';
import { user } from 'firebase-functions/v1/auth';
import { BucketBuilder } from 'firebase-functions/v1/storage';
const eventsData = data.eventsData;
const usersData = data.usersData;
const config = process.env
export default router;
const xss = require('xss');

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileStorageEngine = new GridFsStorage({
    url: config.uri!,
    file: (req, file) => {
        return {
            bucketName: config.IMAGE_BUCKET,
            filename: `${Date.now()}-image-${file.originalname}`,
        };
    },
});

const upload = multer({ storage: fileStorageEngine });


router.post('/create', upload.any(), async (req, res) => {


    // http://localhost:4000/events/create
    let obj: Event = req.body;
    if (req.session.userId) obj.hostId = req.session.userId?.toString();
    let imgArr: string[] = []
    if (req.files) {
        let inputFiles: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] = req.files;
        if (Array.isArray(inputFiles)) {
            for (let index in inputFiles)
                imgArr.push(inputFiles[index].id.toString());
        }
    }
    console.log(imgArr)
    obj.eventImgs = imgArr
    // console.log(obj)
    try {
        if (req.session.userId) {
            obj = validateEvent(obj)
            obj.hostId = xss(req.session.userId);
            let addEvent = await eventsData.createEvent(obj)
            let addEventInUserCollection = await usersData.addHostedEvent(xss(req.session.userId), xss(addEvent._id.toString()));
            res.status(200).json({ "success": true, "result": addEvent, "hostName": req.session.userName })
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        console.log(e)
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }


});

router.get('/', async (req, res) => {

    try {
        let getAll = await eventsData.getAllEvents();
        res.status(200).json({ "success": false, "result": getAll })
    }
    catch (e: ?) {
        console.log(e)
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }
});

router.get('/event', async (req, res) => {
    //Sample urls:
    // http://localhost:4000/events/event?hostId=62649c2fb9ee449215ca148c
    // http://localhost:4000/events/event?eventId=62649c2fb9ee449215ca148c

    if (req.query.eventId?.toString().trim() || req.query.hostId?.toString().trim()) {
        try {

            let obj = req.query;
            obj.eventId = xss(obj.eventId?.toString().trim())
            obj.hostId = xss(obj.hostId?.toString().trim())
            //
            // if(!ObjectId.isValid(eventId)) throw [400, "Event ID Is Invalid"]
            if (obj.eventId) {
                if (!ObjectId.isValid(obj.eventId.toString())) throw [400, "Event ID Is Invalid"]
            }
            if (obj.hostId) {
                if (!ObjectId.isValid(obj.hostId.toString())) throw [400, "Host ID Is Invalid"]
            }
            console.log('test')
            let getById = await eventsData.getbyId(obj)
            return res.status(200).json({ "success": true, "result": getById })
        }
        catch (e: ?) {
            console.log(e)
            return res.status(400).json({ "success": false, "result": e[1] })
        }
    }
});

router.get('/free', async (req, res) => {
    // Sample urls:
    // http://localhost:4000/events/free
    try {
        let getFree = await eventsData.getFreeEvents()
        res.status(200).json({ "success": false, "result": getFree })
    }
    catch (e: ?) {
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }
});

router.post('/event/register/:eventid', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]

        if (!req.params.eventid.trim()) throw [400, 'Event ID Might Be Empty String']

        let eventId = xss(req.params.eventid.trim())

        if (req.session.userId) {
            let newUserid = xss(req.session.userId);
            let addattendees = await eventsData.addAttendee(eventId, newUserid);
            let addEventInUserCollection = await usersData.addRegisteredEvent(newUserid, eventId);
            res.status(200).json({ "success": true, "result": addattendees, "hostName": req.session.userName })
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        res.status(400).json({ "success": false, "result": e[1] })
    }
});

router.post('/event/unregister/:eventid', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]
        if (!req.params.eventid.trim()) throw [400, 'Event ID Might Be Empty String']
        let eventId = xss(req.params.eventid.trim())

        if (req.session.userId) {
            let newUserid = xss(req.session.userId)

            let unregister = await eventsData.unRegister(eventId, newUserid);
            let addEventInUserCollection = await usersData.deleteRegisteredEvent(newUserid, eventId);
            res.status(200).json({ "success": true, "result": unregister, "hostName": req.session.userName })
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }


});

router.post('/event/:eventid/addcohost/:userid', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]
        if (!ObjectId.isValid(req.params.userid.toString())) throw [400, "User ID Is Invalid"]

        if (!req.params.eventid.trim() || !req.params.userid.trim()) throw [400, 'Event ID Or User ID Might Be Empty Strings']
        let eventId = xss(req.params.eventid.trim())
        let newUserid = xss(req.params.userid.trim());

        if (req.session.userId) {
            let userId = xss(req.session.userId.trim())

            if (userId === newUserid) {
                res.status(400).json({ "success": false, "result": "You're The Host Already" })
                return;
            }
            let reqEvent = await eventsData.getbyId({ eventId: eventId, hostId: userId });

            if ((userId != newUserid) && reqEvent) {
                let addCoHosts = await eventsData.addCohost(eventId, newUserid);
                let addEventInUserCollection = await usersData.addHostedEvent(newUserid, eventId);
                res.status(200).json({ "success": true, "result": addCoHosts, "hostName": req.session.userName })
            }
            // res.status(400).json({"success": false, "result": "User is already a co host"})
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        console.log(e)
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }
});

router.post('/event/:eventid/modify', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]
        if (!req.params.eventid.trim()) throw [400, 'Event ID Might Be Empty String']
        let eventId = xss(req.params.eventid.trim())

        if (req.session.userId) {
            let userId = xss(req.session.userId);
            let reqEvent = await eventsData.getbyId({ eventId: eventId, hostId: userId });
            if (reqEvent) {
                let obj = req.body
                // obj.hostName = xss(req.session.userName)
                let modEvent = await eventsData.modifyEvent(eventId, obj);
                res.status(200).json({ "success": true, "result": modEvent, "hostName": req.session.userName })
            }
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        console.log(e)
        res.status(400).json({ "success": false, "result": e[1] })
    }


});

router.post('/event/:eventid/removecohost/:userid', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]
        if (!ObjectId.isValid(req.params.userid.toString())) throw [400, "Event ID Is Invalid"]
        if (!req.params.eventid.trim() || !req.params.userid.trim()) throw [400, 'Event ID Or User ID Might Be Empty Strings']
        let eventId = xss(req.params.eventid.trim());
        let newUserid = xss(req.params.userid.trim());

        if (req.session.userId) {
            let userId = xss(req.session.userId);
            let reqEvent = await eventsData.getbyId({ eventId: eventId, hostId: userId });

            if (reqEvent) {
                let remcohost = await eventsData.removeCohost(eventId, newUserid);
                let delEventFromUserCollection = await usersData.deleteHostedEvent(newUserid, eventId);
                res.status(200).json({ "success": true, "result": remcohost, "hostName": req.session.userName })
            }
        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }
});

router.delete('/event/:eventid', async function (req, res) {
    try {
        if (!ObjectId.isValid(req.params.eventid.toString())) throw [400, "Event ID Is Invalid"]
        if (!req.params.eventid.trim()) throw [400, 'Event ID Might Be Empty Strings']
        let eventId = xss(req.params.eventid.trim());

        if (req.session.userId) {
            let userId = xss(req.session.userId);
            let reqEvent = await eventsData.getbyId({ eventId: eventId, hostId: userId });
            if (reqEvent) {
                let delEvent = await eventsData.deleteEvent(eventId);
                let delEventFromUserCollection = await usersData.deleteHostedEvent(userId, eventId);
                if (delEvent.cohostArr) {
                    for (let i = 0; i < delEvent.cohostArr.length; i++) {
                        let delEventFromRegisteredCollection = await usersData.deleteHostedEvent(xss(delEvent.cohostArr[i]), eventId);
                    }
                }
                if (delEvent.attendeesArr) {
                    for (let i = 0; i < delEvent.attendeesArr.length; i++) {
                        let delEventFromRegisteredCollection = await usersData.deleteRegisteredEvent(xss(delEvent.attendeesArr[i]), eventId);
                    }
                }
                res.status(200).json({ "success": true, "result": delEvent, "hostName": req.session.userName })
            }

        }
        else {
            res.status(400).json({ "success": false, "result": "User Not Logged In" })
        }
    }
    catch (e: ?) {
        console.log(e)
        res.status(e[0]).json({ "success": false, "result": e[1] })
    }
});

function validateEvent(obj: Event) {
    if (typeof (obj.name) != 'string' || typeof (obj.venue.address) != 'string' || typeof (obj.venue.city) != 'string' ||
        typeof (obj.venue.state) != 'string' || typeof (obj.venue.zip) != 'string' || typeof (obj.venue.city) != 'string'
    ) throw [400, "Event Details Mgiht Not Be String Where Expected"]

    if (!obj.name.trim() || !obj.venue.address.trim() || !obj.venue.city.trim() || !obj.venue.state.trim() ||
        !obj.venue.zip.trim()) throw [400, "Event Details Might Be Empty Strings"]

    if (isNaN(Number(obj.totalSeats)) || isNaN(Number(obj.minAge)) || isNaN(Number(obj.venue.geoLocation.lat)) ||
        isNaN(Number(obj.venue.geoLocation.long))) throw [400, "Events Data Might Not Be Number Where Expected"]

    if (!isNaN(Number(obj.venue.address)) || !isNaN(Number(obj.venue.city)) ||
        !isNaN(Number(obj.venue.state))) throw [400, "Event Details Might Be A Number Where Expected A String."]

    obj.name = xss(obj.name.trim())
    obj.price = xss(obj.price)
    obj.description = xss(obj.description.trim())
    obj.totalSeats = xss(Number(obj.totalSeats))
    obj.bookedSeats = xss(Number(obj.bookedSeats))
    obj.minAge = xss(Number(obj.minAge))
    obj.venue.address = xss(obj.venue.address.trim())
    obj.venue.city = xss(obj.venue.city.trim())
    obj.venue.state = xss(obj.venue.state.trim())
    obj.venue.zip = xss(obj.venue.zip.trim())
    obj.venue.geoLocation.lat = xss(Number(obj.venue.geoLocation.lat))
    obj.venue.geoLocation.long = xss(Number(obj.venue.geoLocation.long))
    obj.eventTimeStamp = xss(obj.eventTimeStamp);
    return obj;
}