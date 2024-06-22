const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

//Create Category
const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    //validations
    if (!name) {
      return res.status(401).send({ message: "Category Name is Required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: `Category ${name} Already Exists`,
      });
    }

    //Save Category info in DB
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

//Update Category
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await categoryModel.findByIdAndUpdate(req.params.id, {
      name,
      slug: slugify(name),
    });

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Category",
      error,
    });
  }
};

//Get all categories
const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching categories",
      error,
    });
  }
};

//Get single category
const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "Single Category fetched successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching single category details",
      error,
    });
  }
};

//Delete Category
const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting the category",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  singleCategoryController,
  deleteCategoryController,
};
