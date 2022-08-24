const cors = require("cors");

const corsOption = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const corsRequest = cors(corsOption);
const corsAllRequest = cors();

module.exports = {
  corsRequest,
  corsAllRequest,
};
