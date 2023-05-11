const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const router = express.Router();

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      if (docs) {
        console.log("get all products", docs);
        res.status(200).json(docs);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log("Post a Product to a dbb", result);
      res.status(201).json({
        message: "Hanling post request to /Product",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log("ErrDbb1", err);
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        console.log("Find by Id a product in a dbb is Ok", doc);
        res.status(200).json(doc);
      } else {
        console.log("Find by Id a product in a dbb is Ko", err);
        res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      console.log(
        "Find by Id a product in a dbb is KO(No valid entry found for provided Id)"
      );
      res.status(500).json({ message: "No valid entry found for provided Id" });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.updateMany({ _id: id }, req.body)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
