import express from 'express';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// const auth = getAuth();
import firestoreDb from "../app";
import { User } from '../models/user.model';
const router = express.Router();
import data from "../data";
//import { user } from 'firebase-functions/v1/auth';
//import { getUnpackedSettings } from 'http2';
// import { fstat } from 'fs';
// import { app } from 'firebase-admin';
const usersData = data.usersData;
//import { Session }  from "../models/session.model";


router.get("/logout", async(req, res) => {
    try{
        let statuscode: number = 200;
        req.session.destroy((err) => {
            //console.log(err);
            if(req.session) throw 400;
        })
        console.log("session should be destroyed" + req.session.userId);
    }catch(e){
        if(e == 400) res.status(400).json({"success": false, "result": e});
        else res.status(200).json({"success": true, "result": "user has successfully logged out"});
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
        //let userLogin = await usersData.checkUser(email, password);
        //console.log(userLogin);

        // retrieve if there is data with the given email
        const querySnapshot = await firestoreDb.collection("users").where("email", "==", email).where("password", "==", password).get();
        if(querySnapshot.docs[0]){
            // const query = await querySnapshot.docs[0].where("password", "==", password);
            // if(query != "") req.session.userId = query.userId;
            // else throw `Either email or password are invalid.`;

            let getUserDetails = await usersData.getUser(querySnapshot.docs[0].data().userId);
            
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
        let newUser: User = {
            "name": req.body.name,
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
        let newUser: User = {
            "_id": req.session.id,
            "name": req.body.name,
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

router.post("/changepassword", async(req, res) => {
    try{
        let oldPassword: string = req.body.oldPassword
        let newPassword: string = req.body.newPassword;
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
            //if(!req.session) throw null;
        })
        if(!req.session) res.status(200).json({ "success": true, "result": deleteRequestedUser });
    }catch(e){
        //if(e == null) res.status(200).json({"success": true, "result": "User account has been deleted successfully"});
        res.status(400).json({ "success": false, "result": e });
    }
})

export default router; 