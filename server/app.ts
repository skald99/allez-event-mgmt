import { User } from "./models/user.model"; 
import express from 'express';
const app = express();
import data from "./data";
const usersData = data.usersData;
//import { checkUser, createUser, getUser, modifyUser } from "./data/users";
import { ObjectId } from "mongodb";

async function main() {
    try{

    // let person : User = {
    //     name: "Test111",
    //     password: "Check",
    //     address: {
    //         city: "Miami",
    //         state: "Florida",
    //         zip: "11002"
    //     },
    //     gender: "M",
    //     dateOfBirth: new Date("2020-12-10"),
    //     email: "test123@gmail.com",
    //     hostEventArray: ["Test1","Test2","Test3"],
    //     attendEventArray: ["Check1","Check2","Check3"]
    // };
    // let createdUser = await usersData.createUser(person);
    // console.log(createdUser);

    /**
     * retrieve user details
     */
    // let id : string = "625c63b53e90e43f3a621db5";
    // let requestedUser = await usersData.getUser(id);
    // console.log(requestedUser);

    /**
     * validating user login credentials
     */
    // let name : string = "test123@gmail.com";
    // let password : string = "Check";
    // let userLog = await checkUser(name, password);
    // console.log(userLog);

    /**
     * modifying user details
     */
    // let person : User = {
    //     name: "Test111modified",
    //     password: "Check",
    //     address: {
    //         city: "Miami",
    //         state: "Florida",
    //         zip: "11002"
    //     },
    //     gender: "M",
    //     dateOfBirth: new Date("2020-12-10"),
    //     email: "test123@gmail.com",
    //     hostEventArray: ["Test1","Test2","Test3"],
    //     attendEventArray: ["Check1","Check2","Check3"]
    // };
    // let modifiedUser = await usersData.modifyUser(person);
    // console.log(modifiedUser);

    }catch(e){
        console.log(e);
    }
}

main();
