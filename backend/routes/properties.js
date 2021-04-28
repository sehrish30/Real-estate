const { Property } = require("../models/property");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Agency } = require("../models/agency");

/*----------------------------------------
      Get all reported properties
---------------------------------------- */

router.get(`/reported-properties`, async (req, res) => {
  try {
    const propertyList = await Property.find({ isReported: true }).exec();

    if (!propertyList) {
      return res.status(204).send("No results found");
    }
    res.status(200).send(propertyList);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/*----------------------------------------
      DELETE REPORTED PROPERTY
---------------------------------------- */
router.delete(`/reported-property/:id/:agencyId`, async (req, res) => {
  try {
    Property.findByIdAndDelete(req.params.id).exec((err, result) => {
      if (err) {
        return res.status(422).send(err);
      }

      // Delete property from agency array
      let search;
      if (req.body.type === "Commercial") {
        search = { commercial: mongoose.Types.ObjectId(req.params.id) };
      }
      if (req.body.type === "Residential") {
        search = { residential: mongoose.Types.ObjectId(req.params.id) };
      }
      if (req.body.type === "Commercial") {
        search = { commercial: mongoose.Types.ObjectId(req.params.id) };
      }
      if (req.body.type === "Land") {
        search = { land: mongoose.Types.ObjectId(req.params.id) };
      }

      Agency.findByIdAndUpdate(
        req.params.agencyId,
        {
          $pull: search,
        },
        {
          new: true,
        }
      ).exec((error, data) => {
        if (error) {
          return res.status(422).send("Couldn't remove property from agency");
        }
      });
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

/*----------------------------------------
      UNDO REPORTED PROPERTY
---------------------------------------- */
router.put(`/undo-report`, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { isAdmin } = decoded;
      console.log("ISADMIN", isAdmin);
      if (isAdmin) {
        await Property.findByIdAndUpdate(
          req.body.id,
          {
            isReported: false,
          },
          {
            new: true,
          }
        ).exec((err, result) => {
          if (err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(result);
        });
      }
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
