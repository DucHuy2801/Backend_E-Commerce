'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()
const { asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

// get amount a discount
router.post('/amount', asyncHandler(discountController.gettDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesWithProduct))

module.exports = router