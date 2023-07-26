const Order = require("../models/order");
const Product = require("../models/product");
const { default: mongoose } = require("mongoose");

exports.order_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            doc: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    });
};

exports.orders_create_order = async (req, res, next) => {
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
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
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
};

exports.orders_delete_order = (req, res, next) => {
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
};
