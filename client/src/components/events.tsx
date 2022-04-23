import React, { useEffect, useState,  } from 'react';
import eventModel from "../models/events.model"
import { Link, useParams } from 'react-router-dom';

const EventList = () => {
    console.log('compnent rendered')
    let events: eventModel[] = getEvents()

    const [searchTerm,setSearchTerm] = useState('')
    const [displayEvents,setDisplayEvents] = useState<eventModel[]>([])

    const searchByName = (e: React.FormEvent<HTMLInputElement>) =>{
       setSearchTerm(e.currentTarget.value);
    }

    useEffect(() => {
                let results:eventModel[] = []
                for(let event of events){
                    if(event.name.includes(searchTerm)) results.push(event)
                }
                setDisplayEvents(results)
    }, [searchTerm]);

    if(events.length == 0){
        return <p>No events to display</p>
    }

    if(displayEvents.length === 0) setEventsAsDisplay()

    function setEventsAsDisplay(){
        setDisplayEvents(events)
    }
    return (
        <div>
            <div>
                <form method="post" onSubmit={(e) => {
                    e.preventDefault()
                }}></form>
                <input id='search' type='text' onChange={searchByName}></input>
            </div>
            <h1>Event List</h1>
            <div>
            <ol id='eventList'>
                {
                    displayEvents.map((eve) => {
                        return (
                        <li key = {eve._id}>
                          Event name : {eve.name}
                          <br/>
                          price : {eve.price}
                        </li>
                        )
                    })
                }
            </ol>
            </div>
        </div>
    )
}

function getEvents() {
    let events:eventModel[] = []
    for (let i = 0; i <= 10; i++)
    {
        let event:eventModel = {
            _id: "eve" + i,
            eventImgs: [],
            name: "eve" + i,
            category: "eve" + i,
            price: i,
            description: "eve" + i,
            totalSeats: i,
            bookedSeats: i,
            minAge: i,
            hostId: "eve" + i,
            // stripe_product_id: "eve" + i,
            cohostArr: [],
            attendeesArr: [],
            venue: {
                address: "eve" + i,
                city: "eve" + i,
                state: "eve" + i,
                zip: "eve" + i,
                geoLocation: { lat: i, long: i }
            },
            eventTimeStamp: Date()
        }

        events.push(event)
    }

    return events
}
export default EventList