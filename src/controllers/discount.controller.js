'use strict'

const DiscountService = require("../services/discount.service")
const { SuccessResponse } = require("../core/success.response")

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful code generations!',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    gettAllDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    gettDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get discount amount successfully!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount code with product successfully!',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()