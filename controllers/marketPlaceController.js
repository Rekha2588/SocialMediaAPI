const asyncHandler = require('express-async-handler');
const Marketplace = require('../models/marketPlaceModel');

const addProvider = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Provider name is mandatory");
    }
    const providerAvailable = await Marketplace.findOne({ name });
    if (providerAvailable) {
        res.status(400);
        throw new Error("Provider already exists!");
    }
    const provider = await Marketplace.create({ name, description });
    if (provider) {
        res.status(201).json({
            _id: provider.id,
            name: provider.name
        });
    } else {
        res.status(400);
        throw new Error("Provider data is not valid");
    }
});

const getProviders = asyncHandler(async (req, res) => {
    const providers = await Marketplace.find();
    res.status(200).json({
        providers
    });
});

const getProvider = asyncHandler(async (req, res) => {
    const provider = await Marketplace.findById(req.params.id);
    if (!provider) {
        res.status(404);
        throw new Error("provider not found");
    }
    res.status(200).json(provider);
});

const updateProvider = asyncHandler(async (req, res) => {
    const provider = await Marketplace.findById(req.params.id);
    if (!provider) {
        res.status(404);
        throw new Error("provider not found");
    }
    const updatedProvider = await Marketplace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProvider);
});

const deleteProvider = asyncHandler(async (req, res) => {
    const provider = await Marketplace.findById(req.params.id);
    if (!provider) {
        res.status(404);
        throw new Error("Provider not found");
    }
    await Marketplace.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "Deleted provider successfully"
    });
});

module.exports = { addProvider, getProviders, getProvider, updateProvider, deleteProvider };