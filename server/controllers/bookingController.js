const User = require('../models/auth');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { destination, packageName, departureDate, travelers, totalAmount } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create booking object
    const newBooking = {
      destination,
      packageName,
      departureDate: new Date(departureDate),
      travelers: parseInt(travelers),
      totalAmount: parseFloat(totalAmount),
      status: 'confirmed',
      bookingDate: new Date()
    };

    // Add to user's bookings
    user.bookings.push(newBooking);
    await user.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('bookings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific booking
const getBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = user.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = user.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking fields
    Object.keys(updates).forEach(key => {
      if (booking[key] !== undefined) {
        booking[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = user.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await user.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking
};