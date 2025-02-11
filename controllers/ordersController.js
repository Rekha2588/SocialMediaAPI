const asyncHandler = require('express-async-handler');
const Orders = require('../models/orderModel');
const Products = require('../models/productModel');

const createOrder = asyncHandler(async (req, res) => {
    const products = req.body.items;
    const order = await Orders.create({ ...req.body });
    if (order) {
        updateStockQuantity(products);
        res.status(201).json({ order });
    } else {
        res.status(400);
        throw new Error("Order data is not valid");
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Orders.find();
    res.status(200).json({
        orders
    });
});

const getOrder = asyncHandler(async (req, res) => {
    const order = await Orders.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.status(200).json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Orders.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    Object.assign(order, { orderStatus: 'cancelled' });
    await Orders.findByIdAndUpdate(req.params.id, order, { new: true });
    res.status(200).json({
        message: "Order cancelled"
    });
});

const updateStockQuantity = asyncHandler(async (products) => {
    await Promise.all(products.map(async (product) => {
        const productDoc = await Products.findById(product.productId);
        productDoc.quantity = productDoc.quantity - product.quantity;
        await productDoc.save();
    }));
});

module.exports = { createOrder, getOrders, getOrder, cancelOrder };