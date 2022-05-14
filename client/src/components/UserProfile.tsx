import React from "react";
import axios from "axios";

type UserDetails = {
    name: string,
    email: string,
    phone: number,
    address: {
        city: string,
        state: string,
        zip: string,
        country: string
    },
    gender: string,
    dateOfBirth: string
}

