import React from "react";
import { SubmitHandler, SubmitErrorHandler, Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns";
import axios from "axios";
import User from "../models/user.model";
// import { DatePicker } from "react-widgets/cjs";


const SignupForm = (props: {className: string, userStatus: (status: number) => void}) => {
    type UserSignup = {
        name: string,
        email: string,
        password: string,
        confirm_password: string,
        phone: number,
        address: {
            city: string,
            state: string,
            zip: string,
            country: string
        },
        gender: string,
        dateOfBirth: string,
    }
    
    type NewUser = {
        user: User,
        password: string
    }

    const {register, handleSubmit, control, formState: {errors}, getValues} = useForm<UserSignup>();
    const [dob, setDob] = React.useState<Date>();
    const onSubmit: SubmitHandler<UserSignup> = async data => {
        let newUser: User = {
            name: data.name,
            address: {
                city: data.address.city,
                state: data.address.state,
                postal_code: data.address.zip,
                country: data.address.country
            },
            phone: data.phone,
            gender: data.gender,
            email: data.email,
            dateOfBirth: new Date(data.dateOfBirth)
        }
        console.log(newUser);
        let password: string = data.password;

        let inputUser: NewUser = {
            user: newUser,
            password: password
        }
        
        let user = await axios.post("http://localhost:4000/users/signup", inputUser)
        if(user.status === 200 && user.statusText === "OK") {
            window.sessionStorage.setItem("userId", user.data.userId);
            // console.log(window.sessionStorage.getItem("userId"));
            props.userStatus(200);
        }
    };
    const onErrors: SubmitErrorHandler<UserSignup> = data => console.log(data);
    
    return(
        <div className={`w-full ${props.className}`}>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="px-8 pt-6 pb-8 mx-6 mb-4 bg-white rounded shadow-md">
            <h1 className="flex justify-center mt-12 mb-10 font-sans text-4xl font-bold text-gray-700">
                    Sign up
                </h1>
                <div className="grid grid-cols-1 mx-3 divide-y-2">
                    <div>
                        <div className="mb-6">
                            <div className="md:flex md:items-center">
                                <div className="md:w-1/4">
                                    <label className="block pr-4 mb-0 text-sm font-bold text-gray-700 md:text-left" htmlFor="name">Name: </label>
                                </div>
                                <div className="md:w-3/4">
                                    <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-600': ''}`} id="name" type="text" {...register("name", {required: "Please enter a name"})}></input>
                                </div>
                            </div>
                            <ErrorMessage errors={errors} name="name"
                            render={({message}) => (
                                <small className="mb-6 text-red-400">{message}</small>
                                )}
                            />
                        </div>

                        <div className="mb-6">
                            <div className="md:flex md:items-center">
                                <div className="md:w-1/4">
                                    <label className="block pr-4 mb-0 text-sm font-bold text-gray-700 md:text-left" htmlFor="email">Email: </label>
                                </div>
                                <div className="md:w-3/4">
                                    <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${errors.email ? 'border-red-600': ''}`} id="email" type="text" {...register("email", {required: "Please enter an email", pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Please enter a valid email address"
                                    }})}></input>
                                </div>
                            </div>
                            <ErrorMessage errors={errors} name="email"
                            render={({message}) => (
                                <small className="mb-6 text-red-400">{message}</small>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> 
                            <div className="mb-6">
                                <div className="md:flex md:items-center ">
                                    <div className="md:w-1/4">
                                        <label className="block pr-4 mb-0 text-sm font-bold text-gray-700 md:text-left" htmlFor="password">Password: </label>
                                    </div>
                                    <div className="md:w-3/4">
                                        <input className={`shadow appearance-none border-2 
                                            border-gray-200 w-full rounded py-2 px-3 text-gray-700 
                                            leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-600': ''}`} 
                                            id="password" type="password" 
                                            {...register("password", {
                                                required: "Please enter a password", 
                                                pattern: {
                                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                    message: "Password must contain atleast 8 letters, consisting of atleast 1 special character, letter and number."
                                                    }
                                                }
                                            )}
                                        />
                                    </div>
                                </div>
                                <ErrorMessage errors={errors} name="password"
                                render={({message}) => (
                                    <small className="mb-6 text-red-400">{message}</small>
                                    )}
                                />
                            </div>
                            <div className="mb-6">
                                <div className="md:flex md:items-center">
                                    <div className="md:w-1/4">
                                        <label className="block pr-4 mb-6 text-sm font-bold text-gray-700 md:text-left" htmlFor="confirm_password">Confirm Password: </label>
                                    </div>
                                    <div className="md:w-3/4">
                                        <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 ${errors.confirm_password ? 'border-red-600': ''}`} id="confirm_password" type="password" {...register("confirm_password", {validate: (value) => {
                                            const {password} = getValues();
                                            return password === value || 'Passwords should match'
                                        }})}></input>
                                    </div>
                                </div>
                                <ErrorMessage errors={errors} name="confirm_password"
                                render={({message}) => (
                                    <small className="mb-6 text-red-400">{message}</small>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-8">
                            <div className="col-span-4 col-start-1 mt-6 mb-6 ml-7">
                                <div>
                                    <label className="block mb-4 text-sm font-bold text-gray-700" htmlFor="category">Gender: </label>
                                </div>
                                <div>
                                    <div>
                                        <div className="grid lg:grid-cols-3 md:grid-cols-1">
                                            <div className="mt-6 md:mt-2">
                                                <label className="block pr-4 mb-6 text-sm font-semibold text-gray-700 md:text-left md:mb-2" htmlFor="malegender">
                                                    <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Male" id="malegender" className="mb-1 mr-4"/>
                                                    Male
                                                </label>
                                            </div>
                                            <div className="mt-6 md:mt-2">
                                                <label className="block pr-4 mb-6 text-sm font-semibold text-gray-700 md:text-left md:mb-2" htmlFor="femalegender">
                                                    <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Female" id="femalegender" className="mb-1 mr-4"/>
                                                    Female
                                                </label>
                                            </div>
                                            <div className="mt-6 md:mt-2">
                                                <label className="block pr-4 mb-6 text-sm font-semibold text-gray-700 md:text-left" htmlFor="othergender">
                                                    <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Other" id="othergender" className="mb-1 mr-4"/>
                                                    Other
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ErrorMessage errors={errors} name="gender"
                                render={({message}) => (
                                    <small className="mb-6 text-red-400">{message}</small>
                                    )}
                                />
                            </div>
                            <div className="col-span-6 col-end-12">
                                <div className={"mb-6 mt-6"}>
                                    <div>
                                        <label className="block pr-4 mb-6 text-sm font-bold text-gray-700" htmlFor="phone">Phone: </label>
                                    </div>
                                    <div>
                                        <div>
                                            <input className={`shadow border-2 border-gray-200 w-full focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start ${errors.phone ? 'border-red-600': ''}`} 
                                                id="phone" type="tel" maxLength={10} {...register("phone", {required: "Please enter a valid phone number.", pattern: {
                                                    value: /[0-9]{10}/,
                                                    message: "Please enter a valid number"
                                                } })}/>
                                        </div>
                                    </div>
                                    <ErrorMessage errors={errors} name="phone"
                                        render={({message}) => (
                                        <small className="mb-6 text-red-400">{message}</small>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                                <div className="mb-2 md:flex md:items-center">
                                    <div className="mr-3 md:w-1/4">
                                        <label htmlFor="dateOfBirth" className="block mb-0 text-sm font-bold text-gray-700 md:text-left">Date of Birth: </label>
                                    </div>
                                    <div className="ml-3 md:w-3/4">
                                        <Controller
                                            control={control}
                                            name="dateOfBirth"
                                            rules={{
                                                required: "Please enter your date of birth.",
                                            }}
                                            render={({ field: {onChange, value, ref} }) => (
                                            <DatePicker
                                                ref={ref}
                                                placeholderText="Select date"
                                                onChange={(selected: Date) => {
                                                    onChange(selected)
                                                    setDob(selected);
                                                    return selected;
                                                }}
                                                selected={dob}
                                                value={value}
                                                dateFormat="MM/dd/yyyy"
                                                maxDate={subYears(new Date(),5)}
                                                showMonthDropdown
                                                showYearDropdown
                                                fixedHeight
                                                className={`shadow border-2 border-gray-200 w-72 focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start ${errors.dateOfBirth ? "border-red-600": ""}`}
                                            />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <ErrorMessage errors={errors} name="dateOfBirth"
                        render={({message}) => (
                            <small className="mt-6 mb-6 text-red-400">{message}</small>
                            )}
                        />
                    </div>
                    <br/>
                    <div>
                        <p className="block mt-3 mb-0 text-lg font-bold text-gray-700">Address</p>
                        <br/>
                        <div className="flex justify-around mx-8">
                            <div>
                                <div className="mb-6">
                                    <div className="md:flex md:items-center ">
                                        <div className="md:w-1/4">
                                            <label className="block mb-0 mr-1 text-sm font-bold text-gray-700" htmlFor="city">City: </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input className={`shadow appearance-none border-2 ml-1
                                                border-gray-200 w-full rounded py-2 px-3 text-gray-700 
                                                leading-tight focus:outline-none focus:shadow-outline ${errors.address?.city ? 'border-red-600': ''}`} 
                                                id="city" type="text" 
                                                {...register("address.city", {required: "Please enter a city"})}
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage errors={errors} name="address"
                                    render={({message}) => (
                                        <small className="mb-6 text-red-400">{message}</small>
                                        )}
                                    />
                                </div>
                                <div className="mb-6">
                                    <div className="md:flex md:items-center ">
                                        <div className="md:w-1/4">
                                            <label className="block mb-0 mr-1 text-sm font-bold text-gray-700" htmlFor="state">State: </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input className={`shadow appearance-none border-2 
                                                border-gray-200 w-full rounded py-2 px-3 text-gray-700 
                                                leading-tight focus:outline-none focus:shadow-outline ${errors.address?.state ? 'border-red-600': ''}`} 
                                                id="state" type="text" 
                                                {...register("address.state", {
                                                    required: "Please enter a state"})}
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage errors={errors} name="address.state"
                                    render={({message}) => (
                                        <small className="mb-6 text-red-400">{message}</small>
                                        )}
                                    />
                                </div>
                            </div>
                            <div>

                                <div className="mb-6">
                                    <div className="md:flex md:items-center ">
                                        <div className="md:w-1/4">
                                            <label className="block mb-0 mr-1 text-sm font-bold text-gray-700" htmlFor="country">Country: </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input className={`shadow appearance-none border-2 
                                                border-gray-200 w-full rounded py-2 px-3 text-gray-700 
                                                leading-tight focus:outline-none focus:shadow-outline ${errors.address?.country ? 'border-red-600': ''}`} 
                                                id="text" type="text" 
                                                {...register("address.country", {
                                                    required: "Please enter a country"})}
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage errors={errors} name="address.country"
                                    render={({message}) => (
                                        <small className="mb-6 text-red-400">{message}</small>
                                        )}
                                    />
                                </div>
                                <div className="mb-6">
                                    <div className="md:flex md:items-center ">
                                        <div className="md:w-1/4">
                                            <label className="block mb-0 mr-1 text-sm font-bold text-gray-700" htmlFor="zip">Zip: </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input className={`shadow appearance-none border-2 
                                                border-gray-200 w-full rounded py-2 px-3 text-gray-700 
                                                leading-tight focus:outline-none focus:shadow-outline ${errors.address?.zip ? 'border-red-600': ''}`} 
                                                id="zip" type="number" maxLength={6} {...register("address.zip", {required: "Please enter a valid zipcode.", pattern: {
                                                    value: /[0-9]{5,6}/,
                                                    message: "Please enter a valid zipcode"
                                                } })}
                                            />
                                        </div>
                                    </div>
                                    <ErrorMessage errors={errors} name="address.zip"
                                    render={({message}) => (
                                        <small className="mb-6 text-red-400">{message}</small>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                <div>
                    <button className="px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="submit">
                       Sign Up
                    </button>
                   
                </div>
            </div>
            </form>
        </div>
    )
}

export default SignupForm;