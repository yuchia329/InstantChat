const moment = require("moment-timezone");

function getCurrentTime() {
  return moment.tz(Date.now(), "Asia/Taipei").format("YYYY-MM-DD HH:mm:ss");
}

module.exports = { getCurrentTime };
