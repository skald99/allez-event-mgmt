import React, { ReactFragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Event from '../models/events.model'
import User from '../models/user.model';
import AdminConsole from './AdminConsole';
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios'

const UserProfile = () => {

    let id = "627f543ee81f04fe77ae41db"
    const [user, setUser] = useState<User>()

    useEffect(() => {
        async function fetchEventDetails() {
            console.log('fetch user details')
            console.log(id)

            // fetch user details
            await axios.get(`http://localhost:4000/users/`, {
                method: "get", withCredentials: true
            }).then(({ data }) => {
                setUser(data.result)
            }).catch(({ response }) => {
                toast.error(response.data.result)
            }
            )
        }
       
        // hostArray = 
        console.log('inside use effect')
        fetchEventDetails()
        console.log(user)
    }, [])
    return (
        <div>
            <div>
                <h1>User Profile Page</h1>
                <h2>Name: {user?.name}</h2>
                <h2>Email: {user?.email}</h2>
                <h2>Gender: {user?.gender}</h2>
                <h2>Phone: {user?.phone}</h2>
            </div>
            <AdminConsole id = {user?._id!}/>
            <ToastContainer />
        </div>
    )
}

export default UserProfile
