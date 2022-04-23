import express from 'express';
import { User } from '../models/user.model';
const router = express.Router();
import data from "../data";
const usersData = data.usersData;

router.get("/", async(req, res) => {
    try{
        let id: string = req.body.id;
        let getUserDetails = await usersData.getUser(id);
        console.log(getUserDetails);
        res.status(200).json(getUserDetails);
    }catch(e){
        res.status(400).json(e);
    }
})

router.post("/login", async(req, res) => {
    try{
        let email: string = req.body.email;
        let password: string = req.body.password;
        let userLogin = await usersData.checkUser(email, password);
        console.log(userLogin);
        res.status(200).json(userLogin);
    }catch(e){  
        res.status(400).json(e);
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
        res.status(200).json(newlyCreatedUser);
    }catch(e){
        res.status(400).json(e);
    }
})

router.put("/", async(req, res) => {
    try{
        let newUser: User = {
            "_id": req.body.id,
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
        res.status(200).json(updatedUser);
    }catch(e){
        res.status(400).json(e);
    }
})

router.get("/getHostedEvents", async(req, res) => {
    try{
        let hostedEvents = await usersData.getHostedEvents(req.body.id);
        console.log(hostedEvents);
        res.status(200).json(hostedEvents);
    }catch(e){
        res.status(400).json(e);
    }
})

router.get("/getRegisteredEvents", async(req, res) => {
    try{
        let registeredEvents = await usersData.getRegisteredEvents(req.body.id);
        console.log(registeredEvents);
        res.status(200).json(registeredEvents);
    }catch(e){
        res.status(400).json(e);
    }
})

export default router;