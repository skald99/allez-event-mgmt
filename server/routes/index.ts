//const eventRoutes = require("./events");
import userRoutes from "./users";

const allRoutes = (app: { use: (arg0: string, arg1: any) => void; }) => {
    //app.use("/events", eventRoutes);
    app.use("/users", userRoutes);

    // app.use("*", (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
    //     res.status(404).json({error: "page not found"});
    // })
}

export default allRoutes;