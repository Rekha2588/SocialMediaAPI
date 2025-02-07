const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "MarketplaceProvider"
    },
    productName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    specifications: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    });

const Products = mongoose.model('Products', productSchema)
module.exports = Products;