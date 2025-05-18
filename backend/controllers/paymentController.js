import { initializeKhaltiPayment, verifyKhaltiPayment } from '../services/khalti.js';
import { createPayment, updatePaymentStatus } from '../models/payment.js';
import appointmentModel from '../models/appointmentModel.js';

export const initiateKhaltiPayment = async (req, res) => {
    try {
        const { amount, appointmentId, customerInfo } = req.body;

        // Validate required fields
        if (!amount || !appointmentId) {
            console.error('Missing required fields:', { amount, appointmentId });
            return res.status(400).json({
                success: false,
                message: "Amount and appointment ID are required"
            });
        }

        // Check if appointment exists
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            console.error('Appointment not found:', appointmentId);
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Validate appointment status
        if (appointment.cancelled) {
            console.error('Appointment is cancelled:', appointmentId);
            return res.status(400).json({
                success: false,
                message: "Cannot process payment for a cancelled appointment"
            });
        }

        if (appointment.payment) {
            console.error('Appointment is already paid:', appointmentId);
            return res.status(400).json({
                success: false,
                message: "Payment already processed for this appointment"
            });
        }

        // Initialize payment with Khalti
        const customer = {
            name: customerInfo?.name || appointment.userData?.name || 'Patient',
            email: customerInfo?.email || appointment.userData?.email || 'patient@example.com',
            phone: customerInfo?.phone || appointment.userData?.phone || '9800000000'
        };

        console.log('Initiating Khalti payment:', { amount, appointmentId, customer });
        const khaltiResponse = await initializeKhaltiPayment(amount, appointmentId, customer);

        // Create payment record
        const payment = await createPayment({
            appointmentId,
            amount,
            paymentMethod: 'Khalti',
            transactionId: khaltiResponse.pidx,
            status: 'pending'
        });

        res.json({
            success: true,
            payment_url: khaltiResponse.payment_url,
            pidx: khaltiResponse.pidx
        });
    } catch (error) {
        console.error('Payment initiation error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to initiate payment'
        });
    }
};

export const handleKhaltiPayment = async (req, res) => {
    try {
        const { pidx, appointmentId } = req.body;

        if (!pidx || !appointmentId) {
            console.error('Missing required fields:', { pidx, appointmentId });
            return res.status(400).json({
                success: false,
                message: 'Payment ID and appointment ID are required'
            });
        }

        // Verify payment with Khalti
        const verificationResponse = await verifyKhaltiPayment(pidx);
        console.log('Payment verification response:', verificationResponse);

        if (verificationResponse.status === 'completed') {
            // Update payment status
            await updatePaymentStatus(pidx, 'completed');

            // Update appointment payment status
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                payment: true
            });

            res.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            console.error('Payment verification failed:', verificationResponse);
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                status: verificationResponse.status
            });
        }
    } catch (error) {
        console.error('Payment verification error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify payment'
        });
    }
};
