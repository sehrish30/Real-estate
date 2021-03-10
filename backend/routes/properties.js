const { Property } = require("../models/property");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

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

module.exports = router;
