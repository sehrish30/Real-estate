const { User } = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const mongoose = require("mongoose");

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
                REGISTER
----------------------------------------- */

router.post("/register", async (req, res) => {
  try {
    const { email, dp } = req.body;

    // hash user password
    const passwordHash = bcrypt.hashSync(req.body.password, 14);

    let user = new User({
      email,
      dp,
      password: passwordHash,
    });

    user = await user.save();

    if (!user) return res.status(400).send("The User couldnot be registered");
    return res.send(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
                REGISTER Google User
----------------------------------------- */

router.post("/google-register", async (req, res) => {
  try {
    const { email, photoUrl } = req.body;
    console.log(email, photoUrl);
    let user = new User({
      email,
      dp: photoUrl,
      isGoogle: true,
    });

    user = await user.save();

    if (!user) return res.status(400).send("The User couldnot be registered");
    return res.send(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*----------------------------------------
                LOGIN
----------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const secret = process.env.SECRET;
    if (!user) {
      return res.status(400).send("No user with this email");
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // Generate token for user after user email exists and password matches
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: "15d",
        }
      );
      return res
        .status(200)
        .send({ email: user.email, token, dp: user.dp, isGoogle: false });
    } else {
      return res.status(400).send("Wrong Password");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

/*----------------------------------------
                Google login
----------------------------------------- */
router.post("/google-login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(req.body);
    if (!user) {
      return res.status(400).send("No user with this email");
    }
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "15d",
      }
    );

    return res
      .status(200)
      .send({ email: user.email, dp: user.dp, token, isGoogle: true });
  } catch (e) {
    return res.status(500).send(e);
  }
});

/*----------------------------------------
            RESET PASSWORD
----------------------------------------- */

router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET;
    if (!user) {
      return res.status(400).send("No user with this email");
    }
    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // Generate token for user after user email exists and password matches
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
        code,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    user.resetToken = token;
    // Valid for 1 hr
    user.expireToken = Date.now() + 3600000;

    user.save().then((result) => {
      let mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Iconic Real Estate ✔",
        template: "index",
        context: {
          code: code,
        },
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return res.status(401).send(err);
        }
        return res.status(200).send({ code, token });
      });
      // transporter.sendMail(
      //   {
      //     to: user.email,
      //     from: process.env.EMAIL,
      //     subject: "Iconic Real Estate ✔",
      //     html: `<h1>Your code is ${code}</h1><h5>Expires in 1 hr</h5>`,
      //   },
      //   (err, data) => {
      //     if (err) {
      //       return res.status(401).send(err);
      //     }
      //     return res.status(200).send({ code, token });
      //   }
      // );
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

/*----------------------------------------
        ENTER NEW PASSWORD
----------------------------------------- */

router.post("/enter-password", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(` `)[1];

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const user = {};
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      User.findOne({
        email: req.body.email,
        resetToken: token,
        expireToken: { $gt: Date.now() },
      }).then((user) => {
        if (!user) {
          return res.status(401).send("Try again Session expired");
        }

        // hash password and save it
        const hashedPassword = bcrypt.hashSync(req.body.password, 14);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.status(200).send("User updated succcessfully");
        });
      });
    });
  } catch (e) {
    res.status(400).send("Something is wrong on our end");
  }
});

/*----------------------------------------
           CHECK USER CODE
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
    console.log(code, req.body.code);
    if (Number(code) == Number(req.body.code)) {
      return res.status(200).send(true);
    } else {
      return res.status(401).send(false);
    }
  });
});

/*----------------------------------------
        SEARCH USER BY ID
----------------------------------------- */

router.get("/getuser", async (req, res) => {
  try {
    console.log("USERID", req.query);
    const user = await User.findById(req.query.userId).select("-password");
    if (!user) {
      return res
        .status(500)
        .json({ message: "The user with the given ID was not found" });
    }

    return res.status(200).send(user);
  } catch (e) {
    console.error(e);
  }
});

/*----------------------------------------
        GET USER details
----------------------------------------- */
router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find(req.params.userId).select("-password");

    if (!userList) {
      return res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (e) {
    console.error(e);
  }
});

/*----------------------------------------
            USER CHANGE Password
---------------------------------------- */
router.put(`/change-password`, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(` `)[1];
  console.error(req.body);
  if (!mongoose.isValidObjectId(req.body.id)) {
    return res.status(400).res("Invalid User");
  }

  try {
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err });
      }
      const { userId } = decoded;

      if (userId === req.body.id) {
        user = await User.findById(req.body.id).select("password");

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const passwordHash = bcrypt.hashSync(req.body.newPassword, 14);

          // Update user with hashed password
          newUser = await User.findByIdAndUpdate(req.body.id, {
            password: passwordHash,
          });

          // generate token to send to user
          const token = jwt.sign(
            {
              userId: newUser.id,
              isAdmin: newUser.isAdmin,
            },
            process.env.SECRET,
            {
              expiresIn: "15d",
            }
          );
          newUser.password = undefined;

          const returnData = {
            newUser,
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
            ENABLE NOTIFICATION
----------------------------------------- */
router.put(`/update-token`, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      {
        notificationToken: req.body.pushtoken,
        enableNotification: true,
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

/*----------------------------------------
            TURN OFF NOTIFICATION
----------------------------------------- */
router.put(`/remove-token`, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      {
        notificationToken: undefined,
        enableNotification: false,
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
