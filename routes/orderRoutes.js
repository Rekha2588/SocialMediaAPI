const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, cancelOrder } = require('../controllers/ordersController');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrder).put(cancelOrder);

module.exports = router;