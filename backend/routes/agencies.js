const { Agency } = require("../models/agency");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

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

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

/*----------------------------------------
            ALL AGENCIES
---------------------------------------- */

router.get(`/`, async (req, res) => {
  try {
    let locationFilter = {};
    let nameFilter = {};
    let mainFilter = {};

    // user can query by name and location
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

        // hash password
        const email = req.body.email.split("@").shift();
        const password = `${email}${randomNumber}`;
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
        )
          .then((result, err) => {
            let mailOptions = {
              from: process.env.EMAIL,
              to: req.body.email,
              subject: "Iconic Real Estate ✔",
              template: "agency",
              context: {
                password: password,
              },
            };

            transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                return res.status(401).send(err);
              }
              return res
                .status(200)
                .send(
                  `You are a certified agency. Your password is ${password}${email}`
                );
            });
          })
          .catch((e) => {
            console.log(e);
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
    const agency = await Agency.findOne({ email: req.body.email }).select([
      "-attachments",
      "-isApproved",
    ]);
    const secret = process.env.SECRET;
    if (!agency) {
      return res.status(400).send("The agency email not found");
    }

    if (agency && bcrypt.compareSync(req.body.password, agency.password)) {
      agency.password = undefined;
      const token = jwt.sign(
        {
          agencyId: agency.id,
          isApproved: agency.isApproved,
        },
        secret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ agency: agency, token });
    } else {
      return res.status(400).send("Password Incorrect");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

/*----------------------------------------
            Agency UPDATE
---------------------------------------- */

router.put("/edit-agency", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(` `)[1];

  if (!mongoose.isValidObjectId(req.body.id)) {
    return res.status(400).res("Invalid agency");
  }

  try {
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { agencyId } = decoded;

      if (agencyId == req.body.id) {
        agency = Agency.findByIdAndUpdate(
          req.body.id,
          {
            bio: req.body.bio,
            location: req.body.location,
          },
          { new: true }
        ).exec((err, result) => {
          if (err) {
            return res.status(422).send("Agency couldn't be updated");
          } else {
            return res.send(result);
          }
        });
      } else {
        return res.status(422).send("Something is wrong");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

/*----------------------------------------
            Agency UPDATE Logo
---------------------------------------- */

router.delete(`/delete-image`, async (req, res) => {
  // Update Profile dp
  console.log(req.body);
  cloudinary.uploader.destroy(req.body.imageId, async (result) => {
    console.log(result);
    if (result.result == "ok") {
      return res.status(200).send("DONE");
    }
    return res.status(401).send("Not found");
  });
});

router.put(`/upload-logo`, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(` `)[1];
  console.log(req.body);
  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err });
    }
    const { agencyId } = decoded;

    if (agencyId == req.body.id) {
      await Agency.findByIdAndUpdate(
        req.body.id,
        {
          logo: {
            public_id: req.body.public_id,
            url: req.body.secure_url,
          },
        },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(422).send(err);
        } else {
          result.password = undefined;
          result.isApproved = undefined;

          return res.send(result);
        }
      });
    }
  });
});

module.exports = router;
