import express from 'express';
import firestoreDb from "../app";
import { User } from '../models/user.model';
const router = express.Router();
import data from "../data";
const usersData = data.usersData;
const xss = require('xss');

router.get("/logout", async(req, res) => {
    try{
        let statuscode: number = 200;
        req.session.destroy((err) => {
            if(req.session) throw 400;
        })
    }catch(e){
        if(e == 400) res.status(400).json({"success": false, "result": e});
        else res.status(200).json({"success": true, "result": "user has successfully logged out"});
    }
})

router.get("/", async(req, res) => {
    try{
        let id: string = xss(req.session.userId);
        let getUserDetails = await usersData.getUser(id);
        console.log(getUserDetails);
        res.status(200).json({ "success": true, "result": getUserDetails });
    }catch(e){
        res.status(400).json({ "success": false, "result": e});
    }
})

router.post("/login", async(req, res) => {
    try{
        if(typeof(req.body.email)!='string'||typeof(req.body.password)!='string') throw [400, "Data Not In Right Format"]
        if(!req.body.email.trim() || !req.body.password.trim()) throw [400, "Data Not In Right Format"]
        let email: string = xss(req.body.email);
        let password: string = xss(req.body.password);
        // retrieve if there is data with the given email
        
        const querySnapshot = await firestoreDb.collection("users").where("email", "==", email).where("password", "==", password).get();
        
        if(querySnapshot.docs[0]){

            let getUserDetails = await usersData.getUser(xss(querySnapshot.docs[0].data().userId));
            
            req.session.userId = querySnapshot.docs[0].data().userId;
            req.session.userName = getUserDetails.name;
            
        }else throw `Either email or password are invalid.`;

        res.status(200).json({ "success": true, "result": "successful in login" });
    }catch(e){  
        res.status(400).json({ "success": false, "result": e });
    }
})

router.post("/", async(req, res) => {
    try{
        if(typeof(req.body.name)!='string'||typeof(req.body.gender)!='string'||typeof(req.body.email)!='string'||
        typeof(req.body.address.city)!='string'||
        typeof(req.body.address.state)!='string'||
        typeof(req.body.address.postal_code)!='string'||
        typeof(req.body.address.country)!='string') throw [400, "Data Not In Right Format"]

        if(!req.body.name.trim() || !req.body.gender.trim() || !req.body.email.trim()  || 
        !req.body.address.city.trim() || !req.body.address.state.trim() || !req.body.address.postal_code.trim() ||
         !req.body.address.country.trim() ) throw [400, "Data Not In Right Format"]

         if(isNaN(Number(req.body.phone)))throw [400, "Data Not In Right Format"]

         if( !isNaN(Number(req.body.name)) || !isNaN(Number(req.body.address.city)) || !isNaN(Number(req.body.address.state)) ||
         !isNaN(Number(req.body.address.postal_code)) || !isNaN(Number( req.body.address.country)) || !isNaN(Number(req.body.gender)) ||
         !isNaN(Number(req.body.email))
         ) throw [400, "Data Not In Correct Format"]
        let newUser: User = {
            "name": xss(req.body.name.trim()),
            "address": {
                "city": xss(req.body.address.city.trim()),
                "state": xss(req.body.address.state.trim()),
                "postal_code": xss(req.body.address.postal_code.trim()),
                "country": xss(req.body.address.country.trim())
            },
            "phone": xss(Number(req.body.phone)),
            "gender": xss(req.body.gender.trim()),
            "email": xss(req.body.email.trim()),
            "dateOfBirth": xss(req.body.dateOfBirth),
            "hostEventArray": [],
            "attendEventArray": []
        }

        let newlyCreatedUser = await usersData.createUser(newUser);

        const querySnapshot = await firestoreDb.collection("users").add({
            email: req.body.email,
            password: req.body.password,
            userId: newlyCreatedUser._id
        });

        res.status(200).json({ "success": true, "newUser": newlyCreatedUser, "firestoreId": querySnapshot.id});
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.put("/", async(req, res) => {
    try{
        if(typeof(req.body.name)!='string'||typeof(req.body.gender)!='string'||typeof(req.body.email)!='string'||
        typeof(req.body.address.city)!='string'||
        typeof(req.body.address.state)!='string'||
        typeof(req.body.address.postal_code)!='string'||
        typeof(req.body.address.country)!='string') throw [400, "Data Not In Right Format"]

        if(!req.body.name.trim() || !req.body.gender.trim() || !req.body.email.trim()  || 
        !req.body.address.city.trim() || !req.body.address.state.trim() || !req.body.address.postal_code.trim() ||
         !req.body.address.country.trim() ) throw [400, "Data Not In Right Format"]

         if(isNaN(Number(req.body.phone)))throw [400, "Data Not In Right Format"]

         if( !isNaN(Number(req.body.name)) || !isNaN(Number(req.body.address.city)) || !isNaN(Number(req.body.address.state)) ||
         !isNaN(Number(req.body.address.postal_code)) || !isNaN(Number( req.body.address.country)) || !isNaN(Number(req.body.gender)) ||
         !isNaN(Number(req.body.email))
         ) throw [400, "Data Not In Correct Format"]

        let newUser: User = {
            "_id": xss(req.session.id),
            "name": xss(req.body.name.trim()),
            "address": {
                "city": xss(req.body.address.city.trim()),
                "state": xss(req.body.address.state.trim()),
                "postal_code": xss(req.body.address.postal_code.trim()),
                "country": xss(req.body.address.country.trim())
            },
            "phone": xss(Number(req.body.phone)),
            "gender": xss(req.body.gender.trim()),
            "email": xss(req.body.email.trim()),
            "dateOfBirth": xss(req.body.dateOfBirth.trim()),
            "hostEventArray": xss(req.body.hostEventArray),
            "attendEventArray": xss(req.body.attendEventArray)
        }

        let updatedUser = await usersData.modifyUser(newUser);
        console.log(updatedUser);

        req.session.userName = updatedUser.name;

        // changing email in firebase too
        const prequerySnapshot = await firestoreDb.collection("users").where("userId", "==", req.session.userId).get();
        if(!prequerySnapshot.docs[0]) throw `Old Password is incorrect.`;

        const firebaseId = prequerySnapshot.docs[0].id;

        const querySnapshot = await firestoreDb.collection("users").doc(firebaseId).update({
            "email": req.body.email,
        });

        res.status(200).json({ "success": true, "result": updatedUser });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.get("/getHostedEvents", async(req, res) => {
    try{
        let hostedEvents = await usersData.getHostedEvents(xss(req.session.userId));
        console.log(hostedEvents);
        res.status(200).json({ "success": true, "result": hostedEvents });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.get("/getRegisteredEvents", async(req, res) => {
    try{
        let registeredEvents = await usersData.getRegisteredEvents(xss(req.session.userId));
        console.log(registeredEvents);
        res.status(200).json({ "success": true, "result": registeredEvents });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

router.post("/changepassword", async(req, res) => {
    try{
        if(typeof(req.body.oldPassword)!='string'||typeof(req.body.newPassword)!='string') throw [400, "Data Not In Right Format"]
        if(!req.body.oldPassword.trim() || !req.body.newPassword.trim() ) throw [400, "Data Not In Right Format"]

        let oldPassword: string = req.body.oldPassword.trim()
        let newPassword: string = req.body.newPassword.trim();
        let userId: string = req.session.userId;

        console.log("userId", userId);

        const prequerySnapshot = await firestoreDb.collection("users").where("userId", "==", userId).where("password", "==", oldPassword).get();
        if(!prequerySnapshot.docs[0]) throw `Old Password is incorrect.`;

        const firebaseId = prequerySnapshot.docs[0].id;

        const querySnapshot = await firestoreDb.collection("users").doc(firebaseId).update({
            "password": newPassword,
        });

        console.log(querySnapshot);
        res.status(200).json({"success": true, "result": "password changed successfully"});
    }catch(e){
        console.log(e);
        res.status(400).json({ "success": false, "result": e})
    }
})

router.delete("/", async(req, res) => {
    try{
        let deleteRequestedUser = await usersData.deleteUser(req.session.userId);
        const prequerySnapshot = await firestoreDb.collection("users").where("userId", "==", req.session.userId).get();
        const firebaseId = prequerySnapshot.docs[0].id;
        if(!firebaseId) throw `could not find any account with the given userId`;
        const querySnapshot = await firestoreDb.collection("users").doc(firebaseId).delete()
        req.session.destroy((err) => {
        })
        if(!req.session) res.status(200).json({ "success": true, "result": deleteRequestedUser });
    }catch(e){
        res.status(400).json({ "success": false, "result": e });
    }
})

export default router; 