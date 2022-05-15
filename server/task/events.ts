import { faker } from "@faker-js/faker";

type Venue = {
    address: string
    city: string
    state: string
    zip: string
    geoLocation: {
        lat: number
        long: number
    } 
}

function newEvent() {
    const name : string = faker.name.findName();
    const category : string[] = faker.helpers.arrayElements(['Career','Night Life','Food and Entertainment','Sports','Other','Music','Charity','Exploration']);
    const eventImgs: string[] = faker.helpers.arrayElements
    (["6280457697b18f6edbd5e09b",
        "628046d597b18f6edbd5e09d",
        "628046f397b18f6edbd5e09f",
        "6280471797b18f6edbd5e0a1",
        "6280473297b18f6edbd5e0a3",
        "6280475697b18f6edbd5e0a5",
        "6280477097b18f6edbd5e0a7",
        "6280478697b18f6edbd5e0a9",
        "628047a597b18f6edbd5e0ab",
        "628047bd97b18f6edbd5e0ad",
        "6280481497b18f6edbd5e0af",
        "6280485097b18f6edbd5e0b1",
        "6280486897b18f6edbd5e0b3",
        "628048c797b18f6edbd5e0b5"]);
    const price: number = parseFloat(faker.commerce.price(undefined,undefined,2));
    const description : string = faker.commerce.productDescription();
    const totalSeats: number = faker.datatype.number({max: 200});
    const bookedSeats : number = faker.datatype.number({max: totalSeats});
    const minAge: number = faker.datatype.number({max: 21})
    // const hostId : ObjectId,
    const active: Boolean = faker.datatype.boolean();
    // stripe_product_id: string,
    // const cohostArr : [],
    // const attendeesArr : [],
    const address: string = faker.address.streetAddress(true);

    const city: string = faker.address.cityName();
    const state: string = faker.address.state();
    const zip: string = faker.address.zipCode();
    const geoLat: number = parseFloat(faker.address.latitude());
    const geoLong: number = parseFloat(faker.address.longitude());

    let venue: Venue = {
        address: address,
        city: city,
        state: state,
        zip: zip,
        geoLocation:  {
            lat: geoLat,
            long: geoLong
        }
    }
    const eventTimeStamp: Date = faker.date.soon(15);
    return {name, category, price, description, totalSeats, bookedSeats, minAge, active, venue, eventTimeStamp, eventImgs};
}

export default newEvent;