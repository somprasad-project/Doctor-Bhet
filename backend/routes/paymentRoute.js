import express from 'express';
import {
  initiateKhaltiPayment,
  handleKhaltiPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/khalti/initiate', initiateKhaltiPayment);
router.post('/khalti/verify', handleKhaltiPayment);

export default router;
