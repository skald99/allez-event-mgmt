
type Event = {
    _id ?: string,
    eventImgs: File[] | string[],
    name : string,
    category : string[],
    price: number,
    description : string,
    totalSeats: number,
    bookedSeats : number,
    minAge: number,
    hostId ?: string,
    cohostArr ?: [],
    attendeesArr ?: [],
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