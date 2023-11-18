'use strict'

const {Schema, Types, model} = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema({
    inven_productId: {type: Schema.Types.ObjectId, ref: 'Product'},
    inven_location: {type: String, default: 'unknow'},
    inven_stock: {type: Number, require: true},
    inven_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
    inven_reservation: {type: Array, default: []},
    /*
        cartId:,
        stock: 1,
        createdOn:
     */
    }, {
        timestamp: true,
        collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, inventorySchema)