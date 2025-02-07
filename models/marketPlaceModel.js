const mongoose = require('mongoose');

const marketplaceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const Marketplace = mongoose.model('MarketplaceProvider', marketplaceSchema)
module.exports = Marketplace;