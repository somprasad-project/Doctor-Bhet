import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Khalti']
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

export const createPayment = async (paymentData) => {
    try {
        const payment = new Payment(paymentData);
        await payment.save();
        return payment;
    } catch (error) {
        throw new Error('Failed to create payment record: ' + error.message);
    }
};

export const updatePaymentStatus = async (transactionId, status) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { status },
            { new: true }
        );
        return payment;
    } catch (error) {
        throw new Error('Failed to update payment status: ' + error.message);
    }
};

export default Payment; 