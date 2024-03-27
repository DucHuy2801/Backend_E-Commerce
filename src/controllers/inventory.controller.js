'use strict'

const inventoryService = require("../services/inventory.service")
const { SuccessResponse } = require("../core/success.response")

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart addStockToInventory',
            metadata: await inventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()