import React, { ReactFragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventModel from '../models/events.model'
import Slider from 'react-slick';
import { Carousel } from 'react-responsive-carousel';
import ImageGallery from 'react-image-gallery';
import axios from "axios"

type carouselItem = {
    position: number,
    el: HTMLDivElement
}

type galleryType  = {
    original: string
    thumbnail: string,
}

const EventDetails = () => {
    const [event, setEvent] = useState<EventModel>()
    const [image,setImage] = useState<string>()
    const [eventId, setEventId] = useState<string>(useParams().eventId!);
    
    useEffect(() => {
        async function fetchEventDetails() {
            console.log('fetch event details')
            await axios.get(`http://localhost:4000/events/event/`, {
                params: {
                    eventId: eventId
                
            }}).then(({ data }) => {

                setEvent(data.result)
            }
            )
        }
        console.log('inside use effect')
        fetchEventDetails()
    }, [])

    // function renderImage(img: string) {
    //     return (
    //     )
    // }
    // let images = event?.eventImgs.map((img: string) => {
    //     return renderImage(img)
    // })

    const images: galleryType[] = []

    event?.eventImgs.map((img) => {
        let obj = {
            original: img as string,
            thumbnail: img as string,
        }
        images.push(obj)
        return images
    })
    // let imageCount = 0
    console.log(event)
    return (
        <div >
            <div className="container flex flex-col mx-auto my-10 overflow-hidden shadow-sm md:my-24 md:flex-row">
                <div>
                    <ImageGallery items={images} />
                </div>
                 <div>
                    <h2>Event name : {event?.name}</h2>
                    <p>{event?.description}</p>
                    <p>capacity : {(event as EventModel).attendeesArr!.length}/{event?.totalSeats}</p>
                </div>


            </div>
        </div>
    )
}

export default EventDetails