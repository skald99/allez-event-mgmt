import { ObjectId } from "mongodb"
import {Binary} from "bson"
// import * as connections from "../config/mongoConnection";

interface Chunk {
    "_id" : ObjectId,
    "files_id" : ObjectId,
    "n" : number,
    "data" : Binary
  }

export {Chunk}