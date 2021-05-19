const { User } = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const Wishlist = require("../models/wishlist.js");

/*----------------------------------------
        GET USER WISHLISTS
----------------------------------------- */
router.get("/user/:user_id", async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlistByUserId(req.params.user_id);
    if (!wishlist) {
      return res
        .status(500)
        .json({ message: "The user with the given ID was not found" });
    }

    res.status(200).send(wishlist);
  } catch (e) {
    console.error(e);
  }
});

/*----------------------------------------
        GET AGENCY WISHLISTS
----------------------------------------- */
router.get("/agency/:user_id", async (req, res) => {
  try {
    let data = await Wishlist.aggregate([
      {
        $addFields: {
          id: "$_id",
          property_id: {
            $toObjectId: "$property_id",
          },
        },
      },
      {
        $match: { user_id: req.params.user_id },
      },
      {
        $lookup: {
          from: "properties",
          let: {
            propertyId: "$property_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$propertyId"],
                },
              },
            },
            {
              // project block for PROFILE
              $project: {
                _id: false,
                id: "$_id",
                title: true,
                cost: true,
                images: true,
                location: true,
                network: true,
                bathrooms: true,
                category: true,
                iBanNumber: true,
                description: true,
                Amenities: true,
                rooms: true,
                type: true,
                area: true,
                city: true,
                propertyImages: true,
              },
            },
          ],
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        // project block for ACCOUNTS
        $project: {
          _id: false,
          id: "$_id",
          created_at: true,
          property: true,
        },
      },
    ]).sort({ created_at: -1 });
    if (data) {
      return res.status(200).send(data);
    } else {
      res.status(422).send("ERROR");
    }
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
    console.log(req.body, "GET");
    console.log("wishlist:", wishList);
    // wishList= await wishList.save();

    wishList.save((err, item) => {
      if (err) {
        return res.send({
          status: 404,
          message: err,
        });
      } else {
        res.status(200).send(item);
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

router.delete("/delete", async (req, res) => {
  try {
    Wishlist.findOneAndDelete({
      property_id: req.body.property_id,
      user_id: req.body.user_id,
    }).exec((err, data) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.status(200).send(data);
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
