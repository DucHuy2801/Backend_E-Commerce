'use strict'

const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product successfully!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)
        new SuccessResponse({
            message: 'Create new Product successfully!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // update product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Updating product successfully!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product by shop successfully!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product by shop successfully!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
 
     // QUERY //
     /**
      * @desc Get all Drafs for shop
      * @param { Number } limit
      * @param { Number } skip
      * @return { JSON }
      */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft successfully!',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }



    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft successfully!',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search Product successfully!',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all products successfully!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product successfully!',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
    // END QUERY //
}

module.exports = new ProductController()