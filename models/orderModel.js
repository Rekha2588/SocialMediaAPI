const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetails' 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    deliveryDate: { 
        type: Date 
    },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed','shipped', 'delivered', 'cancelled'] 
    },
    paymentMethod: { 
        type: String, 
        enum: ['credit', 'debit', 'bank transfer'] 
    },
    totalCost: { 
        type: Number, 
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ]
});


const Orders = mongoose.model('Orders', orderSchema)
module.exports = Orders;