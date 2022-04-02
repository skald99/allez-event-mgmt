import mongoDB from "mongodb";
import 'dotenv/config';

const {MONGO_URL} = process.env;

export async function connectDB() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_URL!);
    await client.connect();

    const db: mongoDB.Db = client.db("Allez_Event_DB");
    return db;
}