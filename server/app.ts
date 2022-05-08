//import { User } from "./models/user.model"; 
//import { initializeApp } from "firebase/app";
//import firebase from "firebase/app";
//import firestore from "firebase/firestore";
//import * as functions from "firebase-functions";
import * as admin from "firebase-admin/app";
import * as keyAdmin from "firebase-admin";
import * as firestore from "firebase-admin/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAhlIfs1X-mXFWaNqJX15Ew83SY9X-_NLs",
    authDomain: "allez-3e5a1.firebaseapp.com",
    projectId: "allez-3e5a1",
    storageBucket: "allez-3e5a1.appspot.com",
    messagingSenderId: "491306185561",
    appId: "1:491306185561:web:78fbfcb2570c17c1659248",
    measurementId: "G-2BMLN6HEX9"
  };
const credential = {credential: keyAdmin.credential.cert(require('../firebase-private-key.json'))};
// initialize firebase
const firebaseApp = admin.initializeApp(credential);

import express from 'express';
import session from "express-session";
const app = express();
import configRoutes from "./routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))

// app.use(
//     session({
//       store: new FirestoreStore({
//         dataset: new Firestore(),
//         kind: 'express-sessions',
//       }),
//       secret: 'my-secret',
//       resave: false,
//       saveUninitialized: true,
//     })
//   );
  

app.post('/users/login', (req, res, next) => {
    if(req.session.userId) res.status(401).json({ "success": false, "result": 'user is already logged in.'});
    else next();
})

app.get('/users', (req, res, next) => {
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})

app.put('/users', (req, res, next) => {
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})

app.get('/users/getHostedEvents', (req, res, next) => {
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})

app.get('/users/getRegisteredEvents', (req, res, next) => {
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})

app.delete('/users', (req, res, next) => {
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})

app.get('/users/logout', (req, res, next) => {
    console.log("inside logout middleware", req.session.userId);
    if(!req.session.userId) res.status(401).json({ "success": false, "result": 'user must be logged in.'});
    else next();
})


// initialize the database and the collection
const firestoreDb = firestore.getFirestore();
// exports.firestoreDb = firestoreDb;
export default firestoreDb;


configRoutes(app);

// exports.app = functions.https.onRequest(app);

app.listen(4000, () => {
    console.log("We have now got a server");
    console.log('Your routes will be running on http://localhost:4000');
})
