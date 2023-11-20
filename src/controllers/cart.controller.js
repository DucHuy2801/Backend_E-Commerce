'use strict'

const CartService = require("../services/cart.service")
const { SuccessResponse } = require("../core/success.response")

class CartController {

    getListUserCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Getting list carts successfully!',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }

    /**
     * @description add to cart for user
     * @param {int} userId
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * @url /v1/api/cart/user
     * @return {
     * }
     */
    addToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart successfully!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Updating product to Cart successfully!',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    deleteToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Deleting user cart successfully!',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
}

module.exports = new CartController()