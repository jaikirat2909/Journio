const express = require('express');
const router = express.Router();
const { 
  addToWishlist, 
  getWishlist, 
  removeFromWishlist, 
  checkWishlist,
  checkWishlistStatus // Add this import
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist - Add item to wishlist
router.post('/', addToWishlist);

// GET /api/wishlist/check/:destinationId - Check if item is in wishlist
router.get('/check/:destinationId', checkWishlist);

// POST /api/wishlist/status - Check wishlist status for multiple destinations
router.post('/status', checkWishlistStatus); // Add this route

// DELETE /api/wishlist/:itemId - Remove item from wishlist
router.delete('/:itemId', removeFromWishlist);

module.exports = router;