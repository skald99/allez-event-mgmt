import { ObjectId } from "mongodb";
import { type } from "os";
import { Event } from "../models/events.model";
import Stripe from "stripe";
import "dotenv/config";

let stripe_key : string;
if(process.env.STRIPE_PUBLIC_KEY) {
    stripe_key = process.env.STRIPE_PUBLIC_KEY
} else {
    throw new Error("Stripe Key is not set");
}

const stripe = new Stripe( stripe_key, {
    apiVersion: '2020-08-27'
});

interface EventProduct {
    id ?: string,
    name: string,
    description: string,
    images: [],
    metadata: {
        category: string,
        totalSeats: number,
        hostId: string,
        minAge: number,
    }
}


interface EventPrice {
    id ?: string,
    product: string,
    currency: string,
    unit_amount: number,
    billing_scheme: Stripe.Price.BillingScheme,
    type: Stripe.Price.Type
}


async function addEvent(event: Event) {
    let newEvent: EventProduct = {
        "id": event._id?.toString(),
        "name": event.name,
        "description": event.description,
        "images": event.eventImgs,
        "metadata": {
            "category": event.category,
            "totalSeats": event.totalSeats,
            "hostId": event.hostId.toString(),
            "minAge": event.minAge
        }
    }

    let insertedEvent = await stripe.products.create(newEvent);
    console.log(insertedEvent);
    if(insertedEvent){
        return true;
    } 
    return false;
}

async function getEvent(eventID: string) {
    if(!eventID) {
        console.log('Test');
        return null;
    }
    else {
        let event = await stripe.products.retrieve(eventID);
        return event;
    }
}

async function removeEvent(eventID: string) {
    if(!eventID) {
        console.log('Test');
        return null;
    } else {
        let event = await stripe.products.retrieve(eventID);
        if(event) {
            //Remove prices associated with event before deleting event
            let delEvent = await stripe.products.del(eventID);
        }
    }
}

async function addEventRegFee(eventID: string, price: number) {
    if(!eventID) {
        console.log("No event");
        return null;
    }

    let event = await stripe.products.retrieve(eventID);
    if(event) {
        let eventFee: EventPrice = {
            product: eventID,
            currency: "usd",
            unit_amount: price,
            billing_scheme: "per_unit",
            type: "one_time"
        }

        let newFee = await stripe.prices.create(eventFee)
        if(newFee) {
            return newFee;
        }
    }




}
export default {
    addEvent,
    getEvent,
    removeEvent,
    addEventRegFee
}