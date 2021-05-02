const { Property } = require("../models/property");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Agency } = require("../models/agency");
const { Expo } = require("expo-server-sdk");
const { User } = require("../models/user");
const expo = new Expo();

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

/*----------------------------------------
     SEND NOTIFICATION
---------------------------------------- */
router.post(`/send-notifications`, async (req, res) => {
  try {
    User.find({
      enableNotification: true,
      locations: { $in: [req.body.location] },
    }).exec((err, result) => {
      if (err) {
        console.log("HERE");
        return res.status(500).send(err);
      }
      let message = "New properties arrived";
      for (let user = 0; user < result.length; user++) {
        // Check valid push token
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(result[user].notificationToken)) {
          console.log(
            `Push token ${result[user].notificationToken} is not a valid Expo push token`
          );
        }
        const chunks = expo.chunkPushNotifications([
          {
            to: result[user].notificationToken,
            sound: "default",
            body: message,
            data: { property: req.body.propertyId },
            ttl: 86400,
            title: "ICONIC properties",
          },
        ]);
        let tickets = [];
        console.log(chunks);
        for (let chunk of chunks) {
          try {
            (async () => await expo.sendPushNotificationsAsync(chunk))().then(
              (ticketChunk) => {
                console.log("TICKET CHUNK", ticketChunk);
                tickets.push(...ticketChunk);
                console.log("TICKETS", tickets);
              }
            );

            // Handling the receipt ID
            let receiptIds = [];
            for (let ticket of tickets) {
              if (ticket.id) {
                receiptIds.push(ticket.id);
              }
            }
            let receiptIdChunks = expo.chunkPushNotificationReceiptIds(
              receiptIds
            );

            (async () => {
              // Like sending notifications, there are different strategies you could use
              // to retrieve batches of receipts from the Expo service.
              for (let chunk of receiptIdChunks) {
                try {
                  let receipts = await expo.getPushNotificationReceiptsAsync(
                    chunk
                  );
                  console.log(receipts);

                  // The receipts specify whether Apple or Google successfully received the
                  // notification and information about an error, if one occurred.
                  for (let receiptId in receipts) {
                    let { status, message, details } = receipts[receiptId];
                    if (status === "ok") {
                      continue;
                    } else if (status === "error") {
                      console.error(
                        `There was an error sending a notification: ${message}`
                      );
                      if (details && details.error) {
                        console.error(`The error code is ${details.error}`);
                      }
                    }
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            })();
          } catch (err) {
            return res.status(500).send(err);
          }
        }
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

/*----------------------------------------
     SEND NOTIFICATION WITHOUT ALERT
---------------------------------------- */
router.post(`/send-customer-notifications`, async (req, res) => {
  try {
    User.find({
      enableNotification: true,
      locations: { $in: [req.body.location] },
    }).exec((err, result) => {
      if (err) {
        console.log("HERE");
        return res.status(500).send(err);
      }

      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

/*----------------------------------------
     SUBSCRIBE LOCATION
---------------------------------------- */
router.put("/choose-location", async (req, res) => {
  try {
    User.findByIdAndUpdate(req.body.userId, {
      locations: req.body.locations,
    }).exec((err, result) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.status(200).send(true);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
     GET SUBSCRIBED LOCATIONS
---------------------------------------- */
router.get("/subscribed-locations", async (req, res) => {
  try {
    User.findById(req.query.userId)
      .select("locations")
      .exec((err, result) => {
        if (err) {
          return res.status(422).send(err);
        }
        return res.status(200).send(result);
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});
module.exports = router;
