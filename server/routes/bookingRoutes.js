const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  createBookingWithPayment, // Import the new function
  getUserBookings, 
  getBooking, 
  updateBooking, 
  cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// POST /api/bookings - Create a new booking
router.post('/', createBooking);

// NEW: POST /api/bookings/with-payment - Create booking with payment
router.post('/with-payment', createBookingWithPayment);

// GET /api/bookings - Get all bookings for authenticated user
router.get('/', getUserBookings);

// GET /api/bookings/:bookingId - Get a specific booking
router.get('/:bookingId', getBooking);

// PUT /api/bookings/:bookingId - Update a booking
router.put('/:bookingId', updateBooking);

// DELETE /api/bookings/:bookingId - Cancel a booking
router.delete('/:bookingId', cancelBooking);

module.exports = router;