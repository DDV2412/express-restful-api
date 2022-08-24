const app = require("./app");
// import logger
const logger = require("./utils/logger-winston");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

app.set("host", process.env.PROXY || `http://localhost`);
app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
  logger.info(`Server is running at ${app.get("host")}:${app.get("port")}`);
});
