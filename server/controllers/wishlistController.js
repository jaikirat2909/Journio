const User = require('../models/auth');

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { destinationId, name, image, description, price } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(
      item => item.destinationId === destinationId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push({
      destinationId,
      name,
      image,
      description,
      price,
      addedDate: new Date()
    });

    await user.save();

    res.status(200).json({
      message: 'Item added to wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if item exists in wishlist
    const itemIndex = user.wishlist.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    // Remove item
    user.wishlist.splice(itemIndex, 1);
    await user.save();

    res.status(200).json({
      message: 'Item removed from wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if item is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { destinationId } = req.params;

    const user = await User.findById(userId).select('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isInWishlist = user.wishlist.some(
      item => item.destinationId === destinationId
    );

    res.status(200).json({ isInWishlist });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist
};