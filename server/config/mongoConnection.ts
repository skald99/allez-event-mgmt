import * as mongoDB from "mongodb";
const config = process.env;

let _connection: mongoDB.MongoClient, _db: mongoDB.Db;



export async function connectDB() {
    if(!_connection) {
        // const clientDB = new mongoDB.MongoClient(MONGO_URL!);
        _connection = await mongoDB.MongoClient.connect(config.MONGO_URL!);
        _db = _connection.db(config.DB_NAME);
    }
    return _db;   
}


export function closeConnection() : void {
_connection.close();
console.log("Hello")
}