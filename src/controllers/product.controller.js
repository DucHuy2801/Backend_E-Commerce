'use strict'

const {productFactory} = require("../services/product.service")
const {SuccessResponse} = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        // console.log(await productFactory.createProduct(req.body.product_type, req.body))
        new SuccessResponse({
            message: 'Create new Product success!',
            statusCode: 200,
            metadata: await productFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController()