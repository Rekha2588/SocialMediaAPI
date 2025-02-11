const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productsController');

router.route('/').get(getProducts).post(addProduct);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;