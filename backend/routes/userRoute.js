import express from 'express'
import { registerUser, loginUser, bookAppointment, resetPassword, forgotPassword, getProfile, updateProfile,changePassword, listAppointment, cancelAppointment} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// import upload from '../middlewares/multer.js';





const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.get('/appointments',authUser ,listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/change-password', authMiddleware, changePassword);



export default userRouter