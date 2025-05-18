import express from 'express'
import axios from 'axios'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorroute.js'
// import paymentRouter from './routes/paymentRoute.js'
import khaltiRoutes from './routes/khalti.js';

// import symptomRoutes from './routes/symptomRoutes.js';




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
// app.use('/api/payment', paymentRouter)
app.use('/khalti', khaltiRoutes);




// app.use ('/api/payment', paymentRoutes)
// app.get('/api/config/paypal' ,( req,res) =>{
//     res.send( process.env.PAYPAL_CLIENT_ID);
// })

// // Routes
// app.use('/api/symptoms', symptomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.get('/', (req, res)=>{
    res.send('API Working')
})

// ✅ Run the email reminder cron job
import './cronJobs/reminderJob.js';


app.listen(port, ()=> console.log("Server Started", port))
