const JWT = require("jsonwebtoken");

const userModel = require("../models/userModel");

//Protect routes based on JWT token

const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//Admin access

const isAdmin = async (req, res, next) => {
  //console.log(req.user); //{ _id: '667059586cfb48b6ce80fbeb', iat: 1718652847, exp: 1719257647 }
  try {
    const user = await userModel.findById(req.user._id);

    if (parseInt(user.role) !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};

module.exports = { requireSignIn, isAdmin };
