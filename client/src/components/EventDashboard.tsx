import React, { ReactFragment, useEffect, useState, } from 'react';
import eventModel from "../models/events.model"
import { Link, useParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated'
import { getValue } from '@testing-library/user-event/dist/utils'
import noImage from '../images/noImage.jpg'
import axios from 'axios';


const animatedComponents = makeAnimated();


export interface OptionType {
    value: string;
    label: string;
}

const EventList = () => {
    const [events, setEvents] = useState<eventModel[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [displayEvents, setDisplayEvents] = useState<eventModel[]>([])
    const [costFilter, setCostFilter] = useState('All')
    const [filteredCategories, setFilteredCategories] = useState<string[]>([])
    const [stateFilter, setStateFilter] = useState<string[]>([])
    const [cityFilter, setCityFilter] = useState<string[]>([])
    const [stateOptions, setStateOptions] = useState<OptionType[]>()
    const [cityOptions, setCityOptions] = useState<OptionType[]>()
    const [loading,setLoading] = useState<boolean>(false)
    let card



    useEffect(() => {
        async function fetchEventList() {
            setLoading(true)
            await axios.get('http://localhost:4000/events/',{withCredentials: true}).then(({ data }) => {
                setEvents(data.result)
                setDisplayEvents(data.result)
                setLoading(false)
            })
        }
        console.log('inside use effect')
        fetchEventList()
    }, [])

    const handleSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {

        setSearchTerm(e.currentTarget.value);
    }

    useEffect(() => {
        let options = getStateOptions(displayEvents)
        console.log(displayEvents)
        setStateOptions(options)
    }, [events])

    useEffect(() => {
        let results: eventModel[] = []
        results = filterBySearchText()
        if (costFilter != 'All') results = filterByCost(results)
        if (filteredCategories.length > 0) results = filterByCategories(results)
        let sOptions = getStateOptions(results)
        setStateOptions(sOptions)
        if (stateFilter.length > 0) {
            results = filterByState(results)
            let cityOptions = getCityOptions(results)
            setCityOptions(cityOptions)
        }
        else if (stateFilter.length === 0) setCityOptions([])
        if (cityFilter.length > 0) results = filterByCity(results)
        setDisplayEvents(results)
    }, [searchTerm, costFilter, filteredCategories, stateFilter, cityFilter]);


    if(loading){
        return (
            <div>
                <h2>
                    Loading
                </h2>
            </div>
        )
    }

    if (events.length == 0 && !loading) {
        return (
            <div>
                <h2>No events to display</h2>
            </div>
        )
    }

    function filterBySearchText() {
        let results: eventModel[] = []
        for (let event of events) {
            if (event.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) results.push(event)
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

    function filterByCategories(curEvents: eventModel[]) {
        let results: eventModel[] = []
        for (let eve of curEvents) {
            let categories = eve.category
            for (let cat of categories) {
                if (filteredCategories.includes(cat) && results.filter(e => e._id === eve._id).length === 0) results.push(eve)
            }
        }
        return results
    }

    function getStateOptions(curEvents: eventModel[]) {
        let options: OptionType[] = []
        for (let event of curEvents) {
            let state = event.venue.state
            let stateOptionObj = { value: state, label: state }

            if (options.filter(e => e.value === state).length === 0) options.push(stateOptionObj)
        }
        return options
    }

    function getCityOptions(curEvents: eventModel[]) {
        let options: OptionType[] = []

        for (let event of curEvents) {
            let city = event.venue.city
            let cityOptionObj = { value: city, label: city }
            options.push(cityOptionObj)
        }

        return options
    }

    function filterByState(curEvents: eventModel[]) {
        let results: eventModel[] = []
        for (let event of curEvents) {
            if (stateFilter.includes(event.venue.state) && results.filter(e => e._id === event._id).length === 0) results.push(event)
        }
        return results
    }

    function filterByCity(curEvents: eventModel[]) {
        let results: eventModel[] = []
        for (let event of curEvents) {
            if (cityFilter.includes(event.venue.city) && results.filter(e => e._id === event._id).length === 0) results.push(event)
        }
        return results
    }




    const categoryList: OptionType[] = [
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


    const costFilterOptions: OptionType[] = [
        { value: 'All', label: 'All' },
        { value: 'free', label: 'free' },
        { value: 'paid', label: 'paid' }
    ]

    const buildCard = (event: eventModel) => {

        let imgSrc = (event.eventImgs.length > 0) ? event.eventImgs.at(0) : noImage
        console.log(imgSrc)
        return (
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <Link to={`/events/${event._id}`}>
                    <img className="w-full" src={imgSrc as string} />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{event.name}</div>
                        <p className="text-gray-700 text-base">
                            {event.description}
                        </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        {event.category.map((cat) => {
                            return <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</span>
                        })}
                    </div>
                </Link>

            </div>
        )
    }

    if (displayEvents.length > 0) {
        card = displayEvents.map((event) => {


            return buildCard(event)
        })
    }


    return (
        <div className='mx-8'>
            <div className="flex items-center justify-between mt-4">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Event DashBoard</h2>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md" onClick={() => {

                }}>
                    Reset Filter
                </button>
            </div>
            <div>

                <input placeholder='Search by event name' id='search' type='text' onChange={handleSearchTextChange} className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"></input>
            </div>

            <div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                    <Select placeholder='Category FIlter' className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" options={categoryList} isMulti onChange={(newValue: MultiValue<{ value: string, label: string }>) => {
                        setFilteredCategories(newValue.map((e) => e.value));
                    }} />

                    <Select placeholder='Cost filter' className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" options={costFilterOptions} defaultValue={costFilterOptions[0]} onChange={(e) => {
                        if (e?.value) setCostFilter(e?.value)
                    }} />

                    <Select placeholder='State FIlter' className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" options={stateOptions} isMulti onChange={(newValue: MultiValue<{ value: string, label: string }>) => {
                        setStateFilter(newValue.map((e) => e.value));
                    }} />

                    {cityOptions && <Select placeholder='City FIlter' className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" options={cityOptions} isMulti onChange={(newValue: MultiValue<{ value: string, label: string }>) => {
                        setCityFilter(newValue.map((e) => e.value));
                    }} />}
                </div>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8'>
                {card}
            </div>
        </div>
    )
}

export default EventList