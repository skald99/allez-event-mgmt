import React, { ReactFragment, useEffect, useState, } from 'react';
import eventModel from "../models/events.model"
import { Link, useParams } from 'react-router-dom';
import Select, {MultiValue}  from 'react-select';
import makeAnimated from 'react-select/animated'
import { getValue } from '@testing-library/user-event/dist/utils'


const animatedComponents = makeAnimated();


export interface OptionType {
    value: string;
    label: string;
}

const EventList = () => {
    let events: eventModel[] = getEvents()
    const [searchTerm, setSearchTerm] = useState('')
    const [displayEvents, setDisplayEvents] = useState<eventModel[]>(events)
    const [costFilter, setCostFilter] = useState('All')
    const [filteredCategories, setFilteredCategories] = useState<string[]>([])
    const handleSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {

        setSearchTerm(e.currentTarget.value);
    }


    useEffect(() => {
        let results: eventModel[] = []
        results = filterBySearchText()
        if (costFilter != 'All') results = filterByCost(results)
        if(filteredCategories.length > 0) results = filterByCategories(results)
        setDisplayEvents(results)
    }, [searchTerm, costFilter,filteredCategories]);


    if (events.length == 0) {
        return <p>No events to display</p>
    }

    function filterBySearchText() {
        let results: eventModel[] = []
        for (let event of events) {
            if (event.name.includes(searchTerm)) results.push(event)
        }
        return results
    }

    function filterByCost(curEvents: eventModel[]) {
        let results: eventModel[] = []
        for (let event of curEvents) {
            if (costFilter == 'paid' && event.price > 0) results.push(event)
            else if (costFilter == 'free' && event.price === 0) results.push(event)
        }
        return results
    }

    function filterByCategories(curEvents:eventModel[]){
        let results = []
        for(let eve of curEvents){
            let categories = eve.category
            console.log(categories)
            console.log(filteredCategories)
            for(let cat of categories){
                if(filteredCategories.includes(cat)) results.push(eve)
            }
        }
        return results
    }

    const categoryList:OptionType[] = [
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
            <div>
                <Select options={categoryList} isMulti onChange={(newValue: MultiValue<{value:string,label:string}>) => {
                   setFilteredCategories(newValue.map((e) => e.value));
                } }/>
            </div>

            <h1>Event List</h1>
            <div>
                <ol id='eventList'>
                    {
                        displayEvents.map((eve) => {
                            return (
                                <li key={eve._id}>
                                    Event name : {eve.name}
                                    <br />
                                    price : {eve.price}   cat: {eve.category}

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
    let events: eventModel[] = []
    for (let i = 0; i <= 10; i++) {
        let event: eventModel = {
            _id: "eve" + i,
            eventImgs: [],
            name: "eve" + i,
            category: (i < 5) ? ['Career','Sports'] : ['Music','Charity'],
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