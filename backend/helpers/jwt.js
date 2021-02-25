// express-jwt used to secure apis
const expressJwt = require("express-jwt");

const authJwt = () => {
  const secret = process.env.SECRET;

  /* JWT library will disassemble our token
    signed from secret and from our server. It will
    check both. So we can identify user */
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    // isRevoked,
  }).unless({
    path: [
      { url: /\/agencies(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/users(.*)/, methods: ["GET", "OPTIONS"] },
      `/users/register`,
      `/users/login`,
      `/agencies/register`,
      `/agencies/login`,
    ],
  });
};

// req e.g req body from frontend
// payload from token and this user is sending me from payload headers

// payload contains data inside token
// e.g I want data like isAdmin which is signed to the user
// which this user is sending me with req headers
async function isRevoked(req, payload, done) {
  console.log(req.url);
  const url = req.url;
  if (!payload.isAdmin) {
    // reject the token if not admin
    done(null, true);
  }

  // if admin? allow without any parameters
  done();
}

module.exports = authJwt;
