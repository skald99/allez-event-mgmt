import React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import Select, { SingleValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns";


const SignupForm = () => {
    type UserSignup = {
        name: string
        email: string
        password: string
        address: {
            city: string,
            state: string,
            zip: string
        },
        gender: string,
        dateOfBirth: string,
    }
    
    const {register, handleSubmit, control, formState: {errors}} = useForm<UserSignup>();
    const [dob, setDob] = React.useState<Date>();
    const onSubmit: SubmitHandler<UserSignup> = data => console.log(data);
    const onErrors: SubmitErrorHandler<UserSignup> = data => console.log(data);
    
    return(
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-6">
                <div className="grid grid-cols-1 divide-y-2">
                    <div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="name">Name: </label>
                            </div>
                            <div className="md:w-3/4">
                                <input className="shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" {...register("name")}></input>
                            </div>
                        </div>

                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="email">Email: </label>
                            </div>
                            <div className="md:w-3/4">
                                <input className="shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" {...register("email")}></input>
                            </div>
                        </div>

                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="password">Password: </label>
                            </div>
                            <div className="md:w-3/4">
                                <input className="shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" {...register("password")}></input>
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label className="block text-gray-700 text-sm font-bold md:text-left pr-4 mb-6" htmlFor="password">Confirm Password: </label>
                            </div>
                            <div className="md:w-3/4">
                                <input className="shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6" id="password" type="password" {...register("password")}></input>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="mb-6 mt-6">
                            <div className="md:flex md:items-center">
                                <div className="md:w-1/3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2 md:text-left pr-4" htmlFor="category">Gender: </label>
                                </div>
                                <div className="md:w-2/3">
                                    <div className="grid lg:grid-cols-3 md:grid-cols-1">
                                        <div className="mt-6 md:mt-2">
                                            <label className="block text-gray-700 text-sm font-semibold md:text-left pr-4 mb-6 md:mb-2" htmlFor="malegender">
                                                <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Male" id="malegender" className="mr-4 mb-1"/>
                                                Male
                                            </label>
                                        </div>
                                        <div className="mt-6 md:mt-2">
                                            <label className="block text-gray-700 text-sm font-semibold md:text-left pr-4 mb-6 md:mb-2" htmlFor="femalegender">
                                                <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Female" id="femalegender" className="mr-4 mb-1"/>
                                                Female
                                            </label>
                                        </div>
                                        <div className="mt-6 md:mt-2">
                                            <label className="block text-gray-700 text-sm font-semibold md:text-left pr-4 mb-6" htmlFor="othergender">
                                                <input {...register("gender", { required: "Please select a gender." })} type="radio" value="Other" id="othergender" className="mr-4 mb-1"/>
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                    
                                    
                                    {/* <Controller
                                        control={control}
                                        name="gender"
                                        render={({field: {onChange}}) => (
                                            <Select
                                                id="category"
                                                className="focus: shadow-none"
                                                options={[
                                                    {value: "Male", label: "Male"},
                                                    {value: "Female", label: "Female"},
                                                    {value: "Other", label: "Other"},
                                                ]}
                                                onChange={(newVal: SingleValue<{value: string, label: string}>) => {
                                                    onChange((newVal!.value))
                                                }}
                                                />
                                        )}
                                        rules={{
                                            required: "Please select a category."
                                        }}/> */}
                                </div>
                            </div>
                            <ErrorMessage errors={errors} name="gender"
                            render={({message}) => (
                                <small className="text-red-400 mb-6">{message}</small>
                                )}
                            />
                        </div>
                        <div className="mb-6 md:flex md:items-center">
                            <div className="md:w-1/4">
                                <label htmlFor="eventTimeStamp" className="block text-gray-700 text-sm font-bold mb-0 md:text-left">Date of Birth: </label>

                            </div>
                            <div className="md:w-3/4">
                                <Controller
                                    control={control}
                                    name="dateOfBirth"
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
                                        className="shadow border-2 border-gray-200 w-72 focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start"
                                        
                                    />
                                    )}
                                />
                            </div>
                    
                        </div>
                        <br/>
                    </div>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                       Sign Up
                    </button>
                   
                </div>
            </div>
            </form>
        </div>
    )
}

export default SignupForm;