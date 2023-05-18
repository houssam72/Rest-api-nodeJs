const Product = require("../models/product");
const mongoose = require("mongoose");

exports.getAll = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      if (docs) {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id,
              },
            };
          }),
        };
        console.log("get all products", docs);
        res.status(200).json(response);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log("Test", req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      console.log(
        "Find by Id a product in a dbb is KO(No valid entry found for provided Id)"
      );
      res.status(500).json({ message: "No valid entry found for provided Id" });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;

  Product.updateMany({ _id: id }, req.body)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_delete=(req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Product deleted",
          request: {
            type: "POST",
            request: {
              type: "POST",
              url: "http://localhost:3000/products/",
              body: { name: "String", price: "Number" },
            },
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
