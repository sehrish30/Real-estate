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
const Wishlist = require("../models/wishlist.js");
const { populate } = require("../models/wishlist.js");

/*----------------------------------------
      GET ALL PROPERTIES
---------------------------------------- */
router.get(`/all-properties`, async (req, res) => {
  try {
    Property.find().exec((err, data) => {
      if (err) {
        return res.status(401).send(err);
      }
      console.log(data);
      return res.status(200).send(data);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

/*----------------------------------------
      GET ALL PROPERTIES
---------------------------------------- */
router.get("/allProperties", (req, res) => {
  console.log("QUERY", req.query);
  let partialToMatch = new RegExp(req.query.title, "i");
  let search = {};
  if (req.query.category) {
    search = { type: req.query.category };
  }

  Property.find(search)
    .populate("agency", "name totalRating")
    .limit(10)
    .skip(parseInt(req.query.page) || 0)
    .sort({ updatedAt: -1 })
    .exec((err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
        return res.status(422).send(err);
      }
      return res.status(200).send(data);
    });
});

/*----------------------------------------
        Property details
---------------------------------------- */
router.get("/propertyDetails", (req, res) => {
  let id = mongoose.Types.ObjectId(req.query.id);
  console.log("Search--------------", req.body);
  Property.findById(req.query.id)
    .populate("agency", "name logo totalRating")
    .exec((err, data) => {
      if (err) {
        return res.status(422).send(err);
      }
      if (req.query.userId) {
        Wishlist.findOne({
          user_id: req.query.userId,
          property_id: req.query.id,
        })
          .select("_id")
          .exec((err, info) => {
            if (err) {
              return res.status(422).send(err);
            }
            let exists = false;
            if (info) {
              exists = true;
            }
            return res.status(200).json({ data, exists });
          });
      } else if (!req.query.userId && data) {
        return res.status(200).json({ data, exists: false });
      }
    });
});

/*----------------------------------------
      REPORT PROPERTIES
---------------------------------------- */
router.put("/report-property", async (req, res) => {
  try {
    await Property.findOne({ _id: req.body.propertyId }).exec(
      async (err, result) => {
        if (err) {
          return res.status(401).send(err);
        }
        console.log("FIRST", result);
        let count = result.noOfReports;

        await Property.findByIdAndUpdate(req.body.propertyId, {
          noOfReports: count + 1,
        }).exec((err, result) => {
          console.log("COUNT", count);
          return res.status(200).send(result);
        });
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
      Get all reported properties
---------------------------------------- */

router.get(`/reported-properties`, async (req, res) => {
  try {
    const propertyList = await Property.find({
      noOfReports: { $gt: 0 },
    });
    console.log("GETTING");
    if (!propertyList) {
      return res.status(204).send("No results found");
    }
    res.status(200).send(propertyList);
  } catch (err) {
    return res.status(500).send(err);
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
      if (req.body.type === "Industrial") {
        search = { industrial: mongoose.Types.ObjectId(req.params.id) };
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
            let receiptIdChunks =
              expo.chunkPushNotificationReceiptIds(receiptIds);

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
   SEND NOTIFICATION TO USER BY SELLER
---------------------------------------- */
router.post(`/send-user-notifications`, async (req, res) => {
  try {
    User.findOne({
      enableNotification: true,
      locations: { $in: [req.body.location] },
      email: req.body.email,
    }).exec((err, result) => {
      if (err) {
        console.log("HERE");
        return res.status(500).send(err);
      }
      let message = "New properties arrived";

      // Check valid push token
      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(result.notificationToken)) {
        console.log(
          `Push token ${result.notificationToken} is not a valid Expo push token`
        );
      }
      const chunks = expo.chunkPushNotifications([
        {
          to: result.notificationToken,
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
          let receiptIdChunks =
            expo.chunkPushNotificationReceiptIds(receiptIds);

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

/*----------------------------------------
   SUGGEST RELEVANT PROPERTIES
---------------------------------------- */
router.get("/relevant-properties", async (req, res) => {
  try {
    await Property.find({
      $or: [
        { city: req.query.city },
        { category: req.query.category },
        { type: req.query.type },
      ],
      $and: [
        { _id: { $ne: req.query.propertyId } },
        { cost: { $lte: req.query.cost } },
      ],
    })
      .populate("agency", "name totalRating")
      .limit(3)
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
   STATS FOR REPORTED PROPERTIES
---------------------------------------- */
router.get("/reported-vs-unreported", async (req, res) => {
  try {
    Property.find({
      agency: req.query.agency,
      noOfReports: { $gt: 0 },
    })
      .select("_id")
      .exec((err, result) => {
        if (err) {
          return res.status(401).send(err);
        }

        Property.find({
          agency: req.query.agency,
        })
          .select("_id")
          .exec((err, result1) => {
            console.log("RESULT DDS", result1);
            if (err) {
              return res.status(401).status(err);
            }
            if (result && result1) {
              return res.status(200).json({
                reported: result.length,
                properties: result1.length,
              });
            }
          });
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
   STATS FOR REPORTED PROPERTIES
---------------------------------------- */
router.get("/typeOfProperties", async (req, res) => {
  // "name" : { $regex : /Andrew/i }
  try {
    let [commercial, residential, industrial, land] = await Promise.all([
      Property.find({
        agency: req.query.agency,
        type: { $regex: /Commercial/i },
      }).select("_id"),
      Property.find({
        agency: req.query.agency,
        type: { $regex: /Residential/i },
      }).select("_id"),
      Property.find({
        agency: req.query.agency,
        type: { $regex: /Industrial/i },
      }).select("_id"),
      Property.find({
        agency: req.query.agency,
        type: { $regex: /Land/i },
      }).select("_id"),
    ]);

    return res.status(200).json({
      commercial: commercial.length,
      residential: residential.length,
      industrial: industrial.length,
      land: land.length,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
       UPLOAD PROPERTIEs
---------------------------------------- */
router.post("/uploadProperty", async (req, res) => {
  try {
    console.log("Body", req.body);
    const data = req.body;
    let property = new Property({
      title: data.title,
      type: data.type,
      cost: data.cost,
      location: data.location,
      bathrooms: data.bathrooms,
      rooms: data.rooms,
      description: data.description,
      type: data.type.item,
      network: data.network,
      Amenities: data.amenity,
      propertyImages: data.images,
      city: data.city,
      area: data.area,
      panorama_url: data.panorama_url,
      video_url: data.video_url,
      cose: data.cost,
      category: data.category,
      agency: data.agency,
    });
    console.log(
      "SAVING--------------------------------------------------------"
    );
    const savedProperty = await property.save();
    console.log("Property", savedProperty);
    if (savedProperty) {
      return res.status(200).send(true);
    } else {
      console.log("WRONG");
      return res.status(422).send(false);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
        PROPERTIEs SEARCH
---------------------------------------- */
router.get("/searchProperty", (req, res) => {
  let partialToMatch = new RegExp(req.query.title, "i");
  let query = { title: partialToMatch };
  const type = req.query.type;
  if (type) {
    query = { title: partialToMatch, type: type };
  }

  console.log("Search--------------");
  Property.find(query, function (err, data) {
    if (err) return res.json({ error: err, status: "400" });
    console.log("Search Data-----", data);
    return res.json({ status: "200", data: data });
  });
});

/*----------------------------------------
        FILTER PROPERTY
---------------------------------------- */
router.post("/filterProperty", (req, res) => {
  console.log("Req Body data", req.body);
  const {
    priceMinimum,
    priceMaximum,
    type,
    property,
    amenity,
    areaMaximum,
    areaMinimum,
    city,
  } = req.body;
  console.log("Filter Body", req.body.data);
  Property.find(
    {
      cost: { $lt: priceMaximum, $gt: priceMinimum },
      area: { $lt: areaMaximum, $gt: areaMinimum },
      type: type,
      category: property,
      Amenities: { $in: amenity },
      city,
    },
    function (err, data) {
      if (err) return res.json({ error: err, status: "400" });
      console.log("Filter Data", data);
      res.json({ data: data });
    }
  );
});

module.exports = router;
