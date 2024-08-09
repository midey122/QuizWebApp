const { log } = require("console");

const Check = (req, res, next) => {
    let user = req.cookies;
    log("user njfbjdbg", user);
//   req.user = user;
  // log(`${req.method} `);
  next();
};
module.exports = Check;
