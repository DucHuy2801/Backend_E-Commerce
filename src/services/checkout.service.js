'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const { order } = require("../models/order.model") 

class CheckoutService {
    // login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: [],
                    item_products: [
                        {
                        price,
                        quantity,
                        productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount: [
                        {
                            "shopId",
                            "discount",
                            codeId: 
                        }
                    ],
                    item_products: [
                        {
                        price,
                        quantity,
                        productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId exist?
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError("Cart doens't exist!")

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0,
            totalDiscount: 0, 
            totalCheckout: 0
        }, shop_order_ids_new = []

        // calculate sum bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')
            
            // sum bill
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // sum price before handling
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // new shop_discounts > 0, check valid
            if (shop_discounts.length > 0) {
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // total discount
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids, 
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check xem co vuot ton kho hay khong
        // get new array products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check if co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError("Mot so san pham da duoc cap nhat, vui long quay lai gio hang...")
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // th: insert thanh cong, remove product co trong cart
        if (newOrder) {
            
        }
        return newOrder
    }

    /**
     *  1> Query Orders [Users]
     */
    static async getOrdersByUser () {

    }

    /**
     *  2> Query Order Using Id [Users]
     */
    static async getOrderByUser () {
        
    }

    /**
     *  3> Cancel Order [Users]
     */
    static async cancelOrderByUser () {
        
    }

    /**
     *  4> Update Order Status [Shop | Admin]
     */
    static async updateOrderStatusByShop() {
        
    }
}

module.exports = CheckoutService

