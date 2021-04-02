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
const sendgridTransport = require("nodemailer-sendgrid-transport");

const sendtransporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

sendtransporter.use(
  "compile",
  hbs({
    viewEngine: "express-handlebars",
    viewPath: "./views/",
  })
);

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
        GET ALL RATINGS OG AGENCIES
----------------------------------------- */

router.get("/all-reviews", async (req, res) => {
  console.log("Data", req.query);

  try {
    const agency = await Agency.findById(req.query.id)
      .select("totalRating rating")
      .populate({
        path: "rating.user",
        select: "dp email",
        // options: { sort: { rate: -1 } },
      })
      .slice("rating", parseInt(req.query.limit));
    console.log("NO REACH");

    if (!agency) {
      return res.status(422).send("No agency found");
    }
    if (agency.length < 1) {
      return res.status(200).send(false);
    }
    return res.status(200).send(agency);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
           Review AGENCY
----------------------------------------- */

// router.get("/check-users-review", async (req, res) => {
//   console.log("Data", req.query);
//   try {
//     const agency = await Agency.find({
//       _id: req.query.id,
//       "reviews.user": req.query.userId,
//     })
//       .select("reviews")
//       .populate("reviews.user", "dp email");

//     if (!agency) {
//       return res.status(422).send("No agency found");
//     }
//     if (agency.length < 1) {
//       return res.status(200).send(false);
//     }
//     return res.status(200).send(agency);
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });

/*----------------------------------------
           Rating AGENCY
----------------------------------------- */

router.get(`/check-users-rating`, async (req, res) => {
  console.log("Data", req.query);
  try {
    const agency = await Agency.find({
      _id: req.query.id,
      "rating.user": req.query.userId,
    })
      .select("rating")
      .populate("rating.user", "dp email");

    if (!agency) {
      return res.status(422).send("No agency found");
    }
    if (agency.length < 1) {
      return res.status(200).send(false);
    }
    return res.status(200).send(agency);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
            Agency DETAILS
---------------------------------------- */
router.get("/:id", async (req, res) => {
  const agency = await Agency.findById(req.params.id)
    .select("-attachments -password")
    .populate("reviews.user", "dp email");

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
              isAdmin: false,
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

/*----------------------------------------
        CHECK AGENCY EXISTS
----------------------------------------- */
router.get("/email-exists/:email", async (req, res) => {
  try {
    const agency = await Agency.findOne({ email: req.params.email });
    if (!agency) {
      return res
        .status(400)
        .send("Sorry, we have no agency registered with this email");
    }
    res.status(200).send(true);
  } catch (e) {
    console.error(e);
  }
});

/*----------------------------------------
        Agency FORGOT PASSWORD
---------------------------------------- */

router.post("/reset-password", async (req, res) => {
  try {
    const agency = await Agency.findOne({ email: req.body.email });
    const secret = process.env.SECRET;
    if (!agency) {
      return res.status(400).send("No user with this email");
    }
    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // Generate token for user after user email exists and password matches
    const token = jwt.sign(
      {
        userId: agency.id,
        code,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    agency.resetToken = token;
    // Valid for 1 hr
    agency.expireToken = Date.now() + 3600000;

    agency.save().then((result) => {
      let mailOptions = {
        from: process.env.SENDGRI_EMAIL,
        to: agency.email,
        subject: "Iconic Real Estate ✔",
        template: "index",
        context: {
          code: code,
        },
      };

      sendtransporter.sendMail(mailOptions, (err, data) => {
        console.log(err, data);
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send({ code, token });
      });
      console.log(agency.email, "EMAIL");
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

/*----------------------------------------
           CHECK AGENCY CODE
----------------------------------------- */
router.post("/check-code", async (req, res) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(` `)[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err });
    }
    const { code } = decoded;
    if (Number(code) == Number(req.body.code)) {
      return res.status(200).send(true);
    } else {
      return res.status(401).send(false);
    }
  });
});

/*----------------------------------------
      AGENCY ENTER NEW PASSWORD
----------------------------------------- */
router.post("/enter-password", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(` `)[1];

    Agency.findOne({
      email: req.body.email,
      resetToken: token,
      expireToken: { $gt: Date.now() },
    }).then((agency) => {
      if (!agency) {
        return res.status(401).send("Try again session expired");
      }

      // hash password then save it
      const hashedPassword = bcrypt.hashSync(req.body.password, 14);

      agency.password = hashedPassword;
      agency.resetToken = undefined;
      agency.expireToken = undefined;
      agency.save().then((savedAgency) => {
        res.status(200).send("Agency password updated");
      });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
      REVIEWS FOR AGENCY
----------------------------------------- */

router.post(`/review`, async (req, res) => {
  try {
    await Agency.findById(req.body.id, (err, result) => {
      if (err) {
        return res.status(422).send(err);
      }
      if (result) {
        let index = result.reviews.findIndex(
          (review) => review.user == req.body.userId
        );

        if (index >= 0) {
          result?.reviews.splice(index, 1);
        }

        result.reviews.push({
          user: req.body.userId,
          text: req.body.content,
          time: new Date().toISOString(),
          replies: {},
        });

        result.save().then((response) => {
          return res.status(200).send(response);
        });
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
      AGENCY REPLY TO REVIEW
----------------------------------------- */
router.post(`/reply-review`, async (req, res) => {
  try {
    console.log(req.body, "REPLY");
    await Agency.findById(req.body.id, (err, result) => {
      if (err) {
        return res.status(422).send(err);
      }
      if (result) {
        for (let i = 0; i < result.rating.length; i++) {
          if (result.rating[i].user == req.body.userId) {
            result.rating[i].replies = {
              text: req.body.content,
              time: new Date().toISOString(),
            };
          }
        }

        result.save().then((response) => {
          return res.status(200).send(response);
        });
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
            RATE AGENCY
----------------------------------------- */
router.post(`/rate`, async (req, res) => {
  try {
    await Agency.findById(req.body.id, (err, result) => {
      if (err) {
        return res.status(422).send(err);
      }

      if (result) {
        // Remove the rating if already given
        let index = result?.rating.findIndex(
          (element) => element.user == req.body.userId
        );

        if (index >= 0) {
          result?.rating.splice(index, 1);
        }

        var total_ratings = parseInt(req.body.rate);
        let final_rating = parseInt(req.body.rate);
        for (let i = 0; i < result?.rating?.length; i++) {
          total_ratings += parseInt(result?.rating[i]?.rate);
        }
        if (result?.rating.length > 0) {
          final_rating = parseInt(total_ratings) / (result?.rating?.length + 1);
        }

        result?.rating.push({
          rate: req.body.rate,
          user: req.body.userId,
          text: req.body.content,
          time: new Date().toISOString(),
          replies: {},
        });

        result.totalRating = parseInt(final_rating.toFixed(2));
        result.save().then((response) => {
          return res.status(200).send(response);
        });
      } else {
        return res.status(422).send("Agency not found");
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
