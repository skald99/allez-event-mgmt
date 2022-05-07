import React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"

const LoginForm = () => {

    type login = {
        username: string
        password: string
    }

    const {register, handleSubmit, formState: {errors}} = useForm<login>();
    const onSubmit: SubmitHandler<login> = data => console.log(data);
    const onErrors: SubmitErrorHandler<login> = data => console.log(data);
    
    return(
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-6">
                <div className="mb-6">
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="username">Email/Username: </label>
                        </div>
                        <div className="md:w-3/4">
                            <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-600': ''}`} id="username" type="text" {...register("username", {
                                required: "Please enter your email.",
                                pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Please enter a valid email address"
                            }})}></input>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="username"
                    render={({message}) => (
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>
                <div className="mb-6">
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="password">Password: </label>
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
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>
                <br/>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                       Login
                    </button>
                    <button className="text-blue-500 underline underline-offset-2 ml-16 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                       Forgot Password
                    </button>
                   
                </div>
            </form>
        </div>
    )
}
export default LoginForm;