import session from 'express-session';
import express from 'express'

declare module 'express-session' {
  export interface Session {
    userId: string;
    userName: string;
  }
}

// function controller(req:express.Request,res:express.Response){
//   req.session.userId
//   req.session.userName
// }

