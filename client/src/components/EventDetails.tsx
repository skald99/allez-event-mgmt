import React, { ReactFragment, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventModel from '../models/events.model'
import { ToastContainer, toast } from 'react-toastify';
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
    let userId = window.sessionStorage.getItem("userId")

    useEffect(() => {
        async function fetchEventDetails() {
            await axios.get(`http://localhost:4000/events/event/`, {
                withCredentials: true,
                params: {
                    eventId: id

                }
            }).then(({ data }) => {

                setEvent(data.result)
            }
            )
        }
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
    })
    // let imageCount = 0

    const registerUser = async () => {

        await axios(`http://localhost:4000/events/event/register/${event?._id}`, { method: "post", withCredentials: true }).then(({ data }) => {
                let newEvent = event
                if (userId) newEvent?.attendeesArr?.push(userId)
                setEvent(newEvent)
                toast.success(data.result)
        }).catch(({ response }) => {
            toast.error(response.data.result)
        })

    }

    const unRegisterUser = async () => {
        await axios(`http://localhost:4000/events/event/unregister/${event?._id}`, { method: "post", withCredentials: true }).then(({ data }) => {
            if (data.success === true) {
                let newEvent = event
                let myArray = newEvent?.attendeesArr

                if (userId) {
                    const index = myArray!.indexOf(userId!, 0);
                    if (index > -1) {
                        myArray!.splice(index, 1);
                    }
                    newEvent!.attendeesArr = myArray
                    setEvent(newEvent)
                    toast.success(data.result)
                }
            }
        }).catch(({ response }) => {
            toast.error(response.data.result)
        })
    }

    if (images.length === 0) {
        let obj = {
            original: noImage,
            thumbnail: noImage
        }
        images.push(obj)
    }
    console.log(userId)
    console.log(event)
    return (
        <div >
            <div className="my-10 md:my-24 container mx-auto flex flex-col md:flex-row shadow-sm overflow-hidden">
                <div>
                    <ImageGallery items={images} />
                </div>
                <div>
                    <div>
                        <h2>Event name : {event?.name}</h2>
                        <p>{event?.description}</p>
                        <p>capacity : {event?.attendeesArr!.length}/{event?.totalSeats}</p>
                    </div>
                    {userId &&
                        <div>
                            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" to={`/events/edit/${event?._id}`}> Edit</Link>
                            {(event && (event!.attendeesArr!.includes(userId!)) ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={unRegisterUser}> Unregister</button>
                                : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={registerUser}>register</button>)}
                        </div>}
                </div>
            </div>
            <ToastContainer closeButton={true} closeOnClick={true} />
        </div>
    )
}

export default EventDetails