import React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import axios from "axios";

const LoginForm = (props: {className: string}) => {

    type login = {
        email: string
        password: string
    }

    const {register, handleSubmit, formState: {errors}} = useForm<login>();
    const onSubmit: SubmitHandler<login> = async data => {
        let user = await axios.post("http://localhost:4000/users/login", data)
        console.log(user);
    };
    const onErrors: SubmitErrorHandler<login> = data => console.log(data);
    
    return(
        <div className={`w-full ${props.className} overflow-y-hidden`}>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="px-8 pt-6 pb-8 mx-6 mb-4 bg-white rounded shadow-md h-[48em]">
                <div className="mb-6">
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/4">
                            <label className="block pr-4 mb-0 text-sm font-bold text-gray-700 md:text-left" htmlFor="username">Email/Username: </label>
                        </div>
                        <div className="md:w-3/4">
                            <input className={`shadow appearance-none border-2  border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-600': ''}`} id="username" type="text" {...register("email", {
                                required: "Please enter your email.",
                                pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Please enter a valid email address"
                            }})}></input>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="username"
                    render={({message}) => (
                        <small className="mb-6 text-red-400">{message}</small>
                        )}
                    />
                </div>
                <div className="mb-6">
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/4">
                            <label className="block pr-4 mb-0 text-sm font-bold text-gray-700 md:text-left" htmlFor="password">Password: </label>
                        </div>
                        <div className="md:w-3/4">
                            <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-600': ''}`} id="password" type="password" {...register("password", {
                                required: "Please enter a password",
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    message: "Password must contain atleast 8 letters, consisting of atleast 1 special character, letter and number."
                                    }
                            })}></input>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="password"
                    render={({message}) => (
                        <small className="mb-6 text-red-400">{message}</small>
                        )}
                    />
                </div>
                <br/>
                <div>
                    <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="submit">
                       Login
                    </button>
                    <button className="px-4 py-2 ml-16 text-blue-500 underline rounded underline-offset-2 focus:outline-none focus:shadow-outline" type="submit">
                       Forgot Password
                    </button>
                </div>
            </form>
        </div>
    )
}
export default LoginForm;