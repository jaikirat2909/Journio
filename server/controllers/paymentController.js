const Payment = require('../models/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // ← FIX THIS LINE
const User = require('../models/auth');
// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, package: packageData, bookingInfo } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        package_id: packageData._id || packageData.id,
        package_name: packageData.name,
        user_email: bookingInfo.email,
        travelers: bookingInfo.travelers,
        departure_date: bookingInfo.departureDate
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ... rest of your code remains the same
// Save payment details after successful payment
// Save payment details after successful payment
// Save payment details after successful payment (simplified for testing)

 // Add this import

// ... (your existing createPaymentIntent function remains the same)

// Save payment details after successful payment AND create booking
// Save payment details after successful payment AND create booking
exports.savePayment = async (req, res) => {
  try {
    const { transactionId, package: packageData, bookingInfo } = req.body;
    
    console.log('Received bookingInfo:', bookingInfo);
    
    // Validate required fields
    if (!bookingInfo || !bookingInfo.departureDate) {
      return res.status(400).json({ 
        message: 'Departure date is required' 
      });
    }

    // Calculate total amount
    const totalAmount = packageData.price * bookingInfo.travelers;
    
    // Create payment record with proper date handling
    const payment = new Payment({
      transactionId,
      packageId: packageData._id || packageData.id,
      userId: bookingInfo.email,
      userName: bookingInfo.name,
      userEmail: bookingInfo.email,
      travelers: bookingInfo.travelers,
      departureDate: new Date(bookingInfo.departureDate), // Convert to Date object
      totalAmount,
      paymentStatus: 'completed',
      cardLastFour: '4242',
      cardBrand: 'visa',
      paymentMethod: 'stripe',
      stripePaymentIntentId: transactionId
    });
    
    await payment.save();
    
    // ✅ CREATE BOOKING AFTER SUCCESSFUL PAYMENT
    try {
      // Find user by email
      const user = await User.findOne({ email: bookingInfo.email });
      
      if (user) {
        console.log('Found user for booking:', user.email);
        
        // Create booking object
        const newBooking = {
          destination: packageData.name,
          packageName: packageData.name,
          departureDate: new Date(bookingInfo.departureDate), // Convert to Date object
          travelers: parseInt(bookingInfo.travelers),
          totalAmount: totalAmount,
          status: 'confirmed',
          bookingDate: new Date()
        };
        
        // Add to user's bookings
        user.bookings.push(newBooking);
        await user.save();
        
        console.log('Booking created successfully for user:', user.email);
      } else {
        console.error('User not found for email:', bookingInfo.email);
      }
    } catch (bookingError) {
      console.error('Error creating booking after payment:', bookingError);
      // Don't fail the payment if booking creation fails
    }
    
    res.status(200).json({ 
      message: 'Payment details saved successfully',
      paymentId: payment._id 
    });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// ... (rest of your payment controller remains the same)
// Get payment history for a user
// Get payment history for a user
exports.getPaymentHistory = async (req, res) => {
  try {
    const { email } = req.params;
    
    const payments = await Payment.find({ userEmail: email })
      .sort({ createdAt: -1 });
      // Remove .populate('packageId') since packageId is now a string
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payment details by transaction ID
exports.getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const payment = await Payment.findOne({ transactionId });
      // Remove .populate('packageId') since packageId is now a string
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Webhook handler for Stripe events
// In your webhook handler
// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  let event;
  const sig = req.headers['stripe-signature'];
  
  try {
    // For development, you might skip verification or use a simpler method
    if (process.env.NODE_ENV === 'development' && process.env.STRIPE_WEBHOOK_SECRET === 'whsec_test_secret_for_development_only') {
      // Use the raw body for development
      event = req.body;
      console.log('Development mode: Skipping webhook signature verification');
    } else {
      // Real verification for production
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        // Here you can update your database to mark the payment as successful
        break;
      case 'payment_intent.payment_failed':
        const paymentFailed = event.data.object;
        console.log('PaymentIntent failed:', paymentFailed.id);
        // Update your database to mark the payment as failed
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  res.json({received: true});
};