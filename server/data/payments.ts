import { Event } from "../models/events.model";
import { User } from "../models/user.model";
import Stripe from "stripe";
import "dotenv/config";

let stripe_key : string;
if(process.env.STRIPE_PRIVATE_KEY) {
    stripe_key = process.env.STRIPE_PRIVATE_KEY
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
    images: string[],
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
    billing_scheme: Stripe.Price.BillingScheme
}

interface Address {
    city: string,
    state: string,
    country: string,
    postal_code: string
}

interface EventCustomer {
    id ?: string,
    name: string,
    email: string,
    phone: string,
    metadata: {
        gender: string,
        dateOfBirth: Date
    }
    address: Address,
    shipping: {
        address: Stripe.Emptyable<Stripe.AddressParam>
        name: string,
        phone: string
    }
}

async function addEvent(event: Event) {
    let newEvent: EventProduct = {
        "id": event._id?.toString(),
        "name": event.name,
        "description": event.description,
        "images": event.eventImgs,
        "metadata": {
            "category": event.category.toString(),
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
            unit_amount: price*100,
            billing_scheme: "per_unit",
        }

        let newFee = await stripe.prices.create(eventFee)
        if(newFee) {
            return newFee;
        }
    }
}

async function updateEventRegFee(eventID: string, price: number) {
    if(!eventID) {
        console.log("No event");
        return null;
    }

    let event = await stripe.products.retrieve(eventID);
    if(event) {
        let eventFee = await stripe.prices.list({
            product: event.id
        })
        console.log(eventFee);
    }
}

async function addCustomer(customer: User) {
    let newCustomer: Stripe.CustomerCreateParams = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone.toString(),
        metadata: {
            gender: customer.gender,
        },
        
        shipping: {
            name: customer.name,
            address: customer.address,
            phone: customer.phone.toString()
        }
    } 

    let insertedCustomer = await stripe.customers.create(newCustomer)
    return insertedCustomer;
}

async function searchCustomer(phone: string, name: string) {
    if(!phone || name || phone.trim().length == 0 || name.trim().length == 0) {
        console.log("Incomplete Details");
    } else {
        let {data} = await stripe.customers.search({query: `name: ${name} AND phone: ${phone}`})
        let idList;
        if(data.length > 0) {
            data.forEach(e => {
                idList.push(e.id);
            })
            return idList;
        }
    }
}
async function removeCustomer(customerID: string) {
    if(!customerID) {
        console.log("Invalid Details");
    } else {
        let customer = await stripe.customers.retrieve(customerID);
        if(customer && !Object.keys(customer).includes('deleted')) {
            let delCustomer = await stripe.customers.del(customerID);
            return delCustomer.deleted;
        }
    }
}

async function createSession() {

}

async function expireSession() {

}

async function createPaymentIntent(amount: number, customerId: string, eventId: string, email: string) {

    if(!amount || !customerId || !eventId) {
        console.log('Invalid Details');
    } else {
        let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer> = await stripe.customers.retrieve(customerId);
        if(customer && Object.keys(customer).includes('email')) {
            email = (customer as Stripe.Customer).email!;
        }
        let newPaymentIntent: Stripe.PaymentIntentCreateParams = {
            amount: amount*100,
            customer: customerId,
            currency: 'usd',
            confirm: true,
            receipt_email: email,
            metadata: {
                eventId: eventId
            }
        }

        let createdIntent = await stripe.paymentIntents.create(newPaymentIntent)
        return createdIntent;
    }
}

export default {
    addEvent,
    getEvent,
    removeEvent,
    addEventRegFee,
    updateEventRegFee,
    addCustomer,
    removeCustomer,
    createPaymentIntent
}