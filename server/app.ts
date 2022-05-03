//import { User } from "./models/user.model"; 

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

// //import data from "./data";
// //const usersData = data.usersData;
// //import { checkUser, createUser, getUser, modifyUser } from "./data/users";
// import { ObjectId } from "mongodb";

// async function main() {
//     try{

//     // let person : User = {
//     //     name: "Test111",
//     //     password: "Check",
//     //     address: {
//     //         city: "Miami",
//     //         state: "Florida",
//     //         zip: "11002"
//     //     },
//     //     gender: "M",
//     //     dateOfBirth: new Date("2020-12-10"),
//     //     email: "test123@gmail.com",
//     //     hostEventArray: ["Test1","Test2","Test3"],
//     //     attendEventArray: ["Check1","Check2","Check3"]
//     // };
//     // let createdUser = await usersData.createUser(person);
//     // console.log(createdUser);

//     /**
//      * retrieve user details
//      */
//     // let id : string = "625c63b53e90e43f3a621db5";
//     // let requestedUser = await usersData.getUser(id);
//     // console.log(requestedUser);

//     /**
//      * validating user login credentials
//      */
//     // let name : string = "test123@gmail.com";
//     // let password : string = "Check";
//     // let userLog = await checkUser(name, password);
//     // console.log(userLog);

//     /**
//      * modifying user details
//      */
//     // let person : User = {
//     //     name: "Test111modified",
//     //     password: "Check",
//     //     address: {
//     //         city: "Miami",
//     //         state: "Florida",
//     //         zip: "11002"
//     //     },
//     //     gender: "M",
//     //     dateOfBirth: new Date("2020-12-10"),
//     //     email: "test123@gmail.com",
//     //     hostEventArray: ["Test1","Test2","Test3"],
//     //     attendEventArray: ["Check1","Check2","Check3"]
//     // };
//     // let modifiedUser = await usersData.modifyUser(person);
//     // console.log(modifiedUser);

//     }catch(e){
//         console.log(e);
//     }
// }

// main();

// app.use(async(req, res, next) => {
//     let timeStamp = new Date().toUTCString();
//     let reqMethod = req.method;
//     let reqUserId = req.session.userId;
//     let reqRoute = req.originalUrl;
//     if(req.session.userId) console.log(timeStamp + ': ' + reqUserId+ ': ' + reqMethod + reqRoute + 'Authenticated user');
//     else console.log(timeStamp + ': '+ reqUserId+ ': ' + reqMethod + reqRoute + 'Non-Authenticated user');
//     next();
// });

configRoutes(app);

app.listen(4000, () => {
    console.log("We have now got a server");
    console.log('Your routes will be running on http://localhost:4000');
})