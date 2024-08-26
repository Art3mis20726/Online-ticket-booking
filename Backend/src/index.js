import app from "./app.js";
import ConnectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({path:"./env"})
import cron from 'node-cron';
import axios from 'axios';
cron.schedule('0 0 * * *', async () => {
    try {
        // Hit the refreshSlots endpoint
        await axios.get('http://localhost:8000/api/v1/booking/refreshSlots');
        console.log('Slots refreshed successfully');
    } catch (error) {
        console.error('Error refreshing slots:', error.message);
    }
});

ConnectDB()
.then(()=>{
    app.listen((process.env.PORT),()=>{
        console.log(`Server is running on port ${process.env.PORT}`)

    })}
    
).catch((err) => {
    console.log("MONGODB Conncetion Failed",err)
});
