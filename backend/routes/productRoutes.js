const express = require("express");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  deleteProductController,
  braintreeTokenController,
  braintreePaymentController,
} = require("../controllers/productController");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const formidableMiddleware = require("express-formidable");

//router object
const router = express.Router();

//Routing

//Create Product || POST request
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

//Fetch all Products || GET request
router.get("/get-product", getProductController);

//Fetch single product || GET request
router.get("/get-product/:slug", getSingleProductController);

//get photo || GET request
router.get("/product-photo/:pid", productPhotoController);

//Update Product || PUT request
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);

//Delete Product || DELETE request
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//Payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//Payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

module.exports = router;
