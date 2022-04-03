import { User } from "./models/user.model"; 
import { createUser, modifyUser } from "./data/users";
import { ObjectId } from "mongodb";

async function main() {
    let person : User = {
        name: "Test111",
        password: "Check",
        address: {
            city: "Miami",
            state: "Florida",
            zip: "11002"
        },
        gender: "M",
        dateOfBirth: new Date("2020-12-10"),
        email: "test123@gmail.com",
        hostEventArray: ["Test1","Test2","Test3"],
        attendEventArray: ["Check1","Check2","Check3"]
    };
    await modifyUser(person);
}

main();
