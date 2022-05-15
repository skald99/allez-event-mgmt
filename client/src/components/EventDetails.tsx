import React, { ReactFragment, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventModel from '../models/events.model'
import Slider from 'react-slick';
import { Carousel } from 'react-responsive-carousel';
import ImageGallery from 'react-image-gallery';
import axios from 'axios'
import noImage from '../images/noImage.jpg'

type carouselItem = {
    position: number,
    el: HTMLDivElement
}

type galleryType = {
    original: string
    thumbnail: string,
}

const EventDetails = () => {
    const [event, setEvent] = useState<EventModel>()
    const [image, setImage] = useState<string>()
    let id = useParams().eventId

    useEffect(() => {
        async function fetchEventDetails() {
            console.log('fetch event details')
            console.log(id)
            await axios.get(`http://localhost:4000/events/event/`, {
                withCredentials: true,
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

    if (images.length === 0) {
        let obj = {
            original: noImage,
            thumbnail: noImage
        }
        images.push(obj)
    } console.log(event)
    return (
        <div >
            <div className="my-10 md:my-24 container mx-auto flex flex-col md:flex-row shadow-sm overflow-hidden">
                <div>
                    <ImageGallery items={images} />
                </div>
                <div>
                    <h2>Event name : {event?.name}</h2>
                    <p>{event?.description}</p>
                    <p>capacity : {event?.attendeesArr!.length}/{event?.totalSeats}</p>
                    <Link to={`/events/${event?._id}/edit`}> Edit</Link>
                </div>
                
            </div>
        </div>
    )
}

export default EventDetails