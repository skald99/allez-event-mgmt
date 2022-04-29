import express from 'express';
import { User } from '../models/user.model';
const router = express.Router();
import data from "../data";
import { fstat } from 'fs';
const usersData = data.usersData;
//import { Session }  from "../models/session.model";

router.get("/logout", async(req, res) => {
    try{
        // logout route is not functioning and need to be changed in the future
        req.session.userId = '';
        console.log("session should be destroyed", req.session.userId);
        res.status(200).json({"success": true, "result": "user has successfully logged out"});
    }catch(e){
        res.status(400).json({"success": false, "result": e});
    }
})

router.get("/", async(req, res) => {
    try{
        let id: string = req.session.userId;
        let getUserDetails = await usersData.getUser(id);
        console.log(getUserDetails);
        res.status(200).json({ "success": true, "result": getUserDetails });
    }catch(e){
        res.status(400).json({ "success": false, "result": e});
    }
})

router.post("/login", async(req, res) => {
    try{
        let email: string = req.body.email;
        let password: string = req.body.password;
        let userLogin = await usersData.checkUser(email, password);
        console.log(userLogin);
        req.session.userId = userLogin.userId;
        res.status(200).json({ "success": true, "result": userLogin });
    }catch(e){  
        res.status(400).json({ "success": false, "result": e });
    }
})

router.post("/", async(req, res) => {
    try{
        let newUser: User = {
            "name": req.body.name,
            "password": req.body.password,
            "address": {
                "city": req.body.address.city,
                "state": req.body.address.state,
                "postal_code": req.body.address.postal_code,
                "country": req.body.address.country
            },
            "phone": req.body.phone,
            "gender": req.body.gender,
            "email": req.body.email,
            "dateOfBirth": req.body.dateOfBirth,
            "hostEventArray": req.body.hostEventArray,
            "attendEventArray": req.body.attendEventArray
        }

        let newlyCreatedUser = await usersData.createUser(newUser);
        console.log(newlyCreatedUser);
        res.status(200).json({ "success": true, "result": newlyCreatedUser });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.put("/", async(req, res) => {
    try{
        let newUser: User = {
            "_id": req.session.id,
            "name": req.body.name,
            "password": req.body.password,
            "address": {
                "city": req.body.address.city,
                "state": req.body.address.state,
                "postal_code": req.body.address.postal_code,
                "country": req.body.address.country
            },
            "phone": req.body.phone,
            "gender": req.body.gender,
            "email": req.body.email,
            "dateOfBirth": req.body.dateOfBirth,
            "hostEventArray": req.body.hostEventArray,
            "attendEventArray": req.body.attendEventArray
        }

        let updatedUser = await usersData.modifyUser(newUser);
        console.log(updatedUser);
        res.status(200).json({ "success": true, "result": updatedUser });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.get("/getHostedEvents", async(req, res) => {
    try{
        let hostedEvents = await usersData.getHostedEvents(req.session.userId);
        console.log(hostedEvents);
        res.status(200).json({ "success": true, "result": hostedEvents });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.get("/getRegisteredEvents", async(req, res) => {
    try{
        let registeredEvents = await usersData.getRegisteredEvents(req.session.userId);
        console.log(registeredEvents);
        res.status(200).json({ "success": true, "result": registeredEvents });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.delete("/", async(req, res) => {
    try{
        let deleteRequestedUser = await usersData.deleteUser(req.session.userId);
        console.log(deleteRequestedUser);
        res.status(200).json({ "success": true, "result": deleteRequestedUser });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

export default router;