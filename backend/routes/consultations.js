const { Consultation } = require("../models/consultation.js");
const { User } = require("../models/user.js");
const { Agency } = require("../models/agency");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  service: "SendinBlue", // no need to set host or port etc.
  auth: {
    user: process.env.SENDINBLUE_USER,
    pass: process.env.SENDINBLUE_PW,
    api: process.env.SENDINBLUE_API,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: "express-handlebars",
    viewPath: "./views/",
  })
);

/*----------------------------------------
  GET ALL CONSULTATION REQUESTS for USER
----------------------------------------- */
router.get("/user-consultations/:id", async (req, res) => {
  try {
    // get the token
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(` `)[1];

    await User.findById(req.params.id, "consultations").exec(
      (err, consultation) => {
        if (err) {
          return res.status(500).send("No User with consultation");
        }

        return res.status(200).send(consultation);
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
 GET ALL CONSULTATION REQUESTS for AGENCY
----------------------------------------- */
router.get("/agency-consultations/:id", async (req, res) => {
  try {
    // get the token
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(` `)[1];

    await Agency.findById(req.params.id, "consultations").exec(
      (err, consultation) => {
        if (err) {
          return res.status(500).send("No Agency with consultation");
        }

        return res.status(200).send(consultation);
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
 CUSTOMER REUESTING AGENCY FOR CONSULTATION
----------------------------------------- */
router.post("/customer-requesting-consultation", async (req, res) => {
  try {
    const {
      customer,
      agency,
      phoneNumber,
      startTime,
      endTime,
      message,
      isVirtual,
      date,
    } = req.body;
    let consulation = new Consultation({
      customer,
      agency,
      phoneNumber,
      startTime,
      endTime,
      message,
      isVirtual,
      date,
    });
    consulation = await consulation.save();
    if (!consulation)
      return res.status(400).send("Consultation couldn't be send");

    // Save the consultation in user
    await User.findByIdAndUpdate(req.body.customer, {
      $push: {
        consultation: consulation.id,
      },
    });

    // Save the consultation in agency
    await Agency.findByIdAndUpdate(req.body.customer, {
      $push: {
        consultation: consulation.id,
      },
    });
  } catch (err) {}
});
module.exports = router;
