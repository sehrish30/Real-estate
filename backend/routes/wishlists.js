const { User } = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const Wishlist = require("../models/wishlist.js");

/*----------------------------------------
        WISHLIST USER ID
----------------------------------------- */
router.get("/:user_id", async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlistByUserId(req.params.user_id);
    if (!wishlist) {
      return res
        .status(500)
        .json({ message: "The user with the given ID was not found" });
    }

    res.status(200).json({
      wishlist: wishlist,
      message: "Wishlist",
    });
  } catch (e) {
    console.error(e);
  }
});

/*----------------------------------------
                Add to Wishlist
----------------------------------------- */
router.post("/add", async (req, res) => {
  try {
    let wishList = new Wishlist(req.body);

    console.log("wishlist:", wishList);
    // wishList= await wishList.save();

    wishList.save((err, item) => {
      if (err) {
        return res.send({
          status: 404,
          message: err,
        });
      } else {
        res.status(200).json({
          wishlist: item,
          message: "Wishlist added successfully",
        });
      }
    });

    // if (!wishList) return res.status(400).send("Couldn't be added to WishList");
    // return res.send(wishList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
        DELETE ITEM FROM Wishlist
----------------------------------------- */

router.post("/delete", async (req, res) => {
  try {
    Wishlist.remove({ _id: req.body.wishlist_id }, function (err, result) {
      if (err) {
        return res.send({
          status: 404,
          message: err,
        });
      } else {
        res.status(200).json({
          message: "Deleted successfully",
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
