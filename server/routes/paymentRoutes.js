const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Save payment details
router.post('/save-payment', paymentController.savePayment);

// Get payment history for a user
router.get('/history/:email', paymentController.getPaymentHistory);

// Get payment details by transaction ID
router.get('/:transactionId', paymentController.getPaymentDetails);

// Webhook endpoint for Stripe
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);

module.exports = router;