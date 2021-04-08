const { Consultation } = require("../models/consultation.js");
const { User } = require("../models/user.js");
const { Agency } = require("../models/agency.js");
const { Notification } = require("../models/notification.js");
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
      email,
    } = req.body;

    let consultation = new Consultation({
      customer,
      agency,
      phoneNumber,
      startTime,
      endTime,
      message,
      isVirtual,
      date,
      email,
    });

    consultation = await consultation.save();

    if (!consultation) {
      return res.status(400).send("Consultation couldn't be send");
    } else {
      let meetingType;
      if (isVirtual === true) {
        meetingType = "virtual";
      } else {
        meetingType = "in person";
      }

      // Save the notification
      let notification = new Notification({
        customer,
        agency,
        consultationId: consultation._id,
        content: `${email} wants to schedule ${meetingType} meeting with you`,
      });

      notification = notification.save();

      // Save the consultation in user
      const user = User.findByIdAndUpdate(req.body.customer, {
        $push: {
          consultations: consultation.id,
        },
      });

      // Save the consultation in agency
      const agencyData = Agency.findByIdAndUpdate(req.body.agency, {
        $push: {
          consultations: consultation.id,
        },
      });

      await Promise.all([notification, user, agencyData]);
      return res.status(200).send(consultation);
    }
  } catch (err) {
    return res.status(500).send("WHAT THE HELL");
  }
});

/*----------------------------------------
 AGENCY DECLINING THE REQUEST
----------------------------------------- */

/*----------------------------------------
 AGENCY ACCEPTING THE REQUEST
----------------------------------------- */

/*----------------------------------------
 AGENCY REQUESTING FOR RESCHEDULE
----------------------------------------- */

/*----------------------------------------
 AGENCY ACCEPTING THE REQUEST
----------------------------------------- */
module.exports = router;
