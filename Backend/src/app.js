import express from "express"
import cors from"cors"
import cookieParser from "cookie-parser"
const app= express()
app.use(cors({
    origin:['http://localhost:3000','http://127.0.0.1:3000'],
    credentials:true
}))
app.use(express.json({
    limit:"1000kb"
}))
app.use(express.urlencoded({
    extended:true,limit:"1000kb"
}))
app.use(express.static("public"))

app.use(cookieParser())
import userRoutes from "./routes/user.routes.js"
import museumRoutes from"./routes/museum.routes.js"
import bookingRoutes from './routes/booking.routes.js';
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/museum",museumRoutes)
app.use("/api/v1/booking",bookingRoutes)
export default app