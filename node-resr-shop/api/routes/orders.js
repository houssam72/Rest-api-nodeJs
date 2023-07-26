const express = require("express");
const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/order");

const router = express.Router();

router.get("/", OrdersController.order_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, OrdersController.get_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
