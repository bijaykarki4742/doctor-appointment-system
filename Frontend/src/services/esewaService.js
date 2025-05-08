// eSewa Payment Integration Service for UAT (Mock Version)
// This is a simplified version for local testing without external dependencies

// eSewa UAT (Test) Configuration
const ESEWA_CONFIG = {
  merchantId: 'EPAYTEST', // Test merchant ID
  successUrl: 'http://localhost:5173/payment-success', // Redirect URL after successful payment
  failureUrl: 'http://localhost:5173/payment-failure', // Redirect URL after failed payment
  testUrl: 'https://uat.esewa.com.np/epay/main', // UAT environment URL
};

/**
 * Generates a unique transaction ID
 * @returns {string} Transaction ID for mock payments
 */
const generateTransactionId = () => {
  return 'MOCK-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
};

/**
 * Initiates a mock eSewa payment
 * @param {Object} paymentDetails - Payment details
 * @param {string} paymentDetails.amount - Payment amount
 * @param {string} paymentDetails.productId - Unique product/service ID
 * @param {string} paymentDetails.productName - Product/service name
 * @returns {Object} Mock payment data
 */
export const initiateEsewaPayment = (paymentDetails) => {
  const { amount, productId, productName } = paymentDetails;
  
  // Validate required parameters
  if (!amount || !productId) {
    throw new Error('Amount and productId are required for eSewa payment');
  }

  console.log(`Initiating mock eSewa payment: Amount=${amount}, ProductID=${productId}`);

  // Generate a unique transaction ID
  const transactionId = generateTransactionId();
  
  // Format parameters for mock eSewa payment
  const params = {
    amount: amount,
    productId: productId,
    productName: productName || 'Doctor Appointment',
    transactionId: transactionId,
    merchantId: ESEWA_CONFIG.merchantId,
    successUrl: ESEWA_CONFIG.successUrl,
    failureUrl: ESEWA_CONFIG.failureUrl
  };

  return {
    url: ESEWA_CONFIG.testUrl,
    params,
  };
};

/**
 * Verifies a mock eSewa payment
 * @param {Object} verificationDetails - Payment verification details
 * @param {string} verificationDetails.transactionId - Transaction ID used during payment
 * @param {string} verificationDetails.status - Status (success/failure)
 * @returns {Promise<Object>} Verification result
 */
export const verifyEsewaPayment = async (verificationDetails) => {
  const { transactionId, status, amount } = verificationDetails;
  
  console.log(`Verifying mock eSewa payment: Transaction=${transactionId}, Status=${status}`);
  
  // For mock purposes, we'll simulate a successful verification
  return {
    success: status === 'success',
    message: status === 'success' ? 'Payment verified successfully' : 'Payment verification failed',
    transactionDetails: {
      transactionId,
      status,
      amount,
      verifiedAt: new Date().toISOString(),
    },
  };
};
