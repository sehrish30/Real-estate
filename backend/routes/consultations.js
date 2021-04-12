const { Consultation } = require("../models/consultation.js");
const { User } = require("../models/user.js");
const { Agency } = require("../models/agency.js");
const { Notification } = require("../models/notification.js");
const express = require("express");
const router = express.Router();

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
    // when populating multiple fields in the doc use array
    console.log(req.params.id);
    await User.findById(req.params.id)

      .select("consultations")
      .populate({
        path: "consultations",
        populate: [
          {
            path: "agency",
            select: "name logo",
          },
          {
            path: "customer",
            select: "email dp",
          },
        ],
        options: {
          sort: { updatedAt: -1 },
        },
      })

      .exec((err, consultation) => {
        if (err) {
          return res.status(500).send("No User with consultation");
        }

        return res.status(200).send(consultation);
      });
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

    await Agency.findById(req.params.id)

      .select("consultations")
      .populate({
        path: "consultations",
        populate: [
          {
            path: "agency",
            select: "name logo",
          },
          {
            path: "customer",
            select: "email dp",
          },
        ],
        options: {
          sort: { updatedAt: -1 },
        },
      })
      .exec((err, consultation) => {
        if (err) {
          return res.status(404).send("No Agency with consultation");
        }

        return res.status(200).send(consultation);
      });
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
      return res.status(404).send("Consultation couldn't be send");
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
    return res.status(500).send(err);
  }
});

/*----------------------------------------
 AGENCY DECLINING THE REQUEST
----------------------------------------- */
router.put("/decline-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      if (agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "declined",
          },
          { new: true }
        ).exec((err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(consultation);
        });
      } else {
        return res.status(401).send("You aren't authorized");
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
 AGENCY ACCEPTING THE REQUEST
----------------------------------------- */
router.put("/accept-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      if (agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "accepted",
            payment: req.body.payment,
          },
          { new: true }
        ).exec((err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(consultation);
        });
      } else {
        return res.status(401).send("You aren't authorized");
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
 AGENCY REQUESTING FOR RESCHEDULE
----------------------------------------- */
router.put("/accept-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      if (agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "reschedule",
            rescdheuleMessage: "Thanks for the reschedule",
          },
          { new: true }
        ).exec((err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(consultation);
        });
      } else {
        return res.status(401).send("You aren't authorized");
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
    AGENCY REQUESTING FOR PAID
----------------------------------------- */
router.put("/payment-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      console.log(agencyId, req.body.agencyId);
      if (agencyId == req.body.agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "paid",
            rescdheuleMessage: undefined,
          },
          { new: true }
        ).exec((err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(consultation);
        });
      } else {
        return res.status(401).send("You aren't authorized");
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
          DATE PASSED SO EXPIRE
----------------------------------------- */
router.put("/done-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      console.log(agencyId, req.body.agencyId);

      const date = await Consultation.findById(req.body.id).select("date");

      var timestamp = Date.parse(date.date.split("-").reverse().join("-"));
      if (timestamp < Date.now()) {
        if (agencyId == req.body.agencyId) {
          Consultation.findByIdAndUpdate(
            req.body.id,
            {
              status: "done",
            },
            { new: true }
          ).exec((err, consultation) => {
            if (err) {
              return res.status(422).send(err);
            }
            return res.status(200).send(consultation);
          });
        } else {
          return res.status(401).send("You aren't authorized");
        }
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
