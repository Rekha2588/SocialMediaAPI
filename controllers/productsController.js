const asyncHandler = require('express-async-handler');
const Products = require('../models/productModel');

const addProduct = asyncHandler(async (req, res) => {
    const { productName, description, price, specifications, quantity } = req.body;
    if (!productName || !description || !price || !specifications || !quantity) {
        res.status(400);
        throw new Error("Product details are mandatory");
    }
    const productAvailable = await Products.findOne({ productName });
    if (productAvailable) {
        res.status(400);
        throw new Error("Product already exists!");
    }
    const product = await Products.create({ ...req.body });
    if (product) {
        res.status(201).json(product);
    } else {
        res.status(400);
        throw new Error("Product data is not valid");
    }
});

const getProducts = asyncHandler(async (req, res) => {
    const products = await Products.find();
    res.status(200).json({
        products
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    Object.assign(product, req.body);
    const updatedProduct = await Products.findByIdAndUpdate(req.params.id, product, { new: true });
    res.status(200).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "Deleted product successfully"
    });
});

module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct };