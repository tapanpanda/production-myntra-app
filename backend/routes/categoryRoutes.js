const express = require("express");
const {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  singleCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//Routing

//Create Category || POST request
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//Update Category || PUT request
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//Fetch all Categories || GET request
router.get("/get-category", getCategoryController);

//Fetch single category || GET request
router.get("/get-category/:slug", singleCategoryController);

//Delete Category || DELETE request
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

module.exports = router;
