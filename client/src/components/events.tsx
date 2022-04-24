import React, { useEffect, useState, } from 'react';
import eventModel from "../models/events.model"
import { Link, useParams } from 'react-router-dom';
import Select, { OnChangeValue } from 'react-select'
import makeAnimated from 'react-select/animated'
import { getValue } from '@testing-library/user-event/dist/utils';
const animatedComponents = makeAnimated();

const EventList = () => {
    let events: eventModel[] = getEvents()

    const [searchTerm, setSearchTerm] = useState('')
    const [displayEvents, setDisplayEvents] = useState<eventModel[]>(events)
    const [costFilter, setCostFilter] = useState('All')
    const [filteredCategories,setFilteredCategories] = useState<string[]>([])
    let currentValue;
    const handleSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchTerm(e.currentTarget.value);
    }

    const handleCategoryFilter = (categoryList:[]) =>{
        setFilteredCategories(categoryList)
    }

    useEffect(() => {
        let results: eventModel[] = []
        results = filterBySearchText()
        if (costFilter != 'All') results = filterByCost(results)
        setDisplayEvents(results)
    }, [searchTerm, costFilter]);

    if (events.length == 0) {
        return <p>No events to display</p>
    }

    function setEventsAsDisplay() {
        setDisplayEvents(events)
    }

    function filterBySearchText() {
        let results: eventModel[] = []
        for (let event of events) {
            if (event.name.includes(searchTerm)) results.push(event)
        }
        return results
    }

    function filterByCost(nameFilteredEvents: eventModel[]) {
        let results: eventModel[] = []
        for (let event of nameFilteredEvents) {
            if (costFilter == 'paid' && event.price > 0) results.push(event)
            else if (costFilter == 'free' && event.price === 0) results.push(event)
        }
        return results
    }

    const categoryList = [
        { value: 'Career', label: 'Career' },
        { value: 'Music', label: 'Music' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Food and Drink', label: 'Food and Drinks' },
        { value: 'Charity', label: 'Charity' },
        { value: 'Exploration', label: 'Exploration' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Night Life', label: 'Night Life' },
        { value: 'Other', label: 'Other' }
    ]

    const costFilterOptions = [
        { value: 'All', label: 'All' },
        { value: 'free', label: 'free' },
        { value: 'paid', label: 'paid' }
    ]
    return (
        <div>
            <div>
                <label htmlFor="search">Search by name: </label>
                <input id='search' type='text' onChange={handleSearchTextChange} style={{ border: '1px solid black' }}></input>
            </div>

            <div id='costFilter'>
                <Select options={costFilterOptions} defaultValue={costFilterOptions[0]} onChange={(e) => {
                    if (e?.value) setCostFilter(e?.value)
                }} />
            </div>

            {/* <Select isMulti options={categoryList} closeMenuOnSelect={false} components={animatedComponents} hideSelectedOptions={true} getOptionValue={currentValue}
            onChange={handleCategoryFilter} /> */}
            <h1>Event List</h1>
            <div>
                <ol id='eventList'>
                    {
                        displayEvents.map((eve) => {
                            return (
                                <li key={eve._id}>
                                    Event name : {eve.name}
                                    <br />
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
    console.log('in get events')
    let events: eventModel[] = []
    for (let i = 0; i <= 10; i++) {
        let event: eventModel = {
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