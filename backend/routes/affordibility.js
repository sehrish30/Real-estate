const express = require("express");
const router = express.Router();
const { Affordibility } = require("../models/affordibility");
const jwt = require("jsonwebtoken");
/*----------------------------------------
            SET VALUES
---------------------------------------- */

router.post(`/postAdmin`, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(` `)[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      // access this user in our controller
      const { isAdmin } = decoded;
      if (isAdmin) {
        Affordibility.findByIdAndDelete(req.body.id).exec((err, result) => {
          if (err) {
            console.log("PREVIOUS ERROR");
          }
          console.log("PREVIOUS DELETED");
        });
        const {
          first,
          second,
          third,
          four,
          five,
          six,
          seven,
          eight,
          nine,
          ten,
        } = req.body;
        let affordibility = new Affordibility({
          first,
          second,
          third,
          four,
          five,
          six,
          seven,
          eight,
          nine,
          ten,
        });
        affordibility = await affordibility.save();
        if (!affordibility) return res.status(400).send("Not affordable post");
        return res.status(200).send(affordibility);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.get("/get", async (req, res) => {
  try {
    Affordibility.find().exec((err, result) => {
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
