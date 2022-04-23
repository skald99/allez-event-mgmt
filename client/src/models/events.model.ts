
type Event = {
    _id : string,
    eventImgs : [],
    name : string,
    category : string,
    price: number,
    description : string,
    totalSeats: number,
    bookedSeats : number,
    minAge: number,
    hostId : string,
    // stripe_product_id: string,
    cohostArr : [],
    attendeesArr : [],
    venue: {
        address: string,
        city: string,
        state: string,
        zip: string,
        geoLocation: {lat: number, long: number}
    },
    eventTimeStamp: string

}

export default Event