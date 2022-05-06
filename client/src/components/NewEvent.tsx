import * as React from "react";
import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import Select, { MultiValue } from "react-select";
import { Loader } from "@googlemaps/js-api-loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

type newEventData = {
    eventName: string;
    price: number;
    description: string;
    totalSeats: number;
    minAge: number;
    active: boolean;
    category: string;
    eventTimeStamp: string;
    venue: {
        address: string,
        city: string,
        state: string,
        zip: string,
        // geoLocation: {lat: number, long: number}
    };

}

const NewEvent = () => {
    
    const [eventData, setEventData] = React.useState<newEventData|undefined>(undefined);
    const {register, handleSubmit, formState: {errors}, control, watch} = useForm<newEventData>();
    const onSubmit: SubmitHandler<newEventData> = data => setEventData(data);
    const onErrors: SubmitErrorHandler<newEventData> = data => console.log(data);
    const [venue, setVenue] = React.useState(undefined);
    const [selectedDate, setSelectedDate] = React.useState<Date>();
    console.log(eventData);
    let map: google.maps.Map;

    const loader = new Loader({
        apiKey: process.env.GOOGLE_MAPS_API!,
        version: "weekly",
        libraries: ["places"]
    })

    console.log(watch("eventTimeStamp"))
    let predictionInput = document.getElementById("venue");
    
    // React.useEffect(() => {
    //     let options = {
    //         bounds: 
    //     }
    // },[venue])
    return(
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="eventName">Event Name: </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${errors.eventName ? 'border-red-600': ''}`} id="eventName" type="text" {...register("eventName", {required: {value: true, message: "Please enter a name for the event."}})}></input>
                        <small className="text-red-400">
                            {errors.eventName && errors.eventName.message}
                        </small>
                    </div>
                </div>

                <div className={"mb-6"}>
                    <div className="md:flex md:items-center">
                        <div className="md:w-2/3">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="price">Registration Fee: </label>
                        </div>
                        <div className="md:w-1/3">
                            <input className={`shadow border-2 border-gray-200 w-full focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start ${errors.price ? 'border-red-600': ''}`} 
                                id="price" type="number" min={0} {...register("price", {required: "Please enter a valid registration fee for the event, or enter 0 if free.", valueAsNumber: true })}/>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="price"
                    render={({message}) => (
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>

                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-700 text-sm font-bold mb-5 md:text-left pr-4" htmlFor="description">Description: </label>
                    </div>
                    <div className="md:w-2/3">
                        <textarea rows={6} className={`shadow appearance-none border-2 border-gray-200 w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${errors.description ? 'border-red-600': ''}`} id="description" {...register("description", {required: "Please enter a description for the event."})}/>
                        <br/>
                        <small className="text-red-400">
                            {errors.description && errors.description.message}
                        </small>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="category">Category: </label>
                        </div>
                        <div className="md:w-2/3">
                            <Controller
                                control={control}
                                name="category"
                                render={({field: {onChange}}) => (
                                    <Select
                                        id="category"
                                        className="focus: shadow-none"
                                        options={[
                                            {value: "Career", label: "Career"},
                                            {value: "Music", label: "Music"},
                                            {value: "Food and Drink", label: "Food and Drink"},
                                            {value: "Charity", label: "Charity"},
                                            {value: "Exploration", label: "Exploration"},
                                            {value: "Entertainment", label: "Entertainment"},
                                            {value: "Night Life", label: "Night Life"},
                                            {value: "Other", label: "Other"}
                                        ]}
                                        onChange={(newVal: MultiValue<{value: string, label: string}>) => {
                                            onChange((newVal.map(e => e.value)))
                                        }}
                                        isMulti
                                        />
                                )}
                                rules={{
                                    required: "Please select a category."
                                }}/>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="category"
                    render={({message}) => (
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>
                <br/>
                
                <div className={"mb-6"}>
                    <div className="md:flex md:items-center">
                        <div className="md:w-2/3">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="totalSeats">Total Seats: </label>
                        </div>
                        <div className="md:w-1/3">
                            <input className={`shadow border-2 border-gray-200 w-full focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start ${errors.totalSeats ? 'border-red-600': ''}`} 
                                id="totalSeats" type="number" min={0} {...register("totalSeats", {required: "Please enter a valid number for the total seats", valueAsNumber: true })}/>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="totalSeats"
                    render={({message}) => (
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>

                <br/>
                <div className={"mb-6"}>
                    <div className="md:flex md:items-center">
                        <div className="md:w-2/3">
                            <label className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4" htmlFor="minAge">Minimum Age: </label>
                        </div>
                        <div className="md:w-1/3">
                            <input className={`shadow border-2 border-gray-200 w-full focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start ${errors.minAge ? 'border-red-600': ''}`} 
                                id="minAge" type="number" min={0} {...register("minAge", {required: "Please enter a valid registration fee for the event, or enter 0 if free.", valueAsNumber: true })}/>
                        </div>
                    </div>
                    <ErrorMessage errors={errors} name="minAge"
                    render={({message}) => (
                        <small className="text-red-400 mb-6">{message}</small>
                        )}
                    />
                </div>
                <br/>
                <div className="grid grid-cols-2 mb-6">
                    <div>
                        <label htmlFor="eventTimeStamp" className="block text-gray-700 text-sm font-bold mb-0 md:text-left pr-4">Event Date: 
                        <Controller
                            control={control}
                            name="eventTimeStamp"
                            render={({ field: {onChange, value, ref} }) => (
                            <DatePicker
                                ref={ref}
                                placeholderText="Select date"
                                onChange={(selected: Date) => {
                                    onChange(selected)
                                    setSelectedDate(selected);
                                    return selected;
                                  }}
                                selected={selectedDate}
                                value={value}
                                dateFormat="MM/dd/yyyy"
                                minDate={addDays(new Date(), 1)}
                                fixedHeight
                                className="mt-2 shadow border-2 border-gray-200 w-72 focus:m-0 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline content-start"
                                
                            />
                            )}
                        />
                        </label>
                    </div>
                    <div className="mx-4 mt-9">
                        <label htmlFor="active" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="active" value={""} className="sr-only peer" {...register("active")}/>
                            <div className="h-6 bg-gray-200 border-2 border-gray-200 rounded-full w-11 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:h-5 after:w-5 after:shadow-sm after:rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600 peer-checked:border-blue-600 after:transition-all after:duration-300"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                        </label>
                    </div>
                </div>
                <br/>
                <div className="">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Add Event
                    </button>
                   
                </div>
            </form>
        </div>
    )
}

export default NewEvent;