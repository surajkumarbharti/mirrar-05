const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    title: {
        type:String, 
        required:true, 
      
    },

    description: {
        type: String, 
        required:true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    variant:[
        {
            type : Object,
        }
    ],
    currencyId: {
        type: String, 
        required:true
    },
   
    style: {
        type: String
    },
    availableSizes: {
        type: [String],
        required: true,
        trim: true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    
    deletedAt: {
        type:Date
    }, 
    isDeleted: {
        type:Boolean, 
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('product', productSchema)