import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
//DATABASE CONNECTION
const ConnectDB = async () => {
    try {
        const connectionIns = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\nMONGODB CONNECTED!|| DB HOST =>${connectionIns.connection.host}`);
    } catch (error) {
        console.log("ERROR IN CONNECTING DATABASE", error);
        process.exit(1);
    }
};
export default ConnectDB;
