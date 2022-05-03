// const eventRoutes = require("./events");

import userRoutes from "./users";
import eventRoutes from "./events"

const allRoutes = (app: { use: (arg0: string, arg1: any) => void; }) => {
    //app.use("/events", eventRoutes);
    console.log("inside routes index file");
    app.use("/users", userRoutes);
    app.use("/events", eventRoutes)
    // app.use("*", (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
    //     res.status(404).json({error: "page not found"});
    // })
}

export default allRoutes;