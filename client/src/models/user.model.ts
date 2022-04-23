

interface User {
    _id?: string,
    name: string,
    address: {
        city: string,
        state: string,
        zip: string
    },
    gender: string,
    dateOfBirth: Date,
    email: string,
    password: string,
    hostEventArray: string[],
    attendEventArray: string[]
}


export default User