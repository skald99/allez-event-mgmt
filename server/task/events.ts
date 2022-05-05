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
    const price: number = parseFloat(faker.commerce.price(undefined,undefined,2));
    const description : string = faker.commerce.productDescription();
    const totalSeats: number = faker.datatype.number({max: 200});
    const bookedSeats : number = faker.datatype.number({max: totalSeats});
    const minAge: number = faker.datatype.number({max: 21})
    let image1: string = faker.image.nightlife();
    let image2: string = faker.image.nightlife();
    const eventImgs: string[] = [];
    eventImgs.push(image1,image2);
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