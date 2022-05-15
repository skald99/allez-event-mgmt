import React, { ReactFragment, useEffect, useState } from 'react';
import EventModel from '../models/events.model'
import axios from "axios"
import { Link, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const RegisteredEvents = () => {
    const [UpcomingEvents, setUpcomingEvents] = useState<EventModel[]>([])
    const [pastEvents, setPastEvents] = useState<EventModel[]>([])

    useEffect(() => {
        async function getRegisteredEvents() {

            await axios.get(`http://localhost:4000/users/RegisteredEvents`).then(({ data }) => {
                let events = data.result
                console.log(events)
                let upcomingFilter = events.filter((event: { eventTimeStamp: string | number | Date; }) => (new Date(event.eventTimeStamp).getTime() > new Date().getTime()))
                let pastFilter = events.filter((event: { eventTimeStamp: string | number | Date; }) => (new Date(event.eventTimeStamp).getTime() <= new Date().getTime()))

                setUpcomingEvents(upcomingFilter)
                setPastEvents(pastFilter)
            })
        }
        console.log('inside registered events use effect')
        getRegisteredEvents()
    }, [])

    console.log(UpcomingEvents)
    console.log(pastEvents)

    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>Upcoming Events</Tab>
                    <Tab>Past Events</Tab>
                </TabList>

                <TabPanel>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        EventName
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        location
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Open</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {UpcomingEvents && UpcomingEvents.map((event) => {
                                    return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {event.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {event.eventTimeStamp}
                                            </td>
                                            <td className="px-6 py-4">
                                                "{event.venue.city},{event.venue.state}"
                                            </td>
                                            <td className="px-6 py-4">
                                                {event.price}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a href={`/events/${event._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Open</a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        EventName
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        location
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Open</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastEvents && pastEvents.map((event) => {
                                    return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {event.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {event.eventTimeStamp}
                                            </td>
                                            <td className="px-6 py-4">
                                                "{event.venue.city},{event.venue.state}"
                                            </td>
                                            <td className="px-6 py-4">
                                                {event.price}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/events/${event._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Open</Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default RegisteredEvents