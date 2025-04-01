import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorroute.js'


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectcloudinary()


// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
// localhost:4000/api/admin
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)
// app.use ('/api/payment', paymentRoutes)
app.get('/api/config/paypal' ,( req,res) =>{
    res.send( process.env.PAYPAL_CLIENT_ID);
})



app.get('/', (req, res)=>{
    res.send('API Working')
})

app.listen(port, ()=> console.log("Server Started", port))
