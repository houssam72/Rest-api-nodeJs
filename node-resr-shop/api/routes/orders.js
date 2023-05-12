const express = require("express");
const Order = require("../models/order");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const router = express.Router();

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    });
});

router.post("/", async (req, res, next) => {
  let ProductFinded = false;

  await Product.findById(req.body.productId).then((product) => {
    if (!product) {
      res.status(404).json({
        message: "Product not found" + ProductFinded,
      });
    } else {
      ProductFinded = true;
    }
  });

  if (ProductFinded) {
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });

    order
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      if (result.deletedCount == 0) {
        return res.status(404).json({
          message: "order Not Found",
        });
      }
      res.status(200).json({
        message: "Order deleted",
        result,
        request: {
          type: "Post",
          url: "http://localhost:3000/orders/",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    });
});

module.exports = router;