import React from "react"
import { Link } from "react-router-dom"
 

const Navigation = () => {

    return (
        <div >
            <nav className="sticky px-2 py-2 mb-2 bg-gray-600 border-gray-200 sm:px-4 dark:bg-gray-800">
                <div>
                    <div className="flex justify-between">
                        <Link to={"/"} className="px-6 py-2 mx-5 my-2 font-sans text-white transition ease-in-out delay-300 rounded-md bg-slate-500 hover:bg-slate-300 hover:text-slate-800">Home</Link>
                        <div className="flex">
                            <Link to={"/eventDashboard"} className = "px-6 py-2 mx-5 my-2 font-sans text-white transition ease-in-out delay-300 rounded-md bg-slate-500 hover:bg-slate-300 hover:text-slate-800">Dashboard</Link>
                            <Link to={"/eventDashboard"} className = "px-6 py-2 mx-5 my-2 font-sans text-white transition ease-in-out delay-300 rounded-md bg-slate-500 hover:bg-slate-300 hover:text-slate-800">Test</Link>
                        </div>
                        <div className="flex">
                        <Link to={"/users"} className = "px-6 py-2 mx-5 my-2 font-sans text-white transition ease-out delay-300 bg-blue-700 rounded-md hover:bg-blue-300 hover:text-slate-800">Login/Signup</Link>
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navigation