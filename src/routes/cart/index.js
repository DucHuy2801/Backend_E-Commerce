'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()
const { asyncHandler} = require('../../helpers/asyncHandler')

// get amount a discount
router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.deleteToCart))
router.get('', asyncHandler(cartController.getListUserCart))
router.post('/update', asyncHandler(cartController.updateToCart))

module.exports = router