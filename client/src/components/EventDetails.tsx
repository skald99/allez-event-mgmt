import React, { ReactFragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventModel from '../models/events.model'
import Slider from 'react-slick';
import { Carousel } from 'react-responsive-carousel';
import ImageGallery from 'react-image-gallery';
import axios from 'axios'

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
    let id = useParams().eventId
    
    useEffect(() => {
        async function fetchEventDetails() {
            console.log('fetch event details')
            await axios.get(`http://localhost:4000/events/event/`, {
                params: {
                    eventId: id
                
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
            original: img,
            thumbnail: img,
        }
        images.push(obj)
    })
    // let imageCount = 0
    console.log(event)
    return (
        <div >
            <div className="my-10 md:my-24 container mx-auto flex flex-col md:flex-row shadow-sm overflow-hidden">
                <div>
                    <ImageGallery items={images} />
                </div>
                 <div>
                    <h2>Event name : {event?.name}</h2>
                    <p>{event?.description}</p>
                    <p>capacity : {event?.attendeesArr.length}/{event?.totalSeats}</p>
                </div>


            </div>
        </div>
    )
}

export default EventDetails