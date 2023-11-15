'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum:[ 'Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// define the product type = Clothing
const clothingSchema = new Schema({
    branch: {type: String, require: true},
    size: String,
    material: String,
    // product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = Electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, require: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'electronics',
    timestamps: true
})

// define the product type = Furniture
const furnitureSchema = new Schema({
    branch: {type: String, require: true},
    size: String,
    material: String,
    // product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'furnitures',
    timestamps: true
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furnitures', furnitureSchema)
}