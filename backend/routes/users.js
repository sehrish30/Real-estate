const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/*----------------------------------------
                REGISTER
----------------------------------------- */

router.post("/register", async (req, res) => {
  try {
    const { email, isAdmin, dp } = req.body;

    // hash user password
    const passwordHash = bcrypt.hashSync(req.body.password, 14);

    let user = new User({
      email,
      isAdmin,
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
          expiresIn: "1d",
        }
      );
      return res.status(200).send({ user: user.email, token });
    } else {
      return res.status(400).send("Wrong Password");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
