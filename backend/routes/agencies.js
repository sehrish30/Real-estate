const { Agency } = require("../models/agency");
const express = require("express");
const { User } = require("../../../EcommerceProject/backend/models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/*----------------------------------------
            ALL AGENCIES
---------------------------------------- */

router.get(`/`, async (req, res) => {
  try {
    let locationFilter = {};
    let nameFilter = {};
    let mainFilter = {};
    if (req.query.location) {
      locationFilter = { location: { $in: req.query.location.split(",") } };
      mainFilter = { ...locationFilter };
    }
    if (req.query.name) {
      let agencyName = new RegExp("^" + req.query.name);
      nameFilter = { name: agencyName };
      mainFilter = { ...mainFilter, ...nameFilter };
    }

    // pagination agents
    let skip = 0;
    let count = null;
    if (req.query.count) {
      count = 10;
      skip = count - 10;
    }

    const agencyList = await Agency.find(mainFilter)
      .select("-attachments")
      .skip(skip)
      .limit(count);

    if (!agencyList) {
      return res.status(500).send("No Results found");
    }

    res.send(agencyList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
            Agency DETAILS
---------------------------------------- */
router.get("/:id", async (req, res) => {
  const Agency = await Agency.findById(req.params.id).select("-attachments");

  if (!Agency) {
    return res
      .status(400)
      .json({ message: "The user with the given ID was not found" });
  }

  res.status(200).send(Agency);
});

/*----------------------------------------
            REGISTER AGENCY
---------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, phoneNumber, email, logo, location, attachments } = req.body;
    let agency = new Agency({
      name,
      phoneNumber,
      email,
      logo,
      location,
      attachments,
    });

    agency = await agency.save();
    if (!agency) return res.status(400).send("We will contact you shortly");

    return res.send(agency);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
            Total Agencies
---------------------------------------- */
router.get(`/get/count`, async (req, res) => {
  const agenciesCount = await Agency.countDocuments((count) => count);

  if (!agenciesCount) {
    return res.status(500).send("No agencies found");
  }

  res.send({
    agenciesCount,
  });
});

/*----------------------------------------
            Agency REJECTED
---------------------------------------- */
router.delete("/rejected", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    // because first element is Bearer then token so we need token
    // split will convert this to array
    const token = authHeader && authHeader.split(` `)[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // appkey is the secret key used to sign jwt
    // user is encoded inside auth token which was sent as payload to jwt
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      console.log(token);
      if (err) {
        return res.status(401).json({ error: err });
      }
      // access this user in our controller
      const { isAdmin } = decoded;
      if (isAdmin) {
        User.findByIdAndDelete(req.params.id)
          .then((user) => {
            if (user) {
              return res
                .status(200)
                .json({ success: true, message: "The user is deleted" });
            } else {
              return res.status(404).json({
                success: false,
                message: "Agency couldnot be deleted Try Again!",
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({ success: false, error: err });
          });
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: err });
  }
});

/*----------------------------------------
            Agency ACCEPTED
---------------------------------------- */

router.post("/approved", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    // because first element is Bearer then token so we need token
    // split will convert this to array
    const token = authHeader && authHeader.split(` `)[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // appkey is the secret key used to sign jwt
    // user is encoded inside auth token which was sent as payload to jwt
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      console.log(token);
      if (err) {
        return res.status(401).json({ error: err });
      }
      // access this user in our controller
      const { isAdmin } = decoded;
      if (isAdmin) {
        const randomNumber = Math.floor(Math.random() * 1000 + 1);

        // has password
        const password = `${req.body.name}${randomNumber}`;
        const passwordHash = bcrypt.hashSync(password, 14);
        Agency.updateOne(
          { _id: req.body.id },
          {
            $set: {
              password: passwordHash,
              isApproved: true,
            },
          },
          { upsert: true }
        ).then((result, err) => {
          return res
            .status(200)
            .send(`You are a certified agency. Your password is ${password}`);
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
});

/*----------------------------------------
            Agency LOGIN
---------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const agency = await Agency.findOne({ email: req.body.email }).catch((e) =>
      console.error(e)
    );
    const secret = process.env.SECRET;
    if (!agency) {
      return res.status(400).send("The agency email not found");
    }

    if (agency && bcrypt.compareSync(req.body.password, agency.password)) {
      const token = jwt.sign(
        {
          agencyId: agency.id,
          isApproved: agency.isApproved,
        },
        secret,
        { expiresIn: "1d" }
      );
      return res.status(200).send({ agency: agency.name, token });
    } else {
      return res.status(400).send("Password Incorrect");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
