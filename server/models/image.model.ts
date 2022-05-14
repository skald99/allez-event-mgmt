import { ObjectId } from "mongodb"
// import * as connections from "../config/mongoConnection";

interface Image {
    "_id" : ObjectId,
    "length" : number,
    "chunkSize" : number,
    "uploadDate" : Date,
    "md5" : string,
    "filename" : string,
    "contentType" : string,
    "aliases" : string[],
    "metadata" : any,
  }

export {Image}