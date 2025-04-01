const { getEsewaPaymentHash, verifyEsewaPayment } = require("../utils/esewa");

// Initiate eSewa Payment
const initiatePayment = async (req, res) => {
  try {
    const { amount, transaction_uuid } = req.body;
    const paymentHash = await getEsewaPaymentHash({ amount, transaction_uuid });
    res.status(200).json(paymentHash);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify eSewa Payment
const verifyPayment = async (req, res) => {
  try {
    const { encodedData } = req.body;
    const verificationResult = await verifyEsewaPayment(encodedData);
    res.status(200).json(verificationResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { initiatePayment, verifyPayment };