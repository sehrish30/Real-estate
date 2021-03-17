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
      .select("-attachments -password")
      .skip(skip)
      .limit(count);

    if (!agencyList) {
      return res.status(204).send("No Results found");
    }

    res.send(agencyList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
      Get all pending agencies
---------------------------------------- */
router.get(`/pending-agencies`, async (req, res) => {
  try {
    const query = { isApproved: false };

    const agencyList = await Agency.find(query);

    if (!agencyList) {
      return res.status(204).send("No results found");
    }
    res.status(200).send(agencyList);
  } catch (err) {
    return res.status(400).json({ error: e });
  }
});

/*----------------------------------------
            Agency DETAILS
---------------------------------------- */
router.get("/:id", async (req, res) => {
  const agency = await Agency.findById(req.params.id).select(
    "-attachments -password"
  );

  if (!agency) {
    return res
      .status(400)
      .json({ message: "The user with the given ID was not found" });
  }

  res.status(200).send(agency);
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
router.delete("/rejected/:id", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).res("Invalid agency");
    }

    // because first element is Bearer then token so we need token
    // split will convert this to array
    const token = authHeader && authHeader.split(` `)[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // appkey is the secret key used to sign jwt
    // user is encoded inside auth token which was sent as payload to jwt
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      // access this user in our controller
      const { isAdmin } = decoded;

      if (isAdmin) {
        Agency.findByIdAndDelete(req.params.id)
          .then((user) => {
            if (user) {
              user.attachments.map((attachment) => {
                cloudinary.uploader.destroy(
                  attachment.file.public_id,
                  async (result) => {
                    if (result.result == "ok") {
                      console.log("DONE");
                    }
                  }
                );
              });
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

router.put("/approved", async (req, res) => {
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

        Agency.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              password: passwordHash,
              isApproved: true,
              attachments: [],
            },
          }
          // { upsert: true }
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
                console.log(err);
                return res.status(401).send(err);
              }
            });

            result.attachments.map((attachment) => {
              cloudinary.uploader.destroy(
                attachment.file.public_id,
                async (result) => {
                  console.log("Cloudinary", result);
                  if (result.result == "ok") {
                    console.log("DONE");
                  }
                }
              );
            });
            return res
              .status(200)
              .send(
                `You are a certified agency. Your password is ${password}${email}`
              );
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
        { expiresIn: "5d" }
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
    return res.status(200).send("Not found");
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

/*----------------------------------------
            Agency UPDATE Password
---------------------------------------- */

router.put(`/change-password`, async (req, res) => {
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

      if (agencyId === req.body.id) {
        agency = await Agency.findById(req.body.id).select("password");

        if (bcrypt.compareSync(req.body.password, agency.password)) {
          const passwordHash = bcrypt.hashSync(req.body.newPassword, 14);

          // Update agency with hashed password
          newAgency = await Agency.findByIdAndUpdate(req.body.id, {
            password: passwordHash,
          });

          // generate token to send to user
          const token = jwt.sign(
            {
              agencyId: newAgency.id,
              isAdmin: true,
            },
            process.env.SECRET,
            {
              expiresIn: "15d",
            }
          );
          newAgency.password = undefined;
          newAgency.isApproved = undefined;
          const returnData = {
            newAgency,
            token,
          };
          return res.status(200).send(returnData);
        }
      } else {
        return res.status(401).send("User not authorized");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
