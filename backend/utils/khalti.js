const axios = require('axios');

const verifyKhaltiPayment = async (token, amount) => {
  try {
    const response = await axios.post(
      process.env.KHALTI_GATEWAY_URL,
      {
        token,
        amount: amount * 100 // Khalti expects amount in paisa (1 Rs = 100 paisa)
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error_key || 'Payment verification failed');
  }
};

module.exports = { verifyKhaltiPayment };