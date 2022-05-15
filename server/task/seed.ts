type UserEvent = {
    id: string,
    attendArr: string[],
    hostArr: string[]
}


import newUser from './users';
import newEvent from "./events";
import {writeFile} from "fs"
import * as data from "../data/index";
const userFunctions = data.default.usersData;
const eventFunctions = data.default.eventsData;
import {connectDB} from "../config/mongoConnection";
import { events } from "../config/mongoCollections"
import { User } from '../models/user.model';
import { Event } from '../models/events.model';
import { ObjectId } from 'mongodb';
import firestoreDb from "../app";
import { faker } from "@faker-js/faker";
import { event } from 'firebase-functions/v1/analytics';

async function* asyncGenerator(num: number) {
  let i = 0;
  while (i < num) {
    yield i++;
  }
}

async function dropAll() {
  const db = await connectDB();
  try {
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
}
async function seedData(num: number) {
  // create users
    console.log("--------------------------------------------");
    console.log("Starting to Create Users...");
    const userEventLog: UserEvent[] = [];
    const eventIds: string[] = [];
    const userIds: string[] = [];
    const login: {email:string, password:string}[] = [];
        for (let i = 0; i < num; i++) {
        let tempUser: User = newUser();
        
        try {
            let tmp = await userFunctions.createUser(tempUser);
            const password: string = faker.internet.password()
            const querySnapshot = await firestoreDb.collection("users").add({
              email: tempUser.email,
              password: password,
              userId: tmp._id
          });
          userIds.push(tmp._id.toString());
            userEventLog.push({id: tmp._id as string, attendArr: tmp.attendEventArray, hostArr: tmp.hostEventArray});
            let tempEvent1 = newEvent();
            let tempEvent2 = newEvent();
            let hostId: string = tmp._id as string;
            let finalEvent1: Event = {...tempEvent1, hostId: hostId}
            let finalEvent2: Event = {...tempEvent2, hostId: hostId}
            console.log("-------------------------------------");
            console.log("Adding events to users");

            // events for hosts are created
            let event = await eventFunctions.createEvent(finalEvent1);
            let addEvent1InUserCollection = await userFunctions.addHostedEvent(hostId, event._id.toString());

            let event2 = await eventFunctions.createEvent(finalEvent2);
            let addEvent2InUserCollection = await userFunctions.addHostedEvent(hostId, event2._id.toString());

            // add cohosts for the events
            if(userIds.length > 1) {
              let addCoHosts = await eventFunctions.addCohost(event._id, userIds[i-1]);
              let addEventInUserCollection = await userFunctions.addHostedEvent(userIds[i-1], event._id.toString());
            }

            // add participants for the events
            if(userIds.length>2) {
              for(let j=0; j<userIds.length-2; j++) {
                let addattendees = await eventFunctions.addAttendee(event._id, userIds[j]);
                let addEventInUserCollection = await userFunctions.addRegisteredEvent(userIds[j], event._id.toString());
              }
            }

            console.log("Check22");
            console.log(typeof event?._id);
            eventIds.push(event?._id.toString()!, event2?._id.toString()!);
            //login.push({ email: tempUser.email, password: tempUser.password });
            console.log(`Inserting Users: ${i}/${num - 1}`);
        } catch (e) {
            console.log(e);
        }
    }
    console.log(eventIds);
    console.log(userEventLog);


    // for(let j = 0;j < eventIds.length; j++) {
    //     let numOfInserts = Math.floor(Math.random() * userEventLog.length);
    //     console.log("L72: "+numOfInserts);
    //     let attendOrCoHost: number = Math.floor(Math.random());
    //     console.log("attendOrCoHost: "+ attendOrCoHost);
    //     for(let i = 0; i < numOfInserts; i++) {
    //         if(!userEventLog[i].hostArr.includes(eventIds[j]) || !userEventLog[i].attendArr.includes(eventIds[j])) {
    //             let userId = userEventLog[i].id;
    //             console.log(userEventLog[i]);
    //             if(!userEventLog[i].hostArr.includes(eventIds[j])) {
    //                 let attendee = await eventFunctions.addAttendee(eventIds[j],userId);
    //                 userEventLog[i].attendArr.push(eventIds[j]);
    //                 console.log(attendee);
    //             } else if(!userEventLog[i].attendArr.includes(eventIds[j]) && (userEventLog[i].id != userId)) {
    //                 let cohost = await eventFunctions.addCohost(eventIds[j], userId);
    //                 console.log(cohost);
    //             }
    //         }
    //     }
    // }

  
    console.log("All users have been created!");
    // output to json
    let userLogin = JSON.stringify(login);
    writeFile('./task/user.json', userLogin, "utf8", () => {})
    return userEventLog;
}

// async function seedEvents() {
//     console.log("--------------------------------------------");
//   console.log("Starting to Create Events...");
// }
//dropAll();
seedData(5);
