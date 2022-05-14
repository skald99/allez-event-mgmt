

interface User {
    _id?: string,
    name: string,
    address: {
        city: string,
        state: string,
        postal_code: string,
        country: string,

    },
    phone: number,
    gender: string,
    dateOfBirth: Date,
    email: string,
}


export default User