const { Notification } = require("../models/notification.js");
const { User } = require("../models/user.js");
const { Agency } = require("../models/agency.js");
const express = require("express");
const router = express.Router();

/*----------------------------------------
  NOTIFICATIONS CUSTOMERS
----------------------------------------- */
router.get("/customer-notifications", async (req, res) => {
  try {
    await Notification.find({ receiver: req.query.userId })
      .populate([
        {
          path: "agency",
          select: "name logo",
        },
      ])
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          return res.status(401).send(err);
        }
        return res.status(200).send(result);
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
  NOTIFICATIONS AGENCIES
----------------------------------------- */
router.get("/agency-notifications", async (req, res) => {
  try {
    await Notification.find({ receiver: req.query.userId })
      .populate([
        {
          path: "customer",
          select: "email dp",
          // options: {
          //   sort: { createdAt: -1 },
          // },
        },
        // {
        //   path: "consultationId",
        // },
      ])
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          return res.status(401).send(err);
        }
        return res.status(200).send(result);
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
   MARK ALL NOTIFICATIONS SEEN CUSTOMER
----------------------------------------- */
router.put("/seen-notifications/customer", async (req, res) => {
  try {
    const data = await Notification.updateMany(
      {
        isSeen: false,
        receiver: req.body.userId,
      },
      { $set: { isSeen: true } }
    );

    return res.status(200).json(data.nModified);
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).json(err);
  }
});

/*----------------------------------------
   MARK ALL NOTIFICATIONS SEEN AGENCY
----------------------------------------- */
router.put("/seen-notifications/agency", async (req, res) => {
  try {
    const data = await Notification.updateMany(
      {
        isSeen: false,
        receiver: req.body.userId,
      },
      { $set: { isSeen: true } }
    );

    return res.status(200).json(data.nModified);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
  NOTIFICATIONS DETAILS
----------------------------------------- */
router.get("/notification-detail", async (req, res) => {
  try {
    const data = await Notification.findById(req.query.id).populate([
      {
        path: "customer",
        select: "dp email",
      },
      {
        path: "agency",
        select: "name logo",
      },
      {
        path: "consultationId",
      },
    ]);

    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*----------------------------------------
         NEW NOTIFICATION
----------------------------------------- */
router.get(`/new-notification`, async (req, res) => {
  try {
    await Notification.countDocuments({
      receiver: req.query.userId,
      isSeen: false,
    }).exec((err, result) => {
      if (err) {
        return res.status(401).json(err);
      }
      console.log("RESULT", result);
      return res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
