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
        receiver: agency,
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
      if (agencyId == req.body.agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "declined",
          },
          { new: true }
        ).exec(async (err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }

          // Save the notification
          let notification = new Notification({
            customer: req.body.customer,
            agency: req.body.agencyId,
            consultationId: consultation._id,
            receiver: req.body.customer,
            content: `${req.body.agencyName} has declined your consultation request`,
          });

          notification = await notification.save();
          console.log("NOTIFICATION", notification);
          if (notification) {
            return res.status(200).send({ notification });
          }
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
      if (agencyId == req.body.agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "accepted",
            payment: req.body.payment,
          },
          { new: true }
        ).exec(async (err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          // Save the notification
          let notification = new Notification({
            customer: req.body.customer,
            agency: req.body.agencyId,
            consultationId: consultation._id,
            receiver: req.body.customer,
            content: `${req.body.agencyName} has accepted your consultation request`,
          });

          notification = await notification.save();

          if (notification) {
            return res.status(200).send({ notification });
          }
          // return res.status(200).send(consultation);
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
router.put("/reschedule-consultation-request", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;
      if (agencyId == req.body.agencyId) {
        Consultation.findByIdAndUpdate(
          req.body.id,
          {
            status: "reschedule",
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            date: req.body.date,
            rescdheuleMessage: req.body.message,
          },
          { new: true }
        ).exec(async (err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          // Save the notification
          let notification = new Notification({
            customer: req.body.customer,
            agency: req.body.agencyId,
            consultationId: consultation._id,
            receiver: req.body.customer,
            content: `${req.body.agencyName} has requested to reschedule your consultation request from ${consultation.startTime} to ${consultation.endTime}`,
          });

          notification = await notification.save();

          if (notification) {
            return res.status(200).send({ notification });
          }
          // return res.status(200).send(consultation);
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
router.put("/paid-consultation-request", async (req, res) => {
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
        ).exec(async (err, consultation) => {
          if (err) {
            return res.status(422).send(err);
          }
          // Save the notification
          let notification = new Notification({
            customer: req.body.customer,
            agency: req.body.agencyId,
            consultationId: consultation._id,
            receiver: req.body.customer,
            content: `Amazing! Your consultation session is finalized by ${req.body.agencyName} from ${consultation.startTime} to ${consultation.endTime}`,
          });

          notification = await notification.save();

          if (notification) {
            return res.status(200).send({ notification });
          }
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

/*----------------------------------------
         DELETE CONSULTATION
----------------------------------------- */

router.delete("/delete-consultation/:id", async (req, res) => {
  try {
    Consultation.findOneAndDelete(
      {
        _id: req.params.id,
        status: "pending",
      },
      (err, data) => {
        if (err) {
          return res.status(422).send(err);
        }
        if (data) {
          return res.status(200).send(true);
        }
        return res.status(200).send(false);
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
  CONSULTATION STATS FOR CUSTOMERS
----------------------------------------- */
router.get("/statistics-report/customer", async (req, res) => {
  try {
    const res1 = Consultation.countDocuments({
      status: "pending",
      customer: req.query.userId,
    });
    const res2 = Consultation.countDocuments({
      status: "reschedule",
      customer: req.query.userId,
    });
    const res3 = Consultation.countDocuments({
      status: "paid",
      customer: req.query.userId,
    });
    const res4 = Consultation.countDocuments({
      status: "declined",
      customer: req.query.userId,
    });
    const res5 = Consultation.countDocuments({
      status: "accepted",
      customer: req.query.userId,
    });
    const [pending, reschedule, paid, declined, accepted] = await Promise.all([
      res1,
      res2,
      res3,
      res4,
      res5,
    ]);

    return res
      .status(200)
      .json({ pending, reschedule, paid, declined, accepted });
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
  CONSULTATION STATS FOR AGENCIES
----------------------------------------- */
router.get("/statistics-report/agency", async (req, res) => {
  try {
    const res1 = Consultation.countDocuments({
      status: "pending",
      agency: req.query.userId,
    });
    const res2 = Consultation.countDocuments({
      status: "reschedule",
      agency: req.query.userId,
    });
    const res3 = Consultation.countDocuments({
      status: "paid",
      agency: req.query.userId,
    });
    const res4 = Consultation.countDocuments({
      status: "declined",
      agency: req.query.userId,
    });
    const res5 = Consultation.countDocuments({
      status: "accepted",
      agency: req.query.userId,
    });
    const [pending, reschedule, paid, declined, accepted] = await Promise.all([
      res1,
      res2,
      res3,
      res4,
      res5,
    ]);

    return res
      .status(200)
      .json({ pending, reschedule, paid, declined, accepted });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
