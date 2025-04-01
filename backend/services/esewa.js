const axios = require("axios");
const crypto = require("crypto");

async function getEsewaPaymentHash({ amount, transaction_uuid }) {
  try {
    if (!amount || !transaction_uuid) {
      throw new Error("Amount and transaction_uuid are required.");
    }
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");
    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    console.error("Error generating eSewa payment hash:", error);
    throw error;
  }
}

async function verifyEsewaPayment(encodedData) {
  try {
    const decodedData = JSON.parse(
      Buffer.from(encodedData, "base64").toString("utf-8")
    );
    if (
      !decodedData.transaction_code ||
      !decodedData.status ||
      !decodedData.total_amount ||
      !decodedData.transaction_uuid ||
      !decodedData.signature
    ) {
      throw new Error("Invalid decoded data from eSewa.");
    }
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");
    if (hash !== decodedData.signature) {
      throw new Error("Invalid signature in eSewa response.");
    }
    const response = await axios.get(
      `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status`,
      {
        params: {
          product_code: process.env.ESEWA_PRODUCT_CODE,
          total_amount: decodedData.total_amount,
          transaction_uuid: decodedData.transaction_uuid,
        },
      }
    );
    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw new Error("Invalid transaction details from eSewa API.");
    }
    return { response: response.data, decodedData };
  } catch (error) {
    console.error("Error verifying eSewa payment:", error);
    throw error;
  }
}

module.exports = { getEsewaPaymentHash, verifyEsewaPayment };